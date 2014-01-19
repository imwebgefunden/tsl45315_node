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

exports.settingTimingMode_cb = {
    setUp: function(callback) {
        this.oldConfReg = sens.wire.confReg;
        sens.init(function(err, val) {
            sens.wire.confReg = 0x00; // '400ms'
            callback();
        });
    },
    tearDown: function(callback) {
        sens.wire.confReg = this.oldConfReg;
        callback();
    },
    'set timingmode to "400ms" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.setTimingMode('400ms', function(err, val) {
            test.ifError(err);
            test.strictEqual(val, '400ms', 'timingmode not set to "400ms"');
            test.done();
        });
    },
    'set timingmode to "200ms" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.setTimingMode('200ms', function(err, val) {
            test.ifError(err);
            test.strictEqual(val, '200ms', 'timingmode not set to "200ms"');
            test.done();
        });
    },
    'set timingmode to "100ms" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.setTimingMode('100ms', function(err, val) {
            test.ifError(err);
            test.strictEqual(val, '100ms', 'timingmode not set to "100ms"');
            test.done();
        });
    },
    'set timingmode to "400ms" should not change other bits in the config register': function(test) {
        test.expect(1);
        sens.wire.confReg = 0xFF;
        sens.setTimingMode('400ms', function(err, val) {
            sens.readConfRegister(function(err, val) {
                test.strictEqual(val, (0xFF & 0xFC), "set timingmode 400ms changed other bits in config register");
                test.done();
            });
        });
    },
    'set timingmode to "200ms" should not change other bits in the timing register': function(test) {
        test.expect(1);
        sens.wire.confReg = 0xFF;
        sens.setTimingMode('200ms', function(err, val) {
            sens.readConfRegister(function(err, val) {
                test.strictEqual(val, (0xFF & 0xFD), "set timingmode 200ms changed other bits in timing register");
                test.done();
            });
        });
    },
    'set timingmode to "100ms" should not change other bits in the timing register': function(test) {
        test.expect(1);
        sens.wire.confReg = 0xFF;
        sens.setTimingMode('100ms', function(err, val) {
            sens.readConfRegister(function(err, val) {
                test.strictEqual(val, (0xFF & 0xFE), "set timingmode 100ms changed other bits in timing register");
                test.done();
            });
        });
    },
};

exports.wrongSettingTimingMode_cb = {
    setUp: function(callback) {
        this.oldconfReg = sens.wire.confReg;
        sens.init(function(err, val) {
            sens.wire.confReg = 0x08; // PSaveSkip: 1, '400ms'
            callback();
        });
    },
    tearDown: function(callback) {
        sens.wire.confReg = this.oldconfReg;
        callback();
    },
    'set wrong timingmode should call cb with an error and null': function(test) {
        test.expect(2);
        sens.setTimingMode('144', function(err, val) {
            test.strictEqual(err.message, 'wrong timingmode value in set timingmode command', 'wrong error message');
            test.strictEqual(val, null, 'value is not null');
            test.done();
        });
    },
    'set wrong timingmode should not change the PSaveSkipMode': function(test) {
        test.expect(1);
        sens.setTimingMode('144', function(err, val) {
            sens.getPSaveSkipMode(function(err, val) {
                test.strictEqual(val, 1, "wrong timingmode changed the psaveskipmode");
            });
            test.done();
        });
    },
    'set wrong timingmode should not change the timing register': function(test) {
        test.expect(1);
        sens.setTimingMode('144', function(err, val) {
            sens.readConfRegister(function(err, val) {
                test.strictEqual(val, 0x08, "wrong timingmode changed the timing register");
            });
            test.done();
        });
    }
};
