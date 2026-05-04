# -*- coding: utf-8 -*-
"""Configuration for iris validation model."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Must match training/inference pipeline
IMG_SIZE = 256
CLASSES = ["invalid_iris", "valid_iris"]

MODEL_PATH = os.environ.get(
    "IRIS_VAL_MODEL_PATH",
    str(BASE_DIR / "models" / "iris_val" / "iris_val_new_model.keras"),
)
