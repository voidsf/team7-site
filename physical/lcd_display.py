#!/usr/bin/env python3
import time
import sys
import os
import smbus
import RPi.GPIO as GPIO

# Determine I2C Bus
if sys.platform == 'uwp':
    import winrt_smbus as smbus
    bus = smbus.SMBus(1)
else:
    import smbus
    import RPi.GPIO as GPIO
    rev = GPIO.RPI_REVISION
    if rev == 2 or rev == 3:
        bus = smbus.SMBus(1)
    else:
        bus = smbus.SMBus(0)

# I2C addresses for the Grove LCD
DISPLAY_RGB_ADDR = 0x30
DISPLAY_TEXT_ADDR = 0x3e

def setRGB(r, g, b):
    bus.write_byte_data(DISPLAY_RGB_ADDR, 0x04, 0x15)
    bus.write_byte_data(DISPLAY_RGB_ADDR, 0x06, r)
    bus.write_byte_data(DISPLAY_RGB_ADDR, 0x07, g)
    bus.write_byte_data(DISPLAY_RGB_ADDR, 0x08, b)

def textCommand(cmd):
    bus.write_byte_data(DISPLAY_TEXT_ADDR, 0x80, cmd)

def setText(text):
    textCommand(0x01)
    time.sleep(0.05)
    textCommand(0x08 | 0x04)
    textCommand(0x28)
    time.sleep(0.05)

    count = 0
    row = 0
    for c in text:
        if c == '\n' or count == 16:
            count = 0
            row += 1
            if row == 2:
                break
            textCommand(0xc0)
            if c == '\n':
                continue
        count += 1
        bus.write_byte_data(DISPLAY_TEXT_ADDR, 0x40, ord(c))

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: lcd_display.py <red> <green> <blue> <text>")
        sys.exit(1)

    r = int(sys.argv[1])
    g = int(sys.argv[2])
    b = int(sys.argv[3])
    text = sys.argv[4]

    setRGB(r, g, b)
    setText(text)
