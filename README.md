# WeightyBeer

_Status: WIP_

The WeightyBeer project is a beer keg volume monitor system. Monitor the approximate remaining volume of your kegs and display it on a tablet by your taps. With the _client_ web app you can manage all your brews and taps. Just add the number of taps you have, and select the brew currently hooked up to each tap. The _weighthub_ app automatically aggregates the real-time readings from each load cell sensor so that only relevant changes are propagated to the web _client_ app. Use the _weightsim_ app for testing purposes if you need to simulate load cell sensors during setup.

## Requirements
- Load cell (readable by software)
  - E.g. Modified package scale hooked up to an arduino and use the included weightsensor app
- Firebase project (The real-time database used in this project)
- (Cheap) Tablet and somewhere to mount it
- Computer to host the _client_ web app and the _weighthub_ app

## Setup
1. Clone the project
2. Create a firebase-config.json in the root of the cloned project (see your firebase console)
  - Currently no authentication is used, though it may be added at a later point.
  - All the apps in the project use the same config file.
3. Run `npm install` for each you need to use (at least the _client_ and the _weighthub_ apps)
4. Run `node weighthub.js` in the weighthub directory
5. Run `npm run build` in the client directory
6. Host the `client/build` directory somehow, e.g. install the _serve_ module from npm
7. Run your load cell sensor reader apps

## Weighthub

The only thing to know about the _weighthub_ app is that it expects the sensor reader apps to post the readings to the root of the firebase database in the following format:
```
{
  sensors: {
    weight: {
      reader1: {
        id: 'reader1',
        value: 690123
      },
      ...
    }
  }
}
```

## Contribute

If you want to contribute then styling is in dire need. Also a better aggregation
algorithm for the _weighthub_ app would be nice. Just give me a pull request and
I'll look into it. Thanks :D  

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mapster/WeightyBeer/blob/master/LICENSE).
