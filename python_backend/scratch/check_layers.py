import tensorflow as tf
import os
import config_files.digestive_model_config as digestive_config
import config_files.liver_model_config as liver_config
import config_files.iris_val_model_config as iris_val_config

def find_last_conv_layer(model):
    for layer in reversed(model.layers):
        # Check if it's a conv layer (including depthwise, etc.)
        if 'conv' in layer.__class__.__name__.lower() or 'conv' in layer.name.lower():
            return layer.name
    return None

def print_layers(model_path, name):
    print(f"\n--- Analysis for {name} ({model_path}) ---")
    if not os.path.exists(model_path):
        print("Model path does not exist.")
        return
    try:
        model = tf.keras.models.load_model(model_path, compile=False)
        last_conv = find_last_conv_layer(model)
        print(f"Last Conv Layer: {last_conv}")
        # Also print last 5 layers to be sure
        for layer in model.layers[-5:]:
            print(f"  {layer.name} ({layer.__class__.__name__})")
    except Exception as e:
        print(f"Error loading model: {e}")

print_layers(digestive_config.MODEL_PATH, "Digestive")
print_layers(liver_config.MODEL_PATH, "Liver")
print_layers(iris_val_config.MODEL_PATH, "Iris Validation")
