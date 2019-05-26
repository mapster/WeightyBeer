import * as admin from 'firebase-admin';
import * as fs from 'fs';

import { FirebaseOptions } from "./WeightHubConfig";

export function getFirebaseConfig(connection?: FirebaseOptions): admin.AppOptions | undefined {
    if (connection) {
        const config = JSON.parse(fs.readFileSync(connection.firebaseConfigPath, { encoding: 'utf-8' })) as admin.AppOptions;

        config.databaseAuthVariableOverride = {
            uid: connection.userUID ? connection.userUID : 'weighthub'
        };

        if (connection.credentialsPath) {
            const credentials = JSON.parse(fs.readFileSync(connection.credentialsPath, { encoding: 'utf-8' }));
            config.credential = admin.credential.cert(credentials);
        }

        return config;
    }
}