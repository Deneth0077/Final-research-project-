# -*- coding: utf-8 -*-
"""
Flask API backend for Medical Models
Classification: digestive, liver, spinal
"""

import io
import os
import cv2
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

import config_files.digestive_model_config as digestive_config
import config_files.liver_model_config as liver_config
# import config_files.spinal_model_config as spinal_config

from model_utile_files.digestive_model_utils import (
    generate_grad_cam_image,
    load_model as load_digestive_model,
    predict as predict_digestive,
    preprocess_image as preprocess_digestive_image,
)
from model_utile_files.liver_model_utils import (
    generate_grad_cam_liver_image as generate_grad_cam_liver,
    load_liver_model,
    predict_liver,
    preprocess_liver_image,
)
from model_utile_files.spinal_model_utils import (
    predict as predict_spinal,
    preprocess_image as preprocess_spinal_image,
)
from model_utile_files.iris_val_model_utils import (
    predict_iris_validation,
    preprocess_iris_image,
    generate_grad_cam_iris_image as generate_grad_cam_iris,
)
from model_utile_files.liver_clinical_utils import predict_liver_risk

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = digestive_config.MAX_CONTENT_LENGTH



@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "API is running"})

def check_iris_validity(image_bytes):
    """Check if the provided image is a valid iris."""
    try:
        img_array = preprocess_iris_image(image_bytes)
        result = predict_iris_validation(img_array)
        return result.get("is_valid", False), result
    except Exception as e:
        print(f"Iris validation error: {e}")
        return False, {"error": str(e)}

# --- Digestive Routes ---

