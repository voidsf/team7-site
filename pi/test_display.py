import cv2
import json
from visualization.display_image_with_bounding_boxes import display_image_with_bounding_boxes

image_path = 'tmp/captured_image.jpg'
json_path = 'tmp/result.json'

with open(json_path, 'r') as file:
    results = json.load(file)

display_image_with_bounding_boxes(image_path, results)
