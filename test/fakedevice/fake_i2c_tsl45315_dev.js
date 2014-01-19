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

var i2cFakeDev = function(addr, opts) {
    var self = this;
    self.addr = addr;
    self.ctrlReg = 0x00;
    self.confReg = 0x00;
    self.idReg = 0xA0; // fake a TSL45315
    self.lightReg = 0x01F7;
};

i2cFakeDev.prototype.readBytes = function(cmd, len, callback) {
    var self = this;
    var buf = new Buffer(len);
    var err = null;

    switch (cmd) {
        case 0x80: // ctrl reg
            buf.writeUInt8(self.ctrlReg, 0);
            if (len !== 1) err = new Error('wrong len in readBytes for faked device');
            break;
        case 0x81: // config reg
            buf.writeUInt8(self.confReg, 0);
            if (len !== 1) err = new Error('wrong len in readBytes for faked device');
            break;
        case 0x8A: // id reg
            buf.writeUInt8(self.idReg, 0);
            if (len !== 1) err = new Error('wrong len in readBytes for faked device');
            break;
        case 0x84: // light reg, 16 bit, one read
            buf.writeUInt16LE(self.lightReg, 0);
            if (len !== 2) err = new Error('wrong len in readBytes for faked device');
            break;
        default:
            buf.writeUInt8(0, 0);
            err = new Error('not implemented in fake device');
    }

    callback(err, buf);
};

i2cFakeDev.prototype.writeBytes = function(cmd, data, callback) {
    var self = this;
    var err = null;

    if (data.length !== 1) {
        callback(new Error('wrong data len in writeBytes for faked device'), null);
    }

    switch (cmd) {
        case 0x80: // ctrl reg
            self.ctrlReg = data[0];
            break;
        case 0x81: // config reg
            self.confReg = data[0];
            break;
        default:
            err = new Error('not implemented in fake device');
            data.length = 0;
    }
    callback(err, data.length);
};

module.exports = i2cFakeDev;
