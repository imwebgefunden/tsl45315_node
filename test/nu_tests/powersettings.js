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

exports.settingPowerMode_cb = {
    setUp: function(callback) {
        this.oldCtrlReg = sens.wire.ctrlReg;
        sens.init(function(err, val) {
            sens.wire.ctrlReg = 0x00; // powerDown
            callback();
        });
    },
    tearDown: function(callback) {
        sens.wire.ctrlReg = this.oldCtrlReg;
        callback();
    },
    'set powermode to "normalMode" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.setPowerMode('normalMode', function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 'normalMode', 'powermode not set to "normalMode"');
            test.done();
        });
    },
    'set powermode to "normalMode" should not change other bits in the control register': function(test) {
        test.expect(1);
        sens.wire.ctrlReg = 0x00;
        sens.setPowerMode('normalMode', function(err, val) {
            sens.readCtrlRegister(function(err, val) {
                test.strictEqual(val, 0x03, "set powermode normalMode changed other bits in control register");
                test.done();
            });
        });
    },
    'set powermode to "powerDown" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.setPowerMode('powerDown', function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 'powerDown', 'powermode not set to "powerDown"');
            test.done();
        });
    },
    'set powermode to "powerDown" should not change other bits in the control register': function(test) {
        test.expect(1);
        sens.wire.ctrlReg = 0xFF;
        sens.setPowerMode('powerDown', function(err, val) {
            sens.readCtrlRegister(function(err, val) {
                test.strictEqual(val, (0xFF & 0xFC), "set powermode powerDown changed other bits in control register");
                test.done();
            });
        });
    },
    'set powermode to "runSingle" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.setPowerMode('runSingle', function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 'runSingle', 'powermode not set to "runSingle"');
            test.done();
        });
    },
    'set powermode to "runSingle" should not change other bits in the control register': function(test) {
        test.expect(1);
        sens.wire.ctrlReg = 0xFF;
        sens.setPowerMode('runSingle', function(err, val) {
            sens.readCtrlRegister(function(err, val) {
                test.strictEqual(val, (0xFF & 0xFE), "set powermode runSingle changed other bits in control register");
                test.done();
            });
        });
    },
};

exports.wrongSettingPowerMode_cb = {
    setUp: function(callback) {
        this.oldCtrlReg = sens.wire.ctrlReg;
        sens.init(function(err, val) {
            sens.wire.ctrlReg = 0x00; // powerDown
            callback();
        });
    },
    tearDown: function(callback) {
        sens.wire.ctrlReg = this.oldCtrlReg;
        callback();
    },
    'set wrong powermodemode should call cb with an error and null': function(test) {
        test.expect(2);
        sens.setPowerMode('powerUp', function(err, val) {
            test.strictEqual(err.message, 'wrong powermode value in set powermode command', 'wrong error message');
            test.strictEqual(val, null, 'value is not null');
            test.done();
        });
    },
    'set wrong powermode should not change the powermode': function(test) {
        test.expect(1);
        sens.setPowerMode('powerUp', function(err, val) {
            sens.getPowerMode(function(err, val) {
                test.strictEqual(val, 'powerDown', "wrong powermode changed the powermode");
            });
            test.done();
        });
    },
    'set wrong powermode should not change the control register': function(test) {
        test.expect(1);
        sens.setPowerMode('powerUp', function(err, val) {
            sens.readCtrlRegister(function(err, val) {
                test.strictEqual(val, 0x00, "wrong powermode changed the control register");
            });
            test.done();
        });
    }
};
