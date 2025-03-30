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
    print(f"Successfully captured image: {image_path}")
    # image_path = "~/cm2305/pi/images/test1.jpg"   # static image for testing
    try:
        validate_image(image_path)
    except Exception as e:
        print(f"Error in reading image: {e}")
        return

    # make request to model for result
    result = run_inference(image_path)
    print(f"Successfully ran inference, result at {JSON_PATH}")
    dump_json(result, JSON_PATH)

    # parse and categorize result
    # currently only works for single item todo: account for multiple items by looking at bounding boxes etc.
    item_type, confidence = parse_result(result)
    is_recyclable = item_type != "Non-Recyclable"
    print(
        f"Item categorized as: {item_type}, {is_recyclable} with confidence: {confidence}")

    # display image for debug
    # display_image(image_path)
    # display_image_with_bounding_boxes(image_path, result)

    # send parsed result to website
    update_db(item_type, DEVICE_ID)
    print(
        f"Successfully updated website with item type: {item_type}, device id: {DEVICE_ID}")
    # send output to nodered
   return is_recyclable

if __name__ == "__main__":
    main()
