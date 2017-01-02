#include <Q2HX711.h>
const byte PINS[] = { A0, A1, A2, A3, A4, A5 };
Q2HX711* hx711;
int size = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("msg: ready");
}

void loop() {
  // Attempt to configure if serial data is received
  if(Serial.available() > 0) {
    size = configure();
    Serial.println("msg: Listening on " + String(size) + " sensors.");
  }

  // Read from weight sensors
  for(int i = 0; i < size; i++) {
    long val = hx711[i].read();
    Serial.println(String(i) + ":" + String(val));
  }
  
  delay(1000);
}

int configure() {
  String config = Serial.readStringUntil('\n');
  config.trim();

  // Calculate size
  int newSize = config.length() > 0 ? 1 : 0;
  int pos = config.indexOf(',');
  while (pos > -1) {
    newSize++;
    pos = config.indexOf(',', pos+1);
  }

  if(newSize < 1) {
    Serial.println("err: attempt to configure with 0 devices");
    return 0;
  }
  
  byte pins[newSize][2];

  int count = 0;
  int start = 0;
  while (count < newSize) {
    if (start == -1 && start >= config.length()) {
      Serial.println("err: invalid config string");
      return 0;
    }
    
    int end = config.indexOf(',', start+1);
    end = end > 0 ? end : config.length();

    String current = config.substring(start,end);
    int splitAt = current.indexOf(':');
    // Abort if invalid config string
    if (splitAt == -1 || current.charAt(0) != '(' || current.charAt(current.length()-1) != ')') {
      Serial.println("err: invalid config string");
      return 0;
    }

    pins[count][0] = current.substring(1, splitAt).toInt();
    pins[count][1] = current.substring(splitAt+1, current.length()-1).toInt();

    count++;
    start = end + 1;
  }

  if (hx711 != 0) {
    hx711 = (Q2HX711*) realloc(hx711, newSize * sizeof(Q2HX711)); 
  } else {
    hx711 = (Q2HX711*) malloc(newSize * sizeof(Q2HX711));
  }

  for(int i = 0; i < newSize; i++) {
    hx711[i] = Q2HX711(PINS[pins[i][0]], PINS[pins[i][1]]);
  }
  
  return newSize;
}

