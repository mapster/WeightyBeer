import * as fs from 'fs';
import { WeightHubConfig, RedisPubSub, RedisConnection, RedisHash, FirebaseObject, FirebaseOptions, FirebaseConnection } from "./WeightHubConfig";
import { WeightHub } from "./WeightHub";
import { RedisSensorSource } from "./source/RedisSensorSource";
import { RedisPublisher } from "./publisher/RedisPublisher";
import { SensorSource } from "./source/SensorSource";
import { WeightHubPublisher } from "./publisher/WeightHubPublisher";
import { FirebaseSensorSource } from './source/FirebaseSensorSource';
import { RedisOptions } from 'ioredis';
import { FirebasePublisher } from './publisher/FirebasePublisher';

const configPath = process.argv[2] || './weighthub-config.json';

function getConnection(
    name?: string,
    connections?: { [key: string]: RedisConnection | FirebaseConnection }
): RedisOptions | FirebaseOptions | undefined {
    if (name && connections && connections[name]) {
        const connection = connections[name];
        if ((connection as FirebaseConnection).firebase) {
            return (connection as FirebaseConnection).firebase;
        } else if ((connection as RedisConnection).redis) {
            return (connection as RedisConnection).redis;
        }
    }
}

function initSensorSource(config: WeightHubConfig): SensorSource {
    if ((config.sensorSource as RedisPubSub).redis) {
        const source = (config.sensorSource as RedisPubSub).redis;

        const connection = getConnection(source.connection, config.connections) as RedisOptions;

        if (source.connection && !connection) {
            throw `Invalid configuration: sensorSource 'redis' connection '${source.connection}' does not exist!`;
        }

        return new RedisSensorSource(source.channel, connection);
    } else if ((config.sensorSource as FirebaseObject).firebase) {
        const source = (config.sensorSource as FirebaseObject).firebase;

        const connection = getConnection(source.connection, config.connections) as FirebaseOptions;

        if (source.connection && !connection) {
            throw `Invalid configuration: sensorSource 'firebase' connection '${source.connection}' does not exist!`;
        }

        return new FirebaseSensorSource(source.path, connection);
    } else {
        throw `Invalid configuration: unknown sensorSource type '${config.sensorSource}'`
    }
}

function initWeightHubPublisher(config: WeightHubConfig): WeightHubPublisher {
    if ((config.weightHub as RedisHash).redis) {
        const weightHub = (config.weightHub as RedisHash).redis;

        const connection = getConnection(weightHub.connection, config.connections) as RedisOptions;

        if (weightHub.connection && !connection) {
            throw `Invalid configuration: weightHub 'redis' connection '${weightHub.connection}' does not exist!`;
        }

        if (!weightHub.keyPrefix) {
            throw `Invalid configuration: weightHub.keyPrefix is not set!`;
        }

        return new RedisPublisher(weightHub.keyPrefix, connection);
    } else if ((config.weightHub as FirebaseObject).firebase) {
        const weightHub = (config.weightHub as FirebaseObject).firebase;

        const connection = getConnection(weightHub.connection, config.connections) as FirebaseOptions;

        if (weightHub.connection && !connection) {
            throw `Invalid configuration: weightHub 'firebase' connection '${weightHub.connection}' does not exist!`;
        }

        return new FirebasePublisher(weightHub.path, connection);
    } else {
        throw `Invalid configuration: unknown weightHub publisher type '${JSON.stringify(config.weightHub)}'`
    }
}

const config = JSON.parse(fs.readFileSync(configPath, { encoding: 'utf-8' }));

const sensorSource = initSensorSource(config);
const weightHubPublisher = initWeightHubPublisher(config);
const weightHub = new WeightHub(sensorSource, weightHubPublisher);

weightHub.run();