# -*- coding: utf-8 -*-
"""Model loading, preprocessing and prediction for iris validation."""

import io
import os
from typing import Optional

import cv2
import numpy as np
from PIL import Image

import config_files.iris_val_model_config as iris_val_config

_model = None


def load_iris_val_model():
    """Load iris validation Keras model (singleton)."""
    global _model
    if _model is None:
        import tensorflow as tf

        if not os.path.exists(iris_val_config.MODEL_PATH):
            raise FileNotFoundError(
                f"Iris validation model not found at {iris_val_config.MODEL_PATH}"
            )
        _model = tf.keras.models.load_model(iris_val_config.MODEL_PATH)
    return _model


def _decode_and_resize(image_bytes: bytes) -> np.ndarray:
    """Decode bytes to RGB image and resize to model input size."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        img = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))
    else:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    img = cv2.resize(img, (iris_val_config.IMG_SIZE, iris_val_config.IMG_SIZE))
    return img


def preprocess_iris_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess image for iris validation model.
    Pipeline mirrors training notebook: RGB + resize(256) + float32 + batch dimension.
    """
    img = _decode_and_resize(image_bytes)
    img = np.array(img, dtype=np.float32)
    img = np.expand_dims(img, axis=0)
    return img


def predict_iris_validation(image_array: np.ndarray) -> dict:
    """Run iris validation prediction and return label + confidence + probabilities."""
    model = load_iris_val_model()
    predictions = model.predict(image_array, verbose=0)
    probs = predictions[0]
    pred_idx = int(np.argmax(probs))
    pred_class = iris_val_config.CLASSES[pred_idx]
    confidence = float(probs[pred_idx])

    return {
        "prediction": pred_class,
        "confidence": round(confidence, 4),
        "is_valid": pred_class == "valid_iris",
        "probabilities": {
            cls: round(float(p), 4) for cls, p in zip(iris_val_config.CLASSES, probs)
        },
    }


def compute_grad_cam_iris(
    image_array: np.ndarray, layer_name: str, class_index: Optional[int] = None
) -> np.ndarray:
    """
    Compute Grad-CAM heatmap for a given conv layer in iris validation model.
    """
    import tensorflow as tf

    model = load_iris_val_model()

    grad_model = tf.keras.models.Model(
        [model.inputs], [model.get_layer(layer_name).output, model.output]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(image_array)
        if class_index is None:
            class_index = int(tf.argmax(predictions[0]))
        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.math.reduce_max(heatmap)
    heatmap = tf.where(max_val == 0, heatmap, heatmap / max_val)

    return heatmap.numpy()


def generate_grad_cam_iris_image(
    image_bytes: bytes, layer_name: str = 'conv2d_1', class_index: Optional[int] = None
) -> np.ndarray:
    """
    Generate a Grad-CAM overlay image for the iris validation model.
    """
    base_img = _decode_and_resize(image_bytes)
    input_batch = np.expand_dims(base_img.astype(np.float32), axis=0)

    heatmap = compute_grad_cam_iris(input_batch, layer_name, class_index)
    heatmap = cv2.resize(heatmap, (base_img.shape[1], base_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(base_img, 0.6, heatmap_color, 0.4, 0)
    return overlay
