/***************************************************************************
* Sketch Name: Lab1_code2
*
* Original Version: 14/11/2020 (by Hakan KAYAN)
* Updated Version: 24/12/2024 (by Charith PERERA)
*
* Note: This code demonstrates how to control a servo based on button inputs.
*       The servo starts at 90° (level) and moves to +90° (180°) or -90° (0°) 
*       depending on which button is pressed.
***************************************************************************/

// 1. Include the Servo library, which contains functions to control servo motors.
#include <Servo.h>  

// 2. Define the digital pins to which the buttons are connected.
//    These pins are selected based on available digital I/O ports.
const int buttonPin1 = 4; // Button for +90° movement
const int buttonPin2 = 6; // Button for -90° movement

// 3. Declare variables to store the buttons' states (HIGH or LOW).
int buttonState1;
int buttonState2;

// 4. Create a Servo object named 'myservo'.
Servo myservo;

void setup() {
  // 5. Attach the servo object to digital pin 5.
  myservo.attach(5);

  // 6. Specify the pin mode for the buttons.
  pinMode(buttonPin1, INPUT);
  pinMode(buttonPin2, INPUT);

  // 7. Set the servo to the neutral (level) position at startup.
  myservo.write(90);
}

void loop() {
  // 8. Read the current state of both buttons.
  buttonState1 = digitalRead(buttonPin1);
  buttonState2 = digitalRead(buttonPin2);

  // 9. If button 1 is pressed, rotate the servo to +90° (180°).
  if (buttonState1 == HIGH) {
    myservo.write(180); // Move servo to 180 degrees
    delay(15);
  }
  // 10. If button 2 is pressed, rotate the servo to -90° (0°).
  else if (buttonState2 == HIGH) {
    myservo.write(0);   // Move servo to 0 degrees
    delay(15);
  }
  // 11. If no button is pressed, return servo to 90° (neutral level position).
  else {
    myservo.write(90);  // Move servo back to 90 degrees
  }
}