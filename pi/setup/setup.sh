#!/bin/bash

# WARNING: this script is a result of feeding my manual documentation into an ai
# it is mostly untested so if there are any significant issues just try installing manually

# This script needs to make changes to the EEPROM of the raspberry pi, so it will reboot initially
# and you will have to run it again, where it should (hopefully) resume from where it ended

set -e

# Configuration
STAGE_FILE="/tmp/opencv_setup.stage"
SCRIPT_COPY="/etc/opencv_setup.sh"
VENV_NAME="cv_venv"
PYTHON_VERSION="3.7"

# Check if we're resuming after reboot
if [ -f "$STAGE_FILE" ]; then
    CURRENT_STAGE=$(cat "$STAGE_FILE")
    echo -e "\nResuming installation at stage $CURRENT_STAGE..."
else
    CURRENT_STAGE=1
fi

#----------------------------------------------------------
# Stage 1: Initial setup
#----------------------------------------------------------
if [ "$CURRENT_STAGE" -eq 1 ]; then
    echo -e "\n[Stage 1/5] Initial setup..."
    
    # Step 1: Clone repository
    if [ ! -d "$HOME/cm2305" ]; then
        git clone -q https://git.cardiff.ac.uk/c23072833/cm2305.git "$HOME/cm2305"
    else
        echo "Repository already exists, skipping clone"
    fi

    # Step 2: Update EEPROM
    echo -e "\n[Stage 1] Updating EEPROM..."
    sudo rpi-eeprom-update
    sudo rpi-eeprom-update -a
    
    # Prepare for reboot
    echo "2" > "$STAGE_FILE"
    sudo cp "$0" "$SCRIPT_COPY"
    sudo chmod +x "$SCRIPT_COPY"
    (crontab -l 2>/dev/null; echo "@reboot $SCRIPT_COPY") | sudo crontab -
    
    echo -e "\nSystem will reboot and resume installation automatically..."
    sleep 5
    sudo reboot
    exit 0
fi

#----------------------------------------------------------
# Stage 2: Post-reboot setup
#----------------------------------------------------------
if [ "$CURRENT_STAGE" -eq 2 ]; then
    echo -e "\n[Stage 2/5] Resuming after reboot..."
    
    # Cleanup reboot handling
    sudo crontab -l | grep -v "@reboot $SCRIPT_COPY" | sudo crontab -
    sudo rm "$SCRIPT_COPY"
    
    # Step 3: Install dependencies
    echo -e "\n[Stage 2] Installing dependencies..."
    sudo apt-get update -qq
    sudo apt-get upgrade -y -qq
    sudo apt-get install -y -qq \
        cmake gfortran python3-dev python3-numpy \
        libjpeg-dev libtiff-dev libgif-dev \
        libavcodec-dev libavformat-dev libswscale-dev \
        libgtk2.0-dev libcanberra-gtk* libxvidcore-dev \
        libx264-dev libgtk-3-dev libtbb2 libtbb-dev \
        libdc1394-22-dev libv4l-dev libopenblas-dev \
        libatlas-base-dev libblas-dev libjasper-dev \
        liblapack-dev libhdf5-dev gcc-arm* protobuf-compiler

    # Step 4: Download OpenCV
    echo -e "\n[Stage 2] Downloading OpenCV..."
    cd "$HOME"
    [ ! -d "OpenCV" ] && \
        wget -q -O OpenCV.zip https://github.com/OpenCV/OpenCV/archive/4.4.0.zip && \
        unzip -q OpenCV.zip && \
        mv OpenCV-4.4.0 OpenCV && \
        rm OpenCV.zip

    [ ! -d "OpenCV_contrib" ] && \
        wget -q -O OpenCV_contrib.zip https://github.com/OpenCV/OpenCV_contrib/archive/4.4.0.zip && \
        unzip -q OpenCV_contrib.zip && \
        mv OpenCV_contrib-4.4.0 OpenCV_contrib && \
        rm OpenCV_contrib.zip

    echo "3" > "$STAGE_FILE"
fi

#----------------------------------------------------------
# Stage 3: Virtual environment setup
#----------------------------------------------------------
if [ "$CURRENT_STAGE" -eq 3 ]; then
    echo -e "\n[Stage 3/5] Setting up virtual environment..."
    
    # Step 5: Virtual environment setup
    if ! command -v virtualenvwrapper.sh &> /dev/null; then
        sudo pip3 install -q virtualenv virtualenvwrapper
    fi

    if ! grep -q "virtualenvwrapper" "$HOME/.bashrc"; then
        echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python$PYTHON_VERSION" >> "$HOME/.bashrc"
        echo "export WORKON_HOME=$HOME/.virtualenvs" >> "$HOME/.bashrc"
        echo "source /usr/local/bin/virtualenvwrapper.sh" >> "$HOME/.bashrc"
    fi

    source "$HOME/.bashrc"

    if [ ! -d "$HOME/.virtualenvs/$VENV_NAME" ]; then
        mkvirtualenv "$VENV_NAME" -p "/usr/bin/python$PYTHON_VERSION"
    fi

    # Step 6: Install numpy
    echo -e "\n[Stage 3] Installing numpy..."
    workon "$VENV_NAME"
    pip install -q numpy==1.19.5

    echo "4" > "$STAGE_FILE"
