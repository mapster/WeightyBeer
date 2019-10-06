# WeightyBeer

The WeightyBeer project is a beer keg volume monitor system. Monitor the approximate remaining volume of your kegs and display it on a tablet by your taps. With the _elm-client_ web app you can manage all your brews and taps. Just add the number of taps you have, and select the brew currently hooked up to each tap. The _weighthub_ app automatically aggregates the real-time readings from each load cell sensor so that only relevant changes are propagated to the web _client_ app. Use the _weightsim_ app for testing purposes if you need to simulate load cell sensors during setup.

## Requirements
- Load cell (readable by software)
  - E.g. Modified package scale hooked up to an arduino and use the included weightsensor app
- (Cheap) Tablet and somewhere to mount it
- Computer to connect the arduino to and run the WeightyBeer project

# Physical setup
TODO

## Setup
1. Install git, docker and docker-compose
1. Clone the project
1. Verify that `WeightyBeer/weightsensor/config.json` works for you, or update it accordingly
1. Use docker-compose to build and run WeightyBeer
  1. `cd WeightyBeer`
  1. `docker-compose -f docker-compose.yml build`
  1. `docker-compose -f docker-compose.yml run -d`


## Contribute

If you want to contribute then styling is in dire need. Also a better aggregation
algorithm for the _weighthub_ app would be nice. Just give me a pull request and
I'll look into it. Thanks :D  

## License

This project is licensed under the terms of the
[MIT license](https://github.com/mapster/WeightyBeer/blob/master/LICENSE).
