def validate_image(image_path):
    import cv2
    import sys
    import os

    # Validate image file
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"File '{image_path}' not found.")
    if not image_path.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
        raise ValueError("Provided file is not a valid image format.")

    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Failed to load image from '{image_path}'.")

    return True
