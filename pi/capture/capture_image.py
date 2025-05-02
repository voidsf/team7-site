def capture_image(image_path, MAX_WIDTH=1920, MAX_HEIGHT=1080):
    import cv2
    import sys

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera.")
        sys.exit(1)

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, MAX_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, MAX_HEIGHT)

    ret, frame = cap.read()

    if not ret:
        print("Error: Failed to capture image.")
        cap.release()
        sys.exit(1)

    cv2.imwrite(image_path, frame)
    cap.release()
    return image_path
