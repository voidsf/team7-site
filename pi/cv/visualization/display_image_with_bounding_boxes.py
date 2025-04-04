def display_image_with_bounding_boxes(image_path, predictions):
    import cv2
    from visualization.draw_bounding_boxes import draw_bounding_boxes

    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Image not found at path: {image_path}")

    image_with_boxes = draw_bounding_boxes(image, predictions)
    cv2.namedWindow("Detected Objects", cv2.WINDOW_NORMAL)
    cv2.imshow("Detected Objects", image_with_boxes)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
