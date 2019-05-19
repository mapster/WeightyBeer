# Weighthub

Node.js script that listens for sensor value changes, quantizes and aggregates them, and then publishes
those values to Firebase.

The script expects a firebase configuration file and a service-account credentials file in the root directory
of WeightyBeer:
* `../firebase-config.json`
* `../credentials.json`

Weighthub can either listen for sensor data in firebase or on redis. 
* redis: `npm start redis`
* firebase: `npm start firebase`