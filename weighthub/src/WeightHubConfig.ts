import { RedisOptions } from "ioredis";

export interface WeightHubConfig {
    actionSource: RedisPubSub | FirebaseObject;
    sensorSource: RedisPubSub | FirebaseObject;
    weightHub: RedisHash | FirebaseObject;
    connections?: { [key: string]: RedisConnection | FirebaseConnection };
}

export interface FirebaseObject {
    firebase: {
        connection?: string;
        path: string;
    }
}

export interface RedisPubSub {
    redis: {
        connection?: string;
        channel: string
    }
}

export interface RedisHash {
    redis: {
        connection?: string;
        keyPrefix: string;
    }
}

export interface RedisConnection {
    redis: RedisOptions
}

export interface FirebaseConnection {
    firebase: FirebaseOptions
}

export interface FirebaseOptions {
    firebaseConfigPath: string;
    credentialsPath?: string;
    userUID?: string;
}