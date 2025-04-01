import os
import json
import cv2
from capture.capture_image import capture_image
from capture.validate_image import validate_image
from inference.run_inference import run_inference
from inference.dump_json import dump_json
from visualization.display_image import display_image
from visualization.display_image_with_bounding_boxes import display_image_with_bounding_boxes

JSON_PATH = "tmp/result.json"
CAMERA_PATH = "tmp/captured_image.jpg"


def main():
    image_path = capture_image(CAMERA_PATH)
    # image_path = "images/test1.jpg"
    try:
        validate_image(image_path)
    except Exception as e:
        print(f"Error in reading image: {e}")
        return

    result = run_inference(image_path)
    print(result)

    dump_json(result, JSON_PATH)

    #display_image(image_path)
    display_image_with_bounding_boxes(image_path, result)

if __name__ == "__main__":
    main()
