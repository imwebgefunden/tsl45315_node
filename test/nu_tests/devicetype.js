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

exports.deviceTypes = {
    setUp: function(callback) {
        this.sens = new TSL45315();
        this.sens.init(function(err, val) {
            callback();
        });
    },
    tearDown: function(callback) {
        callback();
    },
    'idReg "0xA0" is a TSL45315': function(test) {
        test.expect(2);
        this.sens.getSensorId(function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 'TSL45315', 'id "0xA0" is not a TSL45315');
            test.done();
        });
    },
    'idReg "0x80" is a TSL45317': function(test) {
        test.expect(2);
        this.sens.wire.idReg = 0x80;
        this.sens.getSensorId(function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 'TSL45317', 'id "0x80" is not a TSL45317');
            test.done();
        });
    },
    'idReg "0x90" is a TSL45313': function(test) {
        test.expect(2);
        this.sens.wire.idReg = 0x90;
        this.sens.getSensorId(function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 'TSL45313', 'id "0x90" is not a TSL45313');
            test.done();
        });
    },
    'idReg "0xB0" is a TSL45311': function(test) {
        test.expect(2);
        this.sens.wire.idReg = 0xB0;
        this.sens.getSensorId(function(err, val) {
            test.ifError(err);
            test.strictEqual(val, 'TSL45311', 'id "0xB0" is not a TSL45311');
            test.done();
        });
    },
};


exports.unknownDeviceType = {
    setUp: function(callback) {
        callback();
    },
    tearDown: function(callback) {
        callback();
    },
    'an unknown deviceType should raise an error ': function(test) {
        test.expect(1);
        var sens = new TSL45315();
        sens.wire.idReg = 0xC0;
        test.throws(
            function() {
                sens.getSensorId();
            }, /read wrong id value; unknown and unsupported device type/);
        test.done();
    },
};
