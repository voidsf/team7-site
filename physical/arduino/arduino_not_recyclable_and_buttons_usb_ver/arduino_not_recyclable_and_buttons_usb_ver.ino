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
#define BUTTON1_PIN 3  // Grove Button 1 (D3)
#define BUTTON2_PIN 4  // Grove Button 2 (D4)

// Create Servo object
Servo myservo;

void setup()
{
  Serial.begin(9600);      // Debugging serial monitor
  myservo.attach(SERVO_PIN);  // Attach servo motor to pin 5
  myservo.write(90);  // Set initial position to 90 degrees

  // Initialize button pins as input
  pinMode(BUTTON1_PIN, INPUT_PULLUP);
  pinMode(BUTTON2_PIN, INPUT_PULLUP);
  
  // Initialize LED pins as output
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  
  digitalWrite(LED1_PIN, LOW); // Ensure LEDs start off
  digitalWrite(LED2_PIN, LOW);
  
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

  // **Check button presses and send messages**
  if (digitalRead(BUTTON1_PIN) == HIGH) {
    Serial.println("BUTTON1 PRESSED");
    delay(300); // Debounce delay
  }

  if (digitalRead(BUTTON2_PIN) == HIGH) {
    Serial.println("BUTTON2 PRESSED");
    delay(300); // Debounce delay
  }
}
