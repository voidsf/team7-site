import os
import json
import cv2
from capture.capture_image import capture_image
from capture.validate_image import validate_image
from inference.run_inference import run_inference
from parse.dump_json import dump_json
from parse.parse_result import parse_result
from visualization.display_image import display_image
from visualization.display_image_with_bounding_boxes import display_image_with_bounding_boxes
from web.update_db import update_db

JSON_PATH = "tmp/result.json"
CAMERA_PATH = "tmp/captured_image.jpg"
DEVICE_ID = "Year 3 Classroom"


def main():
    # capture / validate image
    image_path = capture_image(CAMERA_PATH)
    # image_path = "images/test1.jpg"   # static image for testing
    try:
        validate_image(image_path)
    except Exception as e:
        print(f"Error in reading image: {e}")
        return

    # make request to model for result
    result = run_inference(image_path)
    # print(result)

    # parse and categorize result
    # currently only works for single item todo: account for multiple items by looking at bounding boxes etc.
    item_type, confidence = parse_result(result)
    is_recyclable = item_type != "Non-Recyclable"

    dump_json({"item_type": item_type, "is_recyclable": is_recyclable}, JSON_PATH)

    # display image for debug
    # display_image(image_path)
    # display_image_with_bounding_boxes(image_path, result)

    # send parsed result to website and arduinos
    update_db(item_type, DEVICE_ID)
    # activate arduinos with is_recyclable


if __name__ == "__main__":
    main()
