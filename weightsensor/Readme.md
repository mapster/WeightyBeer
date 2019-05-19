# Weightsensor

Node.js script to read HX711 sensor readings from a connected Arduino. The Arduino should be flashed
with the program `./arduino/arduino.ino` and connected through USB to the device running the 
`weightsensor` script.

The script expects a `config.json` file to be present in this directory, or a path to it specified
as an argument to the script: `npm start <path-to-config.json>`.

## Config
The config must contain then entries `serialport`, `sensors` and `publishers`.

### Serialport
Gives the name of the serialport device for the Arduino.

### Sensors
An array of the HX711 sensors that are connected to the Arduino analoge pins. Each sensor
should have the fields `id`, `clockPin` and `outPin`. The `id` will be used in the messages
sent to the publishers.

### Publishers
An array of publishers. Supported publishers are `console`, `firebase` and `redis`.
You only need to specify one publisher, and the `console` publisher is primarily used as a
test-utility.

### Example
```
{
  "serialport": "/dev/ttyACM0",
  "sensors": [
    {
      "id": "tap1",
      "clockPin": 3,
      "outPin": 2
    }
  ],
  "publishers": [
    { "console": {} },
    { 
      "firebase": {
        "configPath": "../firebase-config.json",
        "credentialsPath": "../credentials.json"
      }
    },
    {
      "redis": {
        "channel": "sensors"
      }
    }
  ]
}
```