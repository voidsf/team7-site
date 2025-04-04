/***************************************************************************
* Sketch Name: arduino_usb_servo_buttons
*
* Updated Version: 01/04/2025
*
* Description:
*   - USB-controlled servo motor.
*   - Receives "SERVO X" to control a servo at any angle (0-180).
*   - Includes two Grove LED buttons that send serial messages when pressed.
***************************************************************************/

#include <Servo.h>

// Define pin for Servo
#define SERVO_PIN 5  // 🔌 Grove PWM D5 (Servo motor)

// Define pins for Grove LED Buttons
#define BUTTON1_PIN 8  // Grove Button 1 (D7)
#define BUTTON2_PIN 4  // Grove Button 2 (D3)

// Create Servo object
Servo myservo;

void setup() {
  Serial.begin(9600);               // Start serial communication
  myservo.attach(SERVO_PIN);       // Attach servo motor to pin 5
  myservo.write(90);               // Set initial position to 90 degrees

  // Initialize button pins as input with internal pull-ups
  pinMode(BUTTON1_PIN, INPUT_PULLUP);
  pinMode(BUTTON2_PIN, INPUT_PULLUP);

  Serial.println("System Ready");
}

void loop() {
  // === USB Serial Command Handling ===
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

  // === Button Press Detection ===
  if (digitalRead(BUTTON1_PIN) == LOW) {  // LOW when pressed due to pull-up
    Serial.println("BUTTON1 PRESSED");
    delay(300); // Debounce
  }

  if (digitalRead(BUTTON2_PIN) == LOW) {
    Serial.println("BUTTON2 PRESSED");
    delay(300); // Debounce
  }
}
