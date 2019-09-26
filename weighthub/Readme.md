# Weighthub

Node.js script that listens for sensor value changes, quantizes and aggregates them, and then publishes those values to the weightHub store.

Weighthub supports the following databases and can be configured
to use any of them as sensor reading source, action source and storage of
weight data.
* Redis
* Firebase

## Actions
Actions are messages that trigger events in WeightHub. The only that currently exists is `calibrate` which can set the `empty`, `zero` or `full` fields of a weight entry. These fields are used to calculate the `percent` field (remaining beer).

## Configuration

Weighthub requires a JSON configuration file. By default Weighthub
will attempt to read `weighthub-config.json` from the current directory, but you can override this by passing a path as a program argument. See `src/WeighthubConfig.ts` for a schema of the configuration file.

* `sensorSource.redis.channel` is the Redis Pub/Sub channel to listen for sensor readings. It should be the same as `weightsensor` is configured to publish sensor readings to.

* `weightHub.redis.keyPrefix` is the namespace that is used for the weight entries stored by WeightHub in Redis. It should always be `weight`.

* `sensorSource.firebase.path` is the path in Firebase to listen for sensor readings. It should be the same as `weightsensor` is configured to publish sensor readings to.

* `weightHub.firebase.path` is the path in Firebase where WeightHub stores the weight entries.

* `actionSource.redis.channel` is the Redis Pub/Sub channel to listen for WeightHub actions.

* `actionSource.firebase.path` is the path in Firebase to listen for WeightHub actions.

### Connections
The `connections` object is optional and weighthub will use default connection parameters to connect if none is specified. The `connection` fields of both `redis` and `firebase` in `sensorSource` and `weightHub` must be keys in the `connections` object.

#### Redis
Redis connections defaults to `127.0.0.1:6379`. See a full reference here https://github.com/luin/ioredis#connect-to-redis.

#### Firebase
Firebase connections must either specified in the configuration file or as environment variables. It is important that the `userUID` used has write access to the used paths in Firebase.

| Field                 | Required  |           Description                               |
| --------------------- | ----      | -----------                                         |
| `firebaseConfigPath`  | Yes       | Path to the `firebase-config.json`*                  |
| `credentialsPath`     | No        | Path to a JSON file with serviceAccount credentials |
| `userUID`             | No        | The user WeightHub should act as in firebase.       |

*The only required field in the firebase-config.json file is `databaseURL` set to https://project-id.firebaseio.com.

Environment Variables:
* FIREBASE_CONFIG: Can the `firebase-config.json` as a JSON-string, or the path to the file.
* GOOGLE_APPLICATION_CREDENTIALS: Same as `credentialsPath`.


### Example configurations

#### Redis and Firebase
The following configuration will set up WeightHub to listen for sensor readings and actions from Redis Pub/Sub, and store the weight data in Firebase.

```JSON
{
    "sensorSource": {
        "redis": {
            "channel": "sensors"
        }
    },
    "actionSource": {
        "redis": {
            "channel": "actions"
        }
    },
    "weightHub": {
        "firebase": {
            "connection": "weightybeer",
            "path": "weighthub/weights"
        }
    },
    "connections": {
        "weightybeer": {
            "firebase": {
                "firebaseConfigPath": "../firebase-config.json",
                "credentialsPath": "../credentials.json",
                "userUID": "weighthub"
            }
        }
    }
}
```

#### Redis
The following configuration will set up WeightHub to listen for sensor readings and actions from Redis Pub/Sub and store the weight data in Redis.

```JSON
{
    "sensorSource": {
        "redis": {
            "channel": "sensors",
            "connection": "my-non-local-redis"
        }
    },
    "actionSource": {
        "redis": {
            "channel": "actions",
            "connection": "my-non-local-redis"
        }
    },
    "weightHub": {
        "redis": {
            "connection": "weightybeer-redis",
            "keyPrefix": "weight"
        }
    },
    "connections": {
        "my-non-local-redis": {
            "port": 8999,
            "host": "192.168.0.10"
        },
        "weightybeer-redis": {
            "port": "6999",
            "password": "PasswordIsThePassword"
        }
    }
}
```

#### Firebase-config.json
Example of what a `firebase-config.json` should look like.
```
{
  "databaseURL": "https://<project-id>.firebaseio.com",
}
```

#### Credentials.json
Example of what a `credentials.json` should look like.
```
{
  "type": "service_account",
  "project_id": "<project-id>",
  "private_key_id": "<some_id>",
  "private_key": "****",
  "client_email": "<an email address>",
  "client_id": "<some id>",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/...com"
}
```
