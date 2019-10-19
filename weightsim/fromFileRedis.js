const redis = require("redis");
const fs = require('fs');

const REDIS_HOST = process.env.WEIGHTYBEER_REDIS || 'localhost';

const publisher = redis.createClient({ host: REDIS_HOST });


function* getMessage() {
    const filePath = process.argv[2];
    const messages = fs.readFileSync(filePath, { encoding: 'utf-8' }).split("\n");

    for (let i = 0; i < messages.length - 1; i++) {
        yield messages[i];
    }

    return;
}

const iterator = getMessage();
function publish(add = 0) {
    let msg = iterator.next().value;

    const reading = JSON.parse(msg);
    reading.value += add;
    msg = JSON.stringify(reading);

    publisher.publish('sensors', msg);
}
setInterval(publish, 1000);

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (cmd) {
    cmd = cmd.trim();
    if (cmd === 'notify') {
        console.log("forcing notify");
        publish(-500000)
    } else {
        console.log("Unknown command: " + cmd);
    }
});