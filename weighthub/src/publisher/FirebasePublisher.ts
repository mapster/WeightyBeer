import * as admin from 'firebase-admin';

import { WeightHubPublisher } from "./WeightHubPublisher";
import { getFirebaseConfig } from "../firebase";
import { FirebaseOptions } from '../WeightHubConfig';
import quantize from '../quantize';
import { Weight, ActionTarget } from '../WeightHub';

export class FirebasePublisher implements WeightHubPublisher {

    private weightHubPath: string;
    private firebase: admin.app.App;
    private weightHubRef: admin.database.Reference;

    constructor(weightHubPath: string, connection?: FirebaseOptions) {
        this.weightHubPath = weightHubPath;
        const config = getFirebaseConfig(connection)
        this.firebase = admin.initializeApp(config, 'weightHub');
        this.weightHubRef = this.firebase.database().ref(this.weightHubPath);
    }

    async updateWeight(id: string, current: number, percent: number): Promise<boolean> {
        try {
            await this.weightHubRef.child(id).update({ current, percent });
            return true;
        } catch (reason) {
            console.error(`Firebase - Failed to update weight '${id}': ${reason}`);
            return false;
        }
    }

    async createWeight(id: string, current: number): Promise<boolean> {
        const weightRef = this.weightHubRef.child(id);
        try {
            await weightRef.update({ id, current: quantize(current) });
            return true;
        } catch (reason) {
            console.error(`Firebase - Failed to create weight '${id}': ${reason}`)
            return false;
        }
    }

    async getWeight(id: string): Promise<Weight> {
        const snapshot = await this.weightHubRef.child(id).once('value');
        return snapshot.val();
    }

    async set(id: string, field: ActionTarget, value: number): Promise<boolean> {
        try {
            await this.weightHubRef.child(id).update({ [field]: value });
            return true;
        } catch (reason) {
            console.error(`Firebase - Failed to update '${field}' of '${id}'.`);
            return false;
        }
    }

}