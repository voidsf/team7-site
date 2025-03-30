/***************************************************************************
* Sketch Name: arduino_usb_servo
*
* Updated Version: 27/03/2025
*
* Description:
*   - USB-controlled servo motor with movement detection.
*   - Sends "Movement" to Node-RED when PIR detects motion.
*   - Receives "SERVO X" to control a servo at any angle (0-180).
***************************************************************************/

#include <Servo.h>

// 1. Define pins for PIR sensor, and Servo
#define PIR_MOTION_SENSOR 2  // 🔌 Grove Digital D2 (PIR sensor)
#define SERVO_PIN 5  // 🔌 Grove PWM D5 (Servo motor)

Servo myservo;

void setup()
{
  Serial.begin(9600);      // Start serial communication over USB (for Node-RED)
  pinMode(PIR_MOTION_SENSOR, INPUT);
  myservo.attach(SERVO_PIN);  // Attach servo motor to pin 5
  myservo.write(90);  // Set initial position to 90 degrees
}

void loop()
{
  // 1. **Check for USB commands from Node-RED**
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    Serial.println("Received: " + command);

    if (command.startsWith("SERVO ")) {
      int angle = command.substring(6).toInt();
      if (angle >= 0 && angle <= 180) {
        myservo.write(angle);
        Serial.print("Servo moved to: ");
        Serial.println(angle);
      } else {
        Serial.println("Invalid angle! Must be 0-180.");
      }
    }
  }

  // 2. **Check PIR sensor for motion**
  if (digitalRead(PIR_MOTION_SENSOR)) {
    Serial.println("Movement");  // Send "Movement" to Node-RED via USB
    delay(1000); // Prevent spam
  }
}
