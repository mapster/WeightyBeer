const Redis = require("ioredis");

module.exports = class RedisPublisher {

    constructor(redisConfig) {
        this.config = redisConfig;
        this.isValidConfig(this.config);

        this.pub = new Redis();
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
