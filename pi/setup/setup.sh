#!/bin/bash

APT_PACKAGES=(
    python3
    python3-venv
    python3-pip
    python3-opencv
    python3-picamera2
)

echo "[INFO] Updating system..."
sudo apt update && sudo apt upgrade -y

echo "[INFO] Installing required system packages..."
sudo apt install -y "${APT_PACKAGES[@]}"

echo "[INFO] Creating a virtual environment..."
python3 -m venv ~/rpi_camera_venv

echo "[INFO] Activating the virtual environment and installing Python dependencies..."
source ~/rpi_camera_venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "[INFO] Enabling the Raspberry Pi Camera..."
sudo raspi-config nonint do_camera 0

echo "[INFO] Setup complete! To use the virtual environment, run:"
echo "source ~/rpi_camera_venv/bin/activate"
