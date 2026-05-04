# -*- coding: utf-8 -*-
"""Model loading, preprocessing, prediction and Grad-CAM utilities."""

import io
import os
from typing import Optional

import cv2
import numpy as np
from PIL import Image

import config_files.digestive_model_config as digestive_config

_model = None


def load_model():
    """Load the Keras model (singleton)."""
    global _model
    if _model is None:
        import tensorflow as tf

        if not os.path.exists(digestive_config.MODEL_PATH):
            raise FileNotFoundError(f"Model not found at {digestive_config.MODEL_PATH}")
        _model = tf.keras.models.load_model(digestive_config.MODEL_PATH)
    return _model


def _decode_and_resize(image_bytes: bytes) -> np.ndarray:
    """Decode raw bytes to RGB image and resize to model input size."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        img = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))
    else:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    img = cv2.resize(img, (digestive_config.IMG_SIZE, digestive_config.IMG_SIZE))
    return img


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocess image for model input.
    Expects RGB, 256x256, float32 - matching training pipeline.
    """
    img = _decode_and_resize(image_bytes)
    img = np.array(img, dtype=np.float32)
    img = np.expand_dims(img, axis=0)
    return img


def predict(image_array: np.ndarray, image_bytes: Optional[bytes] = None) -> dict:
    """
    Run prediction and return class, confidence, and probabilities.
    """
    model = load_model()
    predictions = model.predict(image_array, verbose=0)
    probs = predictions[0]
    pred_idx = int(np.argmax(probs))
    pred_class = digestive_config.CLASSES[pred_idx]
    confidence = float(probs[pred_idx])

    return {
        "prediction": pred_class,
        "confidence": round(confidence, 4),
        "probabilities": {
            cls: round(float(p), 4) for cls, p in zip(digestive_config.CLASSES, probs)
        },
    }

    # Generate Doctor Referral Validation Report if image_bytes are provided
    if image_bytes:
        from model_utile_files.doctor_validation_service import get_validation_service
        validation_model = get_validation_service()
        report_data = validation_model.generate_validation_report(
            image_bytes=image_bytes,
            local_score=confidence,
            local_label=pred_class,
            organ="Digestive"
        )
        # Refine the final UI confidence score based on Doctor Validation Model's visual assessment
        if "refined_score" in report_data:
            # Overwrite CNN confidence with refined "symptom-aware" confidence
            # Respect 95% maximum for ethical reasons
            refined = min(0.95, report_data["refined_score"])
            result["confidence"] = round(refined * 100, 2)
        else:
            # Convert 0-1 confidence to 0-100 percentage for UI
            result["confidence"] = round(confidence * 100, 2)
            
        result.update(report_data)
    else:
        # Convert 0-1 confidence to 0-100 percentage for UI if no validation report
        result["confidence"] = round(confidence * 100, 2)

    return result


def compute_grad_cam(
    image_array: np.ndarray, layer_name: str, class_index: Optional[int] = None
) -> np.ndarray:
    """
    Compute Grad-CAM heatmap for a given conv layer.

    - image_array: preprocessed batch with shape (1, H, W, 3)
    - layer_name: name of the last convolutional layer in the model
    - class_index: optional target class index; if None, uses predicted class
    """
    import tensorflow as tf

    model = load_model()

    model_inputs = model.inputs
    if not isinstance(model_inputs, (list, tuple)):
        model_inputs = [model_inputs]

    grad_model = tf.keras.models.Model(
        inputs=model_inputs,
        outputs=[model.get_layer(layer_name).output, model.output],
    )

    with tf.GradientTape() as tape:
        # For a single-input model, pass the tensor directly.
        # For multi-input models, pass a list aligned with model.inputs.
        model_call_inputs = (
            image_array if len(model_inputs) == 1 else [image_array] * len(model_inputs)
        )
        conv_outputs, predictions = grad_model(model_call_inputs, training=False)
        if isinstance(predictions, (list, tuple)):
            if len(predictions) == 0:
                raise ValueError("Model returned empty predictions list")
            predictions = predictions[0]
        if class_index is None:
            class_index = int(tf.argmax(predictions[0]))
        num_classes = predictions.shape[-1]
        if num_classes is None:
            num_classes = int(tf.shape(predictions)[-1].numpy())
        else:
            num_classes = int(num_classes)
        if class_index < 0 or class_index >= num_classes:
            raise ValueError(
                f"class_index {class_index} is out of range for model output with {num_classes} classes"
            )
        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_outputs)
    if grads is None:
        raise ValueError(
            f"Unable to compute gradients for layer '{layer_name}'. Ensure it is a valid convolutional layer connected to the model output."
        )
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = conv_outputs @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)

    heatmap = tf.maximum(heatmap, 0)
    max_val = tf.math.reduce_max(heatmap)
    heatmap = tf.where(max_val == 0, heatmap, heatmap / max_val)

    return heatmap.numpy()


def generate_grad_cam_image(
    image_bytes: bytes, layer_name: str = 'conv2d_3', class_index: Optional[int] = None
) -> np.ndarray:
    """
    Generate a Grad-CAM overlay image for the given input bytes.

    Returns an RGB image (H, W, 3) as uint8.
    """
    # Base image for visualization (uint8 RGB)
    base_img = _decode_and_resize(image_bytes)

    # Preprocessed batch for the model
    input_batch = np.expand_dims(base_img.astype(np.float32), axis=0)

    heatmap = compute_grad_cam(input_batch, layer_name, class_index)
    heatmap = cv2.resize(heatmap, (base_img.shape[1], base_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(base_img, 0.6, heatmap_color, 0.4, 0)
    return overlay

