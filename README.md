# Physical Components

- **1x** Raspberry Pi
- **1x** Raspberry Pi GrovePi+ Board
- **2x** Arduino
- **2x** Arduino Grove Hat
- **2x** Servo Motor
- **2x** Button
- **1x** Motion Sensor
- **1x** Pi Camera Module
- **1x** Bluetooth Serial Module
- **1x** USB-A to MicroUSB Cable
- **1x** V5.0 RGB LCD Screen

---

# Setup

### Raspberry Pi
1. Install **GrovePi+ Board**
2. **Pin I2C (any):** V5.0 RGB LCD Screen
3. **[Place camera and button setup here]**

### Arduino A
1. Install **Grove Hat**
2. **Pin D2:** Motion Sensor
3. **Pin D5:** Servo Motor
4. Upload sketch: **`arduino_recyclable_and_motion_sensor_usb_ver`**
5. Connect to Raspberry Pi using MicroUSB cable

### Arduino B
1. Install **Grove Hat**
2. **Pin D5:** Servo Motor
3. **Pin D8:** Bluetooth Serial Module
4. Upload sketch: **`arduino_not_recyclable_bluetooth_ver`**

---
# Node-Red
System relies on Node-Red flow
**Installs:**
In Node-Red browser interface (after doing 'start-node-red' on the Pi), navigate to the settings dropdown and click Manage Palette.
#### Ensure the following are installed:
- 'node-red'
- 'node-red-node-daemon'
- 'node-red-node-serialport'
---

# Connecting Bluetooth

Depending on the **Bluetooth module** used, the **MAC_ADDRESS** will either be:

- `00:0E:EA:CF:77:DB`
- `00:0E:EA:CF:77:A8`

### Steps to Connect (In Pi Terminal):
```sh
bluetoothctl
default-agent
scan on
scan off
pair MAC_ADDRESS  # If already paired, consider `remove MAC_ADDRESS` first to avoid issues
trust MAC_ADDRESS
exit
sudo rfcomm connect hci0 MAC_ADDRESS
```

---