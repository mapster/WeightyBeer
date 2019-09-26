import * as admin from 'firebase-admin';

import { SensorSource } from "./SensorSource";
import { WeightHub } from "../WeightHub";
import { FirebaseOptions } from '../WeightHubConfig';
import { getFirebaseConfig } from '../firebase';

export class FirebaseSensorSource implements SensorSource {
    private sensorPath: string;
    private firebase: admin.app.App;

    constructor(sensorPath: string, connection?: FirebaseOptions) {
        this.sensorPath = sensorPath;
        const config = getFirebaseConfig(connection)
        this.firebase = admin.initializeApp(config, 'sensorSource');
    }

    start(weightHub: WeightHub): void {
        this.firebase.database()
            .ref(this.sensorPath)
            .on('child_added', (sensorSnapshot) => {
                if (sensorSnapshot) {
                    weightHub.registerSensor(sensorSnapshot.val());
                    sensorSnapshot.ref.on('value',
                        (newSnapshot) => newSnapshot && weightHub.updateSensor(newSnapshot.val())
                    );
                }
            });
    }

}