fi

#----------------------------------------------------------
# Stage 4: Build OpenCV
#----------------------------------------------------------
if [ "$CURRENT_STAGE" -eq 4 ]; then
    echo -e "\n[Stage 4/5] Building OpenCV (this will take 1-2 hours)..."
    
    # Step 7: Build OpenCV
    cd "$HOME/OpenCV"
    mkdir -p build && cd build

    cmake -D CMAKE_BUILD_TYPE=RELEASE \
          -D CMAKE_INSTALL_PREFIX=/usr/local \
          -D OpenCV_EXTRA_MODULES_PATH="$HOME/OpenCV_contrib/modules" \
          -D ENABLE_NEON=ON \
          -D ENABLE_VFPV3=ON \
          -D WITH_OPENMP=ON \
          -D BUILD_TIFF=ON \
          -D WITH_FFMPEG=ON \
          -D WITH_TBB=ON \
          -D BUILD_TBB=ON \
          -D BUILD_TESTS=OFF \
          -D WITH_EIGEN=OFF \
          -D WITH_GSTREAMER=OFF \
          -D WITH_V4L=ON \
          -D WITH_LIBV4L=ON \
          -D WITH_VTK=OFF \
          -D WITH_QT=OFF \
          -D OpenCV_ENABLE_NONFREE=ON \
          -D INSTALL_C_EXAMPLES=OFF \
          -D INSTALL_PYTHON_EXAMPLES=OFF \
          -D BUILD_NEW_PYTHON_SUPPORT=ON \
          -D OpenCV_FORCE_LIBATOMIC_COMPILER_CHECK=1 \
          -D BUILD_OpenCV_python3=ON \
          -D BUILD_OpenCV_python2=OFF \
          -D PYTHON3_EXECUTABLE="$HOME/.virtualenvs/$VENV_NAME/bin/python3" \
          -D PYTHON3_INCLUDE_DIR="$HOME/.virtualenvs/$VENV_NAME/include/python${PYTHON_VERSION}m" \
          -D PYTHON3_LIBRARY="/usr/lib/arm-linux-gnueabihf/libpython${PYTHON_VERSION}m.so" \
          -D PYTHON3_NUMPY_INCLUDE_DIRS="$(python -c 'import numpy; print(numpy.get_include())')" \
          -D OpenCV_GENERATE_PKGCONFIG=ON \
          -D BUILD_EXAMPLES=OFF .. > /dev/null

    # Increase swap
    sudo sed -i 's/CONF_SWAPSIZE=[0-9]*/CONF_SWAPSIZE=2048/' /etc/dphys-swapfile
    sudo systemctl restart dphys-swapfile

    # Build and install
    make -j4
    sudo make install
    sudo ldconfig

    echo "5" > "$STAGE_FILE"
fi

#----------------------------------------------------------
# Stage 5: Finalization
#----------------------------------------------------------
if [ "$CURRENT_STAGE" -eq 5 ]; then
    echo -e "\n[Stage 5/5] Finalizing installation..."
    
    # Step 8: Cleanup
    make clean
    sudo sed -i 's/CONF_SWAPSIZE=[0-9]*/CONF_SWAPSIZE=100/' /etc/dphys-swapfile
    sudo systemctl restart dphys-swapfile

    # Create symlink
    ln -sf "/usr/local/lib/python${PYTHON_VERSION}/site-packages/cv2/python-${PYTHON_VERSION}/cv2.cpython-${PYTHON_VERSION}m-arm-linux-gnueabihf.so" \
           "$HOME/.virtualenvs/$VENV_NAME/lib/python${PYTHON_VERSION}/site-packages/"

    # Step 9: Test installation
    echo -e "\nTesting installation..."
    workon "$VENV_NAME"
    python3 -c "import cv2; print(f'\nOpenCV version: {cv2.__version__}')"

    if [ -f "$HOME/cm2305/pi/camera_test.py" ]; then
        python "$HOME/cm2305/pi/camera_test.py"
    fi

    # Step 10: Project setup
    echo -e "\nSetting up project environment..."
    mkvirtualenv rpi_venv -p "/usr/bin/python$PYTHON_VERSION"
    workon rpi_venv

    if [ -f "$HOME/cm2305/pi/setup/requirements.txt" ]; then
        pip install -q -r "$HOME/cm2305/pi/setup/requirements.txt"
    fi

    ln -sf "$HOME/.virtualenvs/$VENV_NAME/lib/python${PYTHON_VERSION}/site-packages/cv2" \
           "$HOME/.virtualenvs/rpi_venv/lib/python${PYTHON_VERSION}/site-packages/"

    # Final cleanup
    rm "$STAGE_FILE"
    echo -e "\nSetup complete! Use 'workon rpi_venv' to activate your environment."
fi