#!/usr/bin/env python3
import time
import grovepi

servo = 4  # D4 port

grovepi.pinMode(servo, "OUTPUT")

grovepi.analogWrite(servo, 135)
time.sleep(2.5)
grovepi.analogWrite(servo, 90)
