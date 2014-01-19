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

async.series([

        function(cB) {
            sens.init(function(err, val) {
                console.log('sensor init completed');
                cB(null, 'sensor init');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getAllValues(function(err, val) {
                    console.log(JSON.stringify(val, null, 2));
                    cB(err, 'all sensor values');
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
                sens.getAllValues(function(err, val) {
                    console.log(JSON.stringify(val, null, 2));
                    cB(err, 'all sensor values');
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
                sens.getAllValues(function(err, val) {
                    console.log(JSON.stringify(val, null, 2));
                    cB(err, 'all sensor values');
                });
            }, 1000);
        },
        function(cB) {
            sens.setTimingMode('400ms', function(err, val) {
                console.log('timing mode is now: ' + val);
                cB(err, 'all sensor values');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getAllValues(function(err, val) {
                    console.log(JSON.stringify(val, null, 2));
                    cB(err, 'all sensor values');
                });
            }, 1000);
        },
    ],
    function(err, results) {
        console.log(err);
        console.log('finished');
    });
