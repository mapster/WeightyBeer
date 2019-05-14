const firebase = require('firebase-admin');

module.exports = class FirebasePublisher {
    
    constructor(publisherConfig) {
        this.config = publisherConfig;
        this.isValidConfig(this.config);

        const firebaseConfig = require(this.config.configPath);
        const credentials = require(this.config.credentialsPath);

        this.configCred = Object.assign(
            {
              credential: firebase.credential.cert(credentials),
              databaseAuthVariableOverride: {
                uid: 'sensors'
              },
            },
            firebaseConfig
        );

        firebase.initializeApp(this.configCred);
    }

    createPublisher() {
        const database = firebase.database();
        const sensorsRef = database.ref('sensors/weight');

        return (id, value, initialize = false) => {
            if (initialize) {
              sensorsRef.child(id).update({id, value});
            } else {
              sensorsRef.child(id + '/value').set(value);
            }
        };
    }

    isValidConfig(config) {
        if (!config.configPath) {
            throw 'Invalid firebase config: firebase-config.json path not specified!';
        }

        if (!config.credentialsPath) {
            throw 'Invalid firebase config: credentials path not specified!';
        }
    }
}
