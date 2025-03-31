/***************************************************************************
* Sketch Name: arduino_usb_servo
*
* Updated Version: 27/03/2025
*
* Description:
*   - USB-controlled servo motor.
*   - Receives "SERVO X" to control a servo at any angle (0-180).
***************************************************************************/

#include <Servo.h>

// Define pin for Servo
#define SERVO_PIN 5  // 🔌 Grove PWM D5 (Servo motor)

// Create Servo object
Servo myservo;

void setup()
{
  Serial.begin(9600);      // Debugging serial monitor
  myservo.attach(SERVO_PIN);  // Attach servo motor to pin 5
  myservo.write(0);  // Set initial position to 0 degrees
  
  Serial.println("System Ready");
}

void loop()
{
  // **Check for USB serial commands from Node-RED**
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n'); // Read full command
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
}
