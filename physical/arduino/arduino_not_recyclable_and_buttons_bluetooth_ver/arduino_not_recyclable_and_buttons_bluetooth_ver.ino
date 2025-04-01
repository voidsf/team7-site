/***************************************************************************
* Sketch Name: arduino_bluetooth_servo_buttons
*
* Updated Version: 01/04/2025
*
* Description:
*   - Bluetooth-controlled servo motor with button inputs.
*   - Receives "SERVO X" to set the servo angle (0-180) from Node-RED.
*   - Includes two Grove LED buttons that send serial messages when pressed.
***************************************************************************/

#include <Servo.h>
#include <SoftwareSerial.h>

// Define pins for Bluetooth, Servo, and Buttons
#define RxD 8        // 🔌 Grove Bluetooth RX (connect to TX of module)
#define TxD 9        // 🔌 Grove Bluetooth TX (connect to RX of module)
#define SERVO_PIN 5  // 🔌 Grove PWM D5 (Servo motor)
#define BUTTON1_PIN 3  // Grove Button 1 (D3)
#define BUTTON2_PIN 4  // Grove Button 2 (D4)

// Create objects for Bluetooth and Servo
SoftwareSerial blueToothSerial(RxD, TxD);
Servo myservo;

void setup()
{
  Serial.begin(9600);      // Debugging serial monitor
  blueToothSerial.begin(9600); // Bluetooth communication
  myservo.attach(SERVO_PIN);  // Attach servo motor to pin 5
  myservo.write(0);  // Set initial position to 0 degrees
  setupBlueToothConnection(); // Initialize Bluetooth

  // Initialize button pins as input
  pinMode(BUTTON1_PIN, INPUT_PULLUP);
  pinMode(BUTTON2_PIN, INPUT_PULLUP);

  Serial.println("System Ready");
}

void loop()
{
  // **Check for Bluetooth commands from Node-RED**
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

/***************************************************************************
* Function: setupBlueToothConnection
* Description: Configures Bluetooth module using AT commands.
***************************************************************************/
void setupBlueToothConnection()
{
  blueToothSerial.print("AT");
  delay(2000);
  blueToothSerial.print("AT+BAUD4");
  delay(2000);
  blueToothSerial.print("AT+ROLES");
  delay(2000);
  blueToothSerial.print("AT+NAMESlaveBGroup7");
  delay(2000);
  blueToothSerial.print("AT+AUTH1");
  delay(2000);
  Serial.println("Bluetooth Setup Complete");
}
