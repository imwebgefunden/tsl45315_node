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

var async = require('async');
var i2cFakeDev = require('./fakedevice/fake_i2c_tsl45315_dev.js');
var proxyquire = require('proxyquire').noCallThru();

var TSL45315 = proxyquire('./../tsl45315', {
    'i2c': i2cFakeDev
});

var sens = new TSL45315();
var nrOfSec = 60;

sens.on('newSensorValues', function(allData) {
    console.log('received event "newSensorValues" - calculating ...');
    console.log('LUX     : ' + allData.sensValues.devData.light.value);
    console.log(JSON.stringify(allData, null, 2));
});

function sensRead() {
    async.timesSeries(nrOfSec, function(n, next) {
        setTimeout(function() {
            sens.getAllValues(next);
            /*
            sens.getLux(function(err, val) {
            //console.log(err)
            console.log('light value is: ' + val + ' lux');	
            next (err, val);				
			})
			*/
        }, 1000);
    }, function(err, res) {
        // finished
        if (err) {
            console.log('Error occurred: ' + err);
        } else {
            console.log('finished');
        }
    });
}

console.log('sensor init ...');
sens.init(function(err, val) {
    if (err) {
        console.log('error on sensor init: ' + err);
    } else {
        console.log('sensor init completed. Read for 60 seconds on faked device ...');
        sensRead();
    }
});
