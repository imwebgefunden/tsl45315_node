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

exports.settingPSaveSkipMode_cb = {
    setUp: function(callback) {
        this.oldConfReg = sens.wire.confReg;
        sens.init(function(err, val) {
            sens.wire.confReg = 0x00; // PSaveSkip: 0, '400ms'
            callback();
        });
    },
    tearDown: function(callback) {
        sens.wire.confReg = this.oldconfReg;
        callback();
    },
    'set psaveskipmode to "1" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.setPSaveSkipMode(1, function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 1, 'psaveskipmode not set to "1"');
            test.done();
        });
    },
    'set psaveskipmode to "0" should call cb with no error and new value': function(test) {
        test.expect(2);
        sens.wire.confReg = 0x08; // PSaveSkip: 1, '400ms'
        sens.setPSaveSkipMode(0, function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 0, 'psaveskipmode not set to "0"');
            test.done();
        });
    },
    'set psaveskipmode to "1" should not change other bits in the config register': function(test) {
        test.expect(1);
        sens.wire.confReg = 0x00;
        sens.setPSaveSkipMode(1, function(err, val) {
            sens.readConfRegister(function(err, val) {
                test.strictEqual(val, 0x08, "set psaveskipmode 1 changed other bits in config register");
                test.done();
            });
        });
    },
    'set psaveskipmode to "0" should not change other bits in the timing register': function(test) {
        test.expect(1);
        sens.wire.confReg = 0xFF;
        sens.setPSaveSkipMode(0, function(err, val) {
            sens.readConfRegister(function(err, val) {
                test.strictEqual(val, 0xF7, "set psaveskipmode 0 changed other bits in config register");
                test.done();
            });
        });
    }
};

exports.wrongSettingPSaveSkipMode_cb = {
    setUp: function(callback) {
        this.oldConfReg = sens.wire.confReg;
        sens.init(function(err, val) {
            sens.wire.confReg = 0x00; // PSaveSkip: 0, '400ms'
            callback();
        });
    },
    tearDown: function(callback) {
        sens.wire.confReg = this.oldconfReg;
        callback();
    },
    'set wrong psaveskipmode should call cb with an error and null': function(test) {
        test.expect(2);
        sens.setPSaveSkipMode('1', function(err, val) {
            test.strictEqual(err.message, 'wrong psaveskipmode value in set psaveskipmode command', 'wrong error message');
            test.strictEqual(val, null, 'value is not null');
            test.done();
        });
    },
    'set wrong psaveskipmode should not change the psaveskipmode': function(test) {
        test.expect(1);
        sens.setPSaveSkipMode('1', function(err, val) {
            sens.getPSaveSkipMode(function(err, val) {
                test.strictEqual(val, 0, "wrong psaveskipmode changed the psaveskipmode");
                test.done();
            });
        });
    },
    'set wrong psaveskipmode should not change the config register': function(test) {
        test.expect(1);
        sens.wire.confReg = 0x08; // PSaveSkip: 1, '400ms'
        sens.setPSaveSkipMode('0', function(err, val) {
            sens.readConfRegister(function(err, val) {
                test.strictEqual(val, 0x08, "wrong psaveskipmode changed the config register");
                test.done();
            });
        });
    }
};
