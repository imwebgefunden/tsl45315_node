# Sensor TSL45315 for node.js
---
A node.js module for working with the light sensor TSL45315 via i2c.

## About the sensor
The TSL45315 is an ambient light sensing (ALS) device that approximates human eye response under a variety of lighting conditions with a wide dynamic range
and direct 16-bit lux output via an I2C bus.
A breakout with the sensor is available at [watterott (Germany)](http://www.watterott.com/de/TSL45315-Breakout) or [watterott (COM)](http://www.watterott.com/en/TSL45315-Breakout).
This driver/module based on the [latest datasheet from ams](http://www.ams.com/eng/Products/Light-Sensors/Ambient-Light-Sensor-ALS/TSL45315).

## Install
```
$ npm install sensor_tsl45315
```
#### Raspberry PI
Enable [i2c on your Pi](https://github.com/kelly/node-i2c#raspberry-pi-setup) if you haven't done already. To avoid having to run the i2c tools as root add the ‘pi’ user to the i2c group:
```
sudo adduser pi i2c
```

## Usage
The module is easy to use. You have different config-options 

### Simple Usage
```
var TSL45315 = require('sensor_tsl45315');

var sense = new TSL45315();
sense.init(function(err, val) {
  if (!err) {
    sense.getLux(function(error, val) {
      if (!error) console.log(val + ' lux');
    });    
  }
});
```
 
### Don't forget to call init()
```ìnit()``` powers up the sensor and sets the given options.

### Options
The default options are:
```
{
  'debug': false,
  'address': 0x29,
  'device': '/dev/i2c-1',
  'powerMode': 'normalMode',
  'timingMode': '400ms',
  'psaveskipMode': 0,
}
```

Configure the sensor by supplying an options object to the constructor like:
```
var sense = new TSL2561({
    'timingMode': '200ms',
    'psaveskipMode': 1
});
```

### Getter & Setter for sensor settings
Getter supports only callbacks. Setter supports callbacks and event-emitters - ```sensorSettingChanged``` and ```sensorSettingFailed```. Getter and setter are:
```
getPowerMode(cB) / setPowerMode(newMode, [cB]) / modes: 'normalMode', 'powerDown', 'runSingle'
getTimingMode(cB) / setTimingMode(newMode, [cB]) / modes: '100ms', '200ms', '400ms'
getPSaveSkipMode(cB) / setPSaveSkipMode(newMode, [cB]) / modes: 0, 1
```

The ```sensorId``` is only a getter:
```
getSensorId(cB) / return value 'TSL45317', 'TSL45313', 'TSL45315' or 'TSL45311' on success
```

### Light-Measurements
Measurement-functions using a callback and ```getAllValues([cB])``` an event-emitter too. All events including a timestamp and additional data like the address to determine the sensor, who emitted the event.

* ```getLux([cB])``` - sensors lux value - emits event ```newSensorValue``` on success or ```sensorValueError``` on error
* ```getAllValues([cB])``` - all values (raw and calculated) - emits event ```newSensorValues``` on success or ```sensorValuesError``` on error

## Tests
Because it's not really a good idea to run test in an unknown environment all tests under test using a faked devices and not really your i2c bus. The faked device using a faked i2c-bus which is realised with the proxyquire module.

To run the complete test suite nodeunit is required. The best way is using grunt and the shipped gruntfile which comes with this module.

## Examples
All examples are using a real device on address ```0x29``` on your i2c bus. Be carefully if you have more as one device on your i2c or/and if you don't use the default address for the sensor.

## Licence
The licence is GPL v3 and the module is available at [Bitbucket](https://bitbucket.org/iwg/tsl45315_node) and [GitHub](https://github.com/imwebgefunden/tsl45315_node).