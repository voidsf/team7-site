## Raspberry Pi 4 setup guide for OpenCV

If we want to run any computer vision locally, we will most likely be using OpenCV
As far as I know pip doesn't work for installing OpenCV, so we have to build it ourselves
The entire process is documented here and and is fully working on at least 1 of the pis

1. Clone git repo
   Contains files used for setup like pip requirements and tests

   ```
   # keep the repo in the home directory for consistency
   cd ~ && git clone https://git.cardiff.ac.uk/c23072833/cm2305.git
   ```

2. Update EEPROM
   This helps with heat dissipation to reduce the risk of thermal throttling

   ```
   # to get the current status
   sudo rpi-eeprom-update

   # update if needed, reboot is required
   sudo rpi-eeprom-update -a
   sudo reboot
   ```

3. Install OpenCV dependencies

   ```
   sudo apt-get update
   sudo apt-get upgrade
   sudo apt-get install -y cmake gfortran
   sudo apt-get install -y python3-dev python3-numpy
   sudo apt-get install -y libjpeg-dev libtiff-dev libgif-dev
   sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev
   sudo apt-get install -y libgtk2.0-dev libcanberra-gtk*
   sudo apt-get install -y libxvidcore-dev libx264-dev libgtk-3-dev
   sudo apt-get install -y libtbb2 libtbb-dev libdc1394-22-dev libv4l-dev
   sudo apt-get install -y libopenblas-dev libatlas-base-dev libblas-dev
   sudo apt-get install -y libjasper-dev liblapack-dev libhdf5-dev
   sudo apt-get install -y gcc-arm* protobuf-compiler
   ```

4. Download OpenCV
   Installs the required files, extracts, renames, and deletes the zip to be clean

   ```
   cd ~
   wget -O OpenCV.zip https://github.com/OpenCV/OpenCV/archive/4.4.0.zip
   wget -O OpenCV_contrib.zip https://github.com/OpenCV/OpenCV_contrib/archive/4.4.0.zip

   unzip OpenCV.zip && mv OpenCV-4.4.0 OpenCV && rm OpenCV.zip
   unzip OpenCV_contrib.zip && mv OpenCV_contrib-4.4.0 OpenCV_contrib && OpenCV_contrib.zip
   ```

5. Virtual environment setup
   Downloads the required packages to create a virtualenv, creates one, and sets up parameters for managing virtualenvs
   Virtualenvs managed this way can be quickly activated using `workon {venv_name}`

   ```
   # get version
   python3 --version
   # get location
   which python 3.7
   # merge VIRTUALENVWRAPPER_PYTHON=location/version
   echo "export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3.7" >> ~/.bashrc
   # reload profile
   source ~/.bashrc

   sudo pip3 install virtualenv
   sudo pip3 install virtualenvwrapper

   echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.bashrc
   echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc
   source ~/.bashrc
   mkvirtualenv cv_venv

   ```

6. Install Python dependencies
   The only dependency needed for OpenCV is NumPy, new versions break pip tho so we use 1.19.5 (something to do with c headers)

   ```
   pip install numpy==1.19.5
   ```

7. Make OpenCV
   Sets up a directory to build into, makes a Makefile, and (attempts to) complete a build for the python3 version of OpenCV

   ```
   # set up the build directory
   cd ~/OpenCV/
   mkdir build
   cd build

   # create the makefile

   cmake -D CMAKE_BUILD_TYPE=RELEASE \
        -D CMAKE_INSTALL_PREFIX=/usr/local \
        -D OpenCV_EXTRA_MODULES_PATH=~/OpenCV_contrib/modules \
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
        -D PYTHON3_EXECUTABLE=/home/pi/.virtualenvs/cv_venv/bin/python3 \
        -D PYTHON3_INCLUDE_DIR=/home/pi/.virtualenvs/cv_venv/include/python3.7m \
        -D PYTHON3_LIBRARY=/usr/lib/arm-linux-gnueabihf/libpython3.7m.so \
        -D PYTHON3_NUMPY_INCLUDE_DIRS="$(python -c 'import numpy; print(numpy.get_include())')" \
        -D OpenCV_GENERATE_PKGCONFIG=ON \
        -D BUILD_EXAMPLES=OFF ..

   # enlarge allocated swap memory to avoid any issues caused by the large build
   sudo sed -i 's/CONF_SWAPSIZE=[0-9]*/CONF_SWAPSIZE=2048/' /etc/dphys-swapfile

   # restart the service to apply the change
   sudo /etc/init.d/dphys-swapfile stop
   sudo /etc/init.d/dphys-swapfile start

   # make using all 4 cores (this can take like 90 - 120 mins)
   make -j4

   # assuming the build was successful, install the packages generated
   sudo make install
   sudo ldconfig
   ```

8. Cleanup
   Restore the system back to a stable state and remove excess build dependecies

   ```
   # cleaning (frees 300+KB)
   make clean
   sudo apt-get update

   # reset swap memory back to default
   sudo sed -i 's/CONF_SWAPSIZE=[0-9]*/CONF_SWAPSIZE=100/' /etc/dphys-swapfile

   # create a symlink so that OpenCV is accessible outside the build venv
   cd ~/.virtualenvs/cv_venv/lib/python3.7/site-packages
   ln -s /usr/local/lib/python3.7/site-packages/cv2/python-3.7/cv2.cpython-37m-arm-linux-gnueabihf.so
   cd ~

   # another reboot is (probably) required here
   sudo reboot
   ```

9. Test
   OpenCV should be successfully installed, we can test this by importing it into python

   ```
   workon cv_venv
   python3 -c "import cv2; print(cv2.__version__); print(cv2.getBuildInformation())"

   # run a test file to make sure we have camera output
   # if this doesnt work and imports look good try reseating camera module
   python ~/cm2305/pi/camera_test.py
   ```

10. Setup project virtualenv
    After building OpenCV we can finally create the actual environment where we will run the project code

    ```
    # make new venv
    mkvirtualenv rpi_venv -p /usr/bin/python3.7

    # install pip requirements
    cd ~/cm2305/pi/setup
    pip install -r requirements.txt

    # symlink our OpenCV build so we can access it without using pip

    ln -s /home/pi/.virtualenvs/cv_venv/lib/python3.7/site-packages/cv2 \
    /home/pi/.virtualenvs/rpi_venv/lib/python3.7/site-packages/cv2

    # test that opencv is properly installed (won't work before installing numpy)
    python3 -c "import cv2; print(cv2.__version__); print(cv2.getBuildInformation())"


    ```
