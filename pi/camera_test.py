from picamera2 import Picamera2
import cv2

# Initialize the camera
picam2 = Picamera2()

# Configure camera for preview (default configuration)
picam2.configure(picam2.create_preview_configuration())

# Start the camera
picam2.start()

# Continuously capture frames and display them
while True:
    frame = picam2.capture_array()  # Capture frame
    cv2.imshow("Camera Feed", frame)  # Show the frame

    # Exit loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cv2.destroyAllWindows()
picam2.stop()
