# grovepi_motion_sensor.py
# This is an alternative version of the motion sensor function, using the pi instead of the arduino

import time
import grovepi
import serial

# Define the PIR motion sensor port and serial port
pir_sensor = 7  # D7 for GrovePi (you can use D2 if physically connected there)

# Set PIR sensor as input
grovepi.pinMode(pir_sensor, "INPUT")

while True:
    # Read the PIR sensor value
    motion_detected = grovepi.digitalRead(pir_sensor)

    if motion_detected == 1:
        print("Movement")
        
    time.sleep(0.2)