@app.route("/digestive/predict", methods=["POST"])
def digestive_predict_endpoint():
    try:
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image"}), 400

        # 1) Validate iris first
        is_valid_iris, iris_result = check_iris_validity(image_bytes)
        if not is_valid_iris:
            return (
                jsonify(
                    {
                        "error": "Iris validation failed.",
                        "details": iris_result,
                        "message": "Not a valid iris image. Please provide a clear iris image (not blurry and iris should be visible)."
                    }
                ),
                400,
            )

        # 2) If valid iris, run digestive prediction
        img_array = preprocess_digestive_image(image_bytes)
        result = predict_digestive(img_array, image_bytes=image_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/digestive/grad-cam", methods=["POST"])
def grad_cam_endpoint():
    """
    Generate Grad-CAM visualization for an uploaded image.

    Form fields / query params:
    - image: image file (required)
    - layer_name: name of the conv layer to use (required)
    - class_index: optional target class index (int); default is predicted class

    Returns a PNG image with the Grad-CAM overlay.
    """
    try:
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify(
                {
                    "error": 'No image provided. Send multipart/form-data with "image" or raw image bytes.'
                }
            ), 400

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image"}), 400

        # Layer name can come from form or query params
        layer_name = 'conv5_block16_concat'
        if not layer_name:
            return jsonify({"error": "Missing required parameter 'layer_name'"}), 400

        class_index_raw = 0
        class_index = int(class_index_raw) if class_index_raw is not None else None

        overlay = generate_grad_cam_image(
            image_bytes=image_bytes,
            layer_name=layer_name,
            class_index=class_index,
        )

        # Encode as PNG for response
        bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
        success, buffer = cv2.imencode(".png", bgr)
        if not success:
            return jsonify({"error": "Failed to encode Grad-CAM image"}), 500

        return send_file(
            io.BytesIO(buffer.tobytes()),
            mimetype="image/png",
            as_attachment=False,
            download_name="grad_cam.png",
        )

    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 500
    except ValueError as e:
        return jsonify({"error": f"Invalid parameter: {e}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
def digestive_grad_cam_endpoint():
    try:
        if "image" in request.files:
            file = request.files["image"]
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        layer_name = request.form.get("layer_name") or request.args.get("layer_name")
        if not layer_name or layer_name == "top_conv":
            layer_name = "conv2d_3"

        overlay = generate_grad_cam_digestive(image_bytes=image_bytes, layer_name=layer_name)
        bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
        success, buffer = cv2.imencode(".png", bgr)
        return send_file(io.BytesIO(buffer.tobytes()), mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Liver Routes ---

@app.route("/liver/predict", methods=["POST"])
def liver_predict_endpoint():
    """Predict liver disease from uploaded image."""
    try:
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image"}), 400

        # 1) Validate iris first
        is_valid_iris, iris_result = check_iris_validity(image_bytes)
        if not is_valid_iris:
            return (
                jsonify(
                    {
                        "error": "Iris validation failed.",
                        "details": iris_result,
                        "message": "Not a valid iris image. Please provide a clear iris image (not blurry and iris should be visible)."
                    }
                ),
                400,
            )

        img_array = preprocess_liver_image(image_bytes)
        result = predict_liver(img_array, image_bytes=image_bytes)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/liver/grad-cam", methods=["POST"])
def liver_grad_cam_endpoint():
    """Generate Grad-CAM visualization for liver model."""
    try:
        if "image" in request.files:
            file = request.files["image"]
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        layer_name = request.form.get("layer_name") or request.args.get("layer_name")
        if not layer_name or layer_name == "top_conv":
            layer_name = "convnext_tiny_stage_3_block_2_identity"

        overlay = generate_grad_cam_liver(image_bytes=image_bytes, layer_name=layer_name)
        bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
        success, buffer = cv2.imencode(".png", bgr)
        return send_file(io.BytesIO(buffer.tobytes()), mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/liver/predict-clinical", methods=["POST"])
def liver_predict_clinical_endpoint():
    """Predict liver disease risk from clinical data."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        prediction = predict_liver_risk(data)
        return jsonify({"prediction": prediction})
    except Exception as e:
        print(f"Error in liver-clinical prediction: {e}")
        return jsonify({"error": str(e)}), 500

# --- Spinal Routes ---

@app.route("/spinal/predict", methods=["POST"])
def spinal_predict_endpoint():
    """Predict spinal disease from uploaded image."""
    try:
        if "image" in request.files:
            file = request.files["image"]
            if file.filename == "":
                return jsonify({"error": "No file selected"}), 400
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        if len(image_bytes) == 0:
            return jsonify({"error": "Empty image"}), 400

        # 1) Validate iris first
        is_valid_iris, iris_result = check_iris_validity(image_bytes)
        if not is_valid_iris:
            return (
                jsonify(
                    {
                        "error": "Iris validation failed.",
                        "details": iris_result,
                        "message": "Not a valid iris image. Please provide a clear iris image (not blurry and iris should be visible)."
                    }
                ),
                400,
            )

        img_array = preprocess_spinal_image(image_bytes)
        result = predict_spinal(img_array)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Info Routes ---

@app.route("/iris/grad-cam", methods=["POST"])
def iris_grad_cam_endpoint():
    """Generate Grad-CAM visualization for iris validation model."""
    try:
        if "image" in request.files:
            file = request.files["image"]
            image_bytes = file.read()
        elif request.data:
            image_bytes = request.data
        else:
            return jsonify({"error": 'No image provided.'}), 400

        layer_name = request.form.get("layer_name") or request.args.get("layer_name")
        if not layer_name or layer_name == "top_conv":
            layer_name = "conv2d_1"

        overlay = generate_grad_cam_iris(image_bytes=image_bytes, layer_name=layer_name)
        bgr = cv2.cvtColor(overlay, cv2.COLOR_RGB2BGR)
        success, buffer = cv2.imencode(".png", bgr)
        return send_file(io.BytesIO(buffer.tobytes()), mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/liver/model-info", methods=["GET"])
def liver_model_info():
    """Return liver model configuration."""
    return jsonify({
        "classes": liver_config.CLASSES,
        "input_size": [liver_config.IMG_SIZE, liver_config.IMG_SIZE],
        "model_path": liver_config.MODEL_PATH,
    })

@app.route("/digestive/model-info", methods=["GET"])
def digestive_model_info():
    return jsonify({
        "classes": digestive_config.CLASSES,
        "input_size": [digestive_config.IMG_SIZE, digestive_config.IMG_SIZE],
        "model_path": digestive_config.MODEL_PATH,
    })

# @app.route("/spinal/model-info", methods=["GET"])
# def spinal_model_info():
#     return jsonify({
#         "classes": spinal_config.CLASSES,
#         "input_size": [spinal_config.IMG_SIZE, spinal_config.IMG_SIZE],
#         "model_path": spinal_config.MODEL_PATH,
#     })


if __name__ == "__main__":
    # Lazy loading: Models will be loaded on first request via their respective utility functions
    print("Starting Flask server... Models will be loaded on demand.")
    
    # Verify model files exist
    import config_files.iris_val_model_config as iris_val_config
    for cfg in [digestive_config, liver_config, iris_val_config]:
        if os.path.exists(cfg.MODEL_PATH):
            print(f"Verified: {cfg.MODEL_PATH} exists.")
        else:
            print(f"Warning: {cfg.MODEL_PATH} NOT found.")

    app.run(host=digestive_config.HOST, port=digestive_config.PORT, debug=True)

