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
var i2cFakeDev = require('../fakedevice/fake_i2c_tsl45315_dev.js');
var proxyquire = require('proxyquire').noCallThru();

var TSL45315 = proxyquire('./../../tsl45315', {
    'i2c': i2cFakeDev
});

var sens = new TSL45315();

exports.readAtPowerUp_cb = {
    setUp: function(callback) {
        this.oldlightReg = sens.wire.lightReg;
        sens.wire.lightReg = 0x01F7;
        sens.init(function(err, val) {
            callback();
        });
    },
    tearDown: function(callback) {
        sens.wire.lightReg = this.oldlightReg;
        callback();
    },
    'get lux at powerUp, 402ms ': function(test) {
        test.expect(2);
        sens.getLux(function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 503, 'get a wrong value for lux');
            test.done();
        });
    },
    'get all values at powerUp, 402ms ': function(test) {
        test.expect(2);
        var devData = {
            addr: 41,
            type: 'TSL45315',
            ts: 0,
            error: null,
            sensValues: {
                devData: {
                    light: {
                        unit: 'lx',
                        value: 503
                    }
                },
                rawData: {
                    addr_0x04: 247,
                    addr_0x05: 1,
                }
            }
        };
        sens.getAllValues(function(err, val) {
            test.ifError(err);
            // clone the timestamp :)
            devData.ts = val.ts;
            test.deepEqual(val, devData, 'failure at all values');
            test.done();
        });
    },
    'get lux at powerUp, 200ms ': function(test) {
        test.expect(3);
        sens.wire.lightReg = 0x00FB;
        sens.setTimingMode('200ms', function(err, val) {
            test.ifError(err);
            sens.getLux(function(err, val) {
                test.ifError(err);
                test.strictEqual(val, 502, 'calculate a wrong value for lux');
                test.done();
            });
        });
    },
    'get all values at powerUp, 200ms ': function(test) {
        test.expect(3);
        sens.wire.lightReg = 0x00FB;
        var devData = {
            addr: 41,
            type: 'TSL45315',
            ts: 0,
            error: null,
            sensValues: {
                devData: {
                    light: {
                        unit: 'lx',
                        value: 502
                    }
                },
                rawData: {
                    addr_0x04: 251,
                    addr_0x05: 0,
                }
            }
        };
        sens.setTimingMode('200ms', function(err, val) {
            test.ifError(err);
            sens.getAllValues(function(err, val) {
                test.ifError(err);
                // clone the timestamp :)
                devData.ts = val.ts;
                test.deepEqual(val, devData, 'failure at all values');
                test.done();
            });
        });
    },
    'get lux at powerUp, 100ms ': function(test) {
        test.expect(3);
        sens.wire.lightReg = 0x007D;
        sens.setTimingMode('100ms', function(err, val) {
            test.ifError(err);
            sens.getLux(function(err, val) {
                test.ifError(err);
                test.strictEqual(val, 500, 'calculate a wrong value for lux');
                test.done();
            });
        });
    },
    'get all values at powerUp, 100ms ': function(test) {
        test.expect(3);
        sens.wire.lightReg = 0x007D;
        var devData = {
            addr: 41,
            type: 'TSL45315',
            ts: 0,
            error: null,
            sensValues: {
                devData: {
                    light: {
                        unit: 'lx',
                        value: 500
                    }
                },
                rawData: {
                    addr_0x04: 125,
                    addr_0x05: 0,
                }
            }
        };
        sens.setTimingMode('100ms', function(err, val) {
            test.ifError(err);
            sens.getAllValues(function(err, val) {
                test.ifError(err);
                // clone the timestamp :)
                devData.ts = val.ts;
                test.deepEqual(val, devData, 'failure at all values');
                test.done();
            });
        });
    },

};
