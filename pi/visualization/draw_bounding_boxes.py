def draw_bounding_boxes(image, predictions):
    import cv2
    colours = [(240, 0, 0), (0, 240, 0), (0, 0, 240), (240, 240, 0),
               (0, 240, 240), (240, 0, 240), (0, 0, 0), (240, 240, 240)]
    for i, pred in enumerate(predictions["predictions"]):
        x, y, width, height = int(pred["x"]), int(
            pred["y"]), int(pred["width"]), int(pred["height"])
        class_name = pred["class"]

        x1, y1 = x - width // 2, y - height // 2
        x2, y2 = x + width // 2, y + height // 2

        colour = colours[i % len(colours)]
        cv2.rectangle(image, (x1, y1), (x2, y2), colour, 2)
        cv2.putText(image, class_name, (x1 + 2, y1 + 12),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, colour, 2)

    return image
