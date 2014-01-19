/*
 * This file is part of sensor_tsl45315 for node.
 *
 * Copyright (C) Thomas Schneider, imwebgefunden@gmail.com
 *
 * sensor_tsl45315 for node is free software: you can redistribute it
 * and/or modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * sensor_tsl45315 for node is distributed in the hope that it will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with sensor_tsl45315 for node. If not, see
 * <http://www.gnu.org/licenses/>.
 */

/* jslint node: true */
"use strict";

var TSL45315 = require('./../tsl45315');
var async = require('async');

var sens = new TSL45315();

sens.on('newSensorValues', function(allData) {
    console.log('received event "newSensorValues" - calculating ...');
    console.log('LUX     : ' + allData.sensValues.devData.light.value);
});

async.series([

        function(cB) {
            sens.init(function(err, val) {
                console.log('sensor init completed');
                cB(null, 'sensor init');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getPowerMode(function(err, val) {
                    console.log('power mode is: ' + val);
                    cB(null, 'read power mode');
                });
            }, 1000);
        },
        function(cB) {
            sens.getTimingMode(function(err, val) {
                console.log('timing mode is: ' + val);
                cB(null, 'read timing mode');
            });
        },
        function(cB) {
            sens.getSensorId(function(err, val) {
                console.log('sensor id is: ' + val);
                cB(null, 'read sensor id');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(err, val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 1000);
        },
        function(cB) {
            setTimeout(function() {
                sens.getAllValues(function(err, val) {
                    //console.log(JSON.stringify(val, null, 2));
                    cB(null, 'all sensor values');
                });
            }, 1000);
        },
        function(cB) {
            sens.setPowerMode('powerDown', function(err, val) {
                console.log('power mode is now: ' + val);
                cB(err, 'set power mode to off');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(err, val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 1000);
        },
        function(cB) {
            sens.setPowerMode('normalMode', function(err, val) {
                console.log('power mode is now: ' + val);
                cB(err, 'set power mode to up');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(err, val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 1000);
        },
        function(cB) {
            sens.setTimingMode('200ms', function(err, val) {
                console.log('timing mode is now: ' + val);
                cB(err, 'set timing mode to 200ms');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(err, val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 1000);
        },
        function(cB) {
            sens.setTimingMode('100ms', function(err, val) {
                console.log('timing mode is now: ' + val);
                cB(err, 'set timing mode to 100ms');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(err, val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 1000);
        },
        function(cB) {
            sens.getTimingMode(function(err, val) {
                console.log('timing mode is: ' + val);
                cB(null, 'read timing mode');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(err, val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 1000);
        },
        function(cB) {
            sens.getTimingMode(function(err, val) {
                console.log('timing mode is: ' + val);
                cB(null, 'read timing mode');
            });
        },
        function(cB) {
            sens.setTimingMode('400ms', function(err, val) {
                console.log('timing mode is now: ' + val);
                cB(err, 'set timing mode to 400ms');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(err, val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 1000);
        },
    ],
    function(err, results) {
        console.log(err);
        console.log('finished');
    });
