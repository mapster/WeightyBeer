import * as admin from 'firebase-admin';

import { ActionSource } from "./ActionSource";
import { FirebaseOptions } from "../WeightHubConfig";
import { getFirebaseConfig } from "../firebase";
import { WeightHub } from '../WeightHub';

export class FirebaseActionSource implements ActionSource {
    private actionPath: string;
    private firebase: admin.app.App;
    private actionRef: admin.database.Reference;

    constructor(actionPath: string, connection?: FirebaseOptions) {
        this.actionPath = actionPath;
        const config = getFirebaseConfig(connection)
        this.firebase = admin.initializeApp(config, 'actionSource');
        this.actionRef = this.firebase.database().ref(this.actionPath);
    }

    async start(weightHub: WeightHub): Promise<void> {
        this.actionRef.on('child_added', (actionSnap) => {
            if (actionSnap) {
                const action = actionSnap.val();
                actionSnap.ref.remove();

                weightHub.doAction(action);
            }
        });
    }

}