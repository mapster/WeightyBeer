import Redis from "ioredis";
import { PubSub } from "apollo-server";
import { WEIGHT_UPDATED_EVENT } from "./api/schema/Subscriptions";
import { WeightRepository } from "./dao/WeightRepository";
import { REDIS_HOST } from "./server";

async function handleMessage(pubsub: PubSub, weightDao: WeightRepository, channel: string, message: string): Promise<void> {
    if (channel === WEIGHT_UPDATED_EVENT) {
        const weight = await weightDao.get(message);
        pubsub.publish(WEIGHT_UPDATED_EVENT, {weightUpdated: weight});
    }
}

function handleSubscribeError(err: any) {
    if (err) {
        console.log(`Failed to subscribe to ${WEIGHT_UPDATED_EVENT} redis channel: ${err}`);
    }
}

export function weightUpdatedHandler(pubsub: PubSub, weightRepository: WeightRepository) {
    const redis = new Redis({ host: REDIS_HOST });
    redis.subscribe(WEIGHT_UPDATED_EVENT, handleSubscribeError);
    redis.on("message", handleMessage.bind(null, pubsub, weightRepository));
}