/***************************************************************************
* Sketch Name: arduino_bluetooth_servo
*
* Updated Version: 27/03/2025
*
* Description:
*   - Bluetooth-controlled servo motor with movement detection.
*   - Sends "Movement" to Node-RED when PIR detects motion.
*   - Receives "SERVO X" to control a servo at any angle (0-180).
***************************************************************************/

#include <Servo.h>
#include <SoftwareSerial.h>

// 1. Define pins for Bluetooth, PIR sensor, and Servo
#define RxD 8        // 🔌 Grove Bluetooth RX (connect to TX of module)
#define TxD 9        // 🔌 Grove Bluetooth TX (connect to RX of module)
#define PIR_MOTION_SENSOR 2  // 🔌 Grove Digital D2 (PIR sensor)
#define SERVO_PIN 5  // 🔌 Grove PWM D5 (Servo motor)

// 2. Create objects for Bluetooth and Servo
SoftwareSerial blueToothSerial(RxD, TxD);
Servo myservo;

void setup()
{
  Serial.begin(9600);      // Debugging serial monitor
  pinMode(PIR_MOTION_SENSOR, INPUT);
  myservo.attach(SERVO_PIN);  // Attach servo motor to pin 5
  myservo.write(0);  // Set initial position to 0 degrees
  setupBlueToothConnection(); // Initialize Bluetooth
  
  Serial.println("System Ready");
}

void loop()
{
  // 1. **Check for Bluetooth commands from Node-RED**
  if (blueToothSerial.available()) {
    String command = blueToothSerial.readStringUntil('\n'); // Read full command
    command.trim(); // Remove whitespace

    Serial.println("Received: " + command); // Debugging

    // **Check if the command starts with "SERVO "** (e.g., "SERVO 90")
    if (command.startsWith("SERVO ")) {
      int angle = command.substring(6).toInt(); // Extract angle value

      // **Ensure the angle is between 0 and 180**
      if (angle >= 0 && angle <= 180) {
        myservo.write(angle);  // Move servo to specified angle
        Serial.print("Servo moved to: ");
        Serial.println(angle);
      } else {
        Serial.println("Invalid angle! Must be 0-180.");
      }
    }
  }

  // 2. **Check PIR sensor for motion**
  if (digitalRead(PIR_MOTION_SENSOR)) {
    blueToothSerial.println("Movement");  // Send "Movement" to Node-RED
    Serial.println("Movement Detected");
    delay(1000); // Prevent spam
  }
}

/***************************************************************************
* Function: setupBlueToothConnection
* Description: Configures Bluetooth module using AT commands.
***************************************************************************/
void setupBlueToothConnection()
{
  blueToothSerial.begin(9600);
  blueToothSerial.print("AT");
  delay(2000);
  blueToothSerial.print("AT+BAUD4");
  delay(2000);
  blueToothSerial.print("AT+ROLES");
  delay(2000);
  blueToothSerial.print("AT+NAMESlaveAGroup7");
  delay(2000);
  blueToothSerial.print("AT+AUTH1");
  delay(2000);
  Serial.println("Bluetooth Setup Complete");
}
