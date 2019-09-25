const Redis = require("ioredis");

const REDIS_HOST = process.env.WEIGHTYBEER_REDIS || 'localhost';

module.exports = class RedisPublisher {

    constructor(redisConfig) {
        this.config = redisConfig;
        this.isValidConfig(this.config);

        this.pub = new Redis({ host: this.config.host || REDIS_HOST });
    }

    createPublisher() {
        const pub = this.pub;
        const channel = this.config.channel;

        return (id, value, initialize = false) => {
            pub.publish(channel, JSON.stringify({ id, value }));
        }
    }

    isValidConfig(config) {
        if (!config.channel) {
            throw 'Invalid redis config: channel is missing';
        }
    }
}
