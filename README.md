# Physical Components

- **1x** Raspberry Pi
- **1x** Raspberry Pi GrovePi+ Board
- **2x** Arduino
- **2x** Arduino Grove Hat
- **2x** Servo Motor
- **2x** Button
- **1x** Motion Sensor
- **1x** Pi Camera Module
- **2x** USB-A to MicroUSB Cable
- **1x** V5.0 RGB LCD Screen

---

# Setup

### Raspberry Pi
1. Install **GrovePi+ Board**
2. **Pin I2C (any):** V5.0 RGB LCD Screen
3. **[Place camera and button setup here]**

### Arduino 0
1. Install **Grove Hat**
2. **Pin D5:** Servo Motor
3. **Pin D3:** Button
4. **Pin D6:** Button
5. Upload sketch: **`arduino0_motor_button`**
6. Connect to Raspberry Pi using MicroUSB cable (ACM Port 0)

### Arduino 1
1. Install **Grove Hat**
2. **Pin D5:** Servo Motor
3. **Pin D2:** Motion Sensor
4. Upload sketch: **`arduino1_motor_motionsensor`**
5. Connect to Raspberry Pi using MicroUSB cable (ACM Port 1)

---
# Node-Red

The system relies on a Node-Red flow, stored in the /physical folder

### Required Installs
To install the necessary Node-Red packages:
1. Start Node-Red on the Raspberry Pi by running:
   ```start-node-red```
2. Open the Node-Red browser interface.
3. Navigate to the settings dropdown and click **Manage Palette**.
4. Ensure the following packages are installed:
   - `node-red`
   - `node-red-node-serialport`

---