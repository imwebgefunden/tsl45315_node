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

var util = require('util');
var Wire = require('i2c');
var events = require('events');
var _ = require('underscore');
var async = require('async');
var debug;
var defaultOptions = {
    'debug': false,
    'address': 0x29,
    'device': '/dev/i2c-1',
    'powerMode': 'normalMode',
    'timingMode': '400ms',
    'psaveskipMode': 0,
};

var TSL45315 = function(opts) {
    var self = this;

    events.EventEmitter.call(this);
    self.options = _.extend({}, defaultOptions, opts);
    self.wire = new Wire(this.options.address, {
        device: this.options.device,
        debug: this.options.debug
    });

    self.setPowerMode(self.options.powerMode);
    self.setTimingMode(self.options.timingMode);

};

util.inherits(TSL45315, events.EventEmitter);

TSL45315.prototype.timingModes = {
    '400ms': 0x00,
    '200ms': 0x01,
    '100ms': 0x02,
};

TSL45315.prototype.powerModes = {
    'powerDown': 0x00,
    'reserved': 0x01,
    'runSingle': 0x02,
    'normalMode': 0x03
};

TSL45315.prototype.registers = {
    'control': {
        'location': 0x00,
    },
    'config': {
        'location': 0x01,
    },
    'lightData': {
        'location': 0x04,
    },
    'id': {
        'location': 0x0A,
    },
};

TSL45315.prototype.init = function(callback) {
    var self = this;

    async.series([

            function(cB) {
                self.getSensorId(cB);
            },
            function(cB) {
                cB();
                //self.setPowerMode(self.options.powerMode, cB);
            },
            function(cB) {
                cB();
                //self.setTimingMode(self.options.timingMode, cB);
            },
            function(cB) {
                cB();
                //self.setGainMode(self.options.gainMode, cB);
            }
        ],
        function(err, res) {
            var ts = Math.round(+new Date() / 1000);
            var evData = {
                'addr': self.options.address,
                'type': 'TSL45315',
                'ts': ts,
                'error': err
            };
            if (err) {
                self.emit('sensorInitFailed', evData);
                if (callback) callback(err, null);
            } else {
                self.emit('sensorInitCompleted', evData);
                if (callback) callback(null, true);
            }
        });
};

TSL45315.prototype.readRegister = function(register, callback) {
    var self = this;
    var readCmd = 0x80 | register.location;

    self.wire.readBytes(readCmd, 1, function(err, bytes) {
        callback(err, bytes.readUInt8(0));
    });
};

TSL45315.prototype.readCtrlRegister = function(callback) {
    var self = this;

    self.readRegister(self.registers.control, function(err, val) {
        callback(err, val);
    });
};

TSL45315.prototype.readConfRegister = function(callback) {
    var self = this;

    self.readRegister(self.registers.config, function(err, val) {
        callback(err, val);
    });
};

TSL45315.prototype.readIdRegister = function(callback) {
    var self = this;

    self.readRegister(self.registers.id, function(err, val) {
        callback(err, val);
    });
};

TSL45315.prototype.getPowerMode = function(callback) {
    var self = this;
    var modeArr = Object.keys(self.powerModes);

    self.readCtrlRegister(function(err, val) {
        if (err) {
            if (callback) callback(new Error('read powermode failed'), null);
            return;
        }

        var mode = (val & 0x03);
        self.options.powerMode = modeArr[mode];
        callback(null, modeArr[mode]);
    });
};

TSL45315.prototype.setPowerMode = function(newMode, callback) {
    var self = this;
    var writeCmd = 0x80 | self.registers.control.location;

    if (_.has(self.powerModes, newMode) === false) {
        var err = new Error('wrong powermode value in set powermode command');
        var ts = Math.round(+new Date() / 1000);
        var evData = {
            'addr': self.options.address,
            'type': 'TSL45315',
            'setting': 'powerMode',
            'newValue': newMode,
            'ts': ts,
            'error': err
        };
        self.emit('sensorSettingFailed', evData);
        if (callback) callback(err, null);
        return;
    }

    async.waterfall([

            function(cB) {
                self.readCtrlRegister(function(err, val) {
                    if (err) {
                        cB(new Error('powermode not set'), 'read');
                    } else {
                        cB(null, val);
                    }
                });
            },
            function(oldReg, cB) {
                var writeVal = oldReg & 0xFC; // clear the original power bits
                writeVal |= self.powerModes[newMode];
                self.wire.writeBytes(writeCmd, [writeVal], function(err) {
                    if (err) {
                        cB(new Error('powermode not set on write'), 'write');
                    } else {
                        cB(null, 'write');
                    }
                });
            },
            function(arg1, cB) {
                self.getPowerMode(function(err, val) {
                    if (err) {
                        cB(new Error('powermode not set'), 'read');
                    } else {
                        if (val === newMode) {
                            cB(null, 'read');
                        } else {
                            cB(new Error('powermode not set'), 'read');
                        }
                    }
                });
            }
        ],
        function(err, results) {
            var ts = Math.round(+new Date() / 1000);
            var evData = {
                'addr': self.options.address,
                'type': 'TSL45315',
                'setting': 'powerMode',
                'newValue': newMode,
                'ts': ts,
                'error': err
            };
            if (err) {
                self.emit('sensorSettingFailed', evData);
                if (callback) callback(err, null);
            } else {
                self.options.powerMode = newMode;
                self.emit('sensorSettingChanged', evData);
                if (callback) callback(null, newMode);
            }
        });
};

TSL45315.prototype.getTimingMode = function(callback) {
    var self = this;
    var modeArr = Object.keys(self.timingModes);

    self.readConfRegister(function(err, val) {
        if (err) {
            if (callback) callback(new Error('read timingmode failed'), null);
            return;
        }

        var mode = (val & 0x03);
        self.options.timingMode = modeArr[mode];
        callback(null, modeArr[mode]);
    });
};

TSL45315.prototype.setTimingMode = function(newMode, callback) {
    var self = this;
    var writeCmd = 0x80 | self.registers.config.location;

    if (_.has(self.timingModes, newMode) === false) {
        var err = new Error('wrong timingmode value in set timingmode command');
        var ts = Math.round(+new Date() / 1000);
        var evData = {
            'addr': self.options.address,
            'type': 'TSL45315',
            'setting': 'timingMode',
            'newValue': newMode,
            'ts': ts,
            'error': err
        };
        self.emit('sensorSettingFailed', evData);
        if (callback) callback(err, null);
        return;
    }

    async.waterfall([

            function(cB) {
                self.readConfRegister(function(err, val) {
                    if (err) {
                        cB(new Error('timingmode not set'), 'read');
                    } else {
                        cB(null, val);
                    }
                });
            },
            function(oldReg, cB) {
                var writeVal = oldReg & 0xFC; // clear the original timing bits
                writeVal |= self.timingModes[newMode];
                self.wire.writeBytes(writeCmd, [writeVal], function(err) {
                    if (err) {
                        cB(new Error('timingmode not set on write'), 'write');
                    } else {
                        cB(null, 'write');
                    }
                });
            },
            function(arg1, cB) {
                self.getTimingMode(function(err, val) {
                    if (err) {
                        cB(new Error('timingmode not set'), 'read');
                    } else {
                        if (val === newMode) {
                            cB(null, 'read');
                        } else {
                            cB(new Error('timingmode not set'), 'read');
                        }
                    }
                });
            }
        ],
        function(err, results) {
            var ts = Math.round(+new Date() / 1000);
            var evData = {
                'addr': self.options.address,
                'type': 'TSL45315',
                'setting': 'timingMode',
                'newValue': newMode,
                'ts': ts,
                'error': err
            };
            if (err) {
                self.emit('sensorSettingFailed', evData);
                if (callback) callback(err, null);
            } else {
                self.options.timingMode = newMode;
                self.emit('sensorSettingChanged', evData);
                if (callback) callback(null, newMode);
            }
        });
};

TSL45315.prototype.getPSaveSkipMode = function(callback) {
    var self = this;

    self.readConfRegister(function(err, val) {
        if (err) {
            if (callback) callback(new Error('read psaveskipmode failed'), null);
            return;
        }

        var mode = ((val >> 3) & 0x01);
        self.options.psaveskipMode = mode;
        callback(null, mode);
    });
};

TSL45315.prototype.setPSaveSkipMode = function(newMode, callback) {
    var self = this;
    var writeCmd = 0x80 | self.registers.config.location;

    if ((newMode < 0) || (newMode > 1) || (!(typeof newMode === 'number' && newMode % 1 === 0))) {
        var err = new Error('wrong psaveskipmode value in set psaveskipmode command');
        var ts = Math.round(+new Date() / 1000);
        var evData = {
            'addr': self.options.address,
            'type': 'TSL45315',
            'setting': 'pSaveSkipMode',
            'newValue': newMode,
            'ts': ts,
            'error': err
        };
        self.emit('sensorSettingFailed', evData);
        if (callback) callback(err, null);
        return;
    }

    async.waterfall([

            function(cB) {
                self.readConfRegister(function(err, val) {
                    if (err) {
                        cB(new Error('psaveskipmode not set'), 'read');
                    } else {
                        cB(null, val);
                    }
                });
            },
            function(oldReg, cB) {
                var writeVal = newMode << 3;
                var otherBits = oldReg & 0xF7; // clear the old psaveskipmode
                writeVal |= otherBits;
                self.wire.writeBytes(writeCmd, [writeVal], function(err) {
                    if (err) {
                        cB(new Error('psaveskipmode not set on write'), 'write');
                    } else {
                        cB(null, 'write');
                    }
                });
            },
            function(arg1, cB) {
                self.getPSaveSkipMode(function(err, val) {
                    if (err) {
                        cB(new Error('psaveskipmode not set'), 'read');
                    } else {
                        if (val === newMode) {
                            cB(null, 'read');
                        } else {
                            cB(new Error('psaveskipmode ... not set'), 'read');
                        }
                    }
                });
            }
        ],
        function(err, results) {
            var ts = Math.round(+new Date() / 1000);
            var evData = {
                'addr': self.options.address,
                'type': 'TSL45315',
                'setting': 'pSaveSkipMode',
                'newValue': newMode,
                'ts': ts,
                'error': err
            };
            if (err) {
                self.emit('sensorSettingFailed', evData);
                if (callback) callback(err, null);
            } else {
                self.options.psaveskipMode = newMode;
                self.emit('sensorSettingChanged', evData);
                if (callback) callback(null, newMode);
            }
        });
};

TSL45315.prototype.getSensorId = function(callback) {
    var self = this;
    var idArr = ['TSL45317', 'TSL45313', 'TSL45315', 'TSL45311'];

    self.readIdRegister(function(err, val) {
        if (err) {
            if (callback) callback(new Error('read sensor id failed'), null);
            return;
        }
        var id = (val >> 4) - 8;
        if (id > 3) {
            throw new Error('read wrong id value; unknown and unsupported device type');
        }
        callback(null, idArr[id]);
    });
};

TSL45315.prototype.getLux = function(callback) {
    var self = this;
    var readLightCmd = 0x80 | self.registers.lightData.location;
    var hi = 0;
    var lo = 0;
    var lx = 0;
    var m = self.timingModes[self.options.timingMode] * 2; // multiplier

    if (m === 0) {
        m = 1;
    }

    self.wire.readBytes(readLightCmd, 2, function(err, bytes) {
        var ts = Math.round(+new Date() / 1000);
        var evData = {
            'addr': self.options.address,
            'type': 'TSL45315',
            'valType': 'light',
            'ts': ts,
            'error': err
        };
        if (err) {
            self.emit('sensorValueError', evData);
            if (callback) callback(err, null);
        } else {
            hi = bytes.readUInt8(1);
            lo = bytes.readUInt8(0);
            lx = (hi << 8) + lo;
            lx *= m;
            evData.sensVal = lx;
            self.emit('newSensorValue', evData);
            if (callback) callback(null, lx);
        }
    });
};

TSL45315.prototype.getAllValues = function(callback) {
    var self = this;
    var readLightCmd = 0x80 | self.registers.lightData.location;
    var hi = 0;
    var lo = 0;
    var lx = 0;
    var m = self.timingModes[self.options.timingMode] * 2; // multiplier

    if (m === 0) {
        m = 1;
    }
    self.wire.readBytes(readLightCmd, 2, function(err, bytes) {
        var ts = Math.round(+new Date() / 1000);
        var evData = {
            'addr': self.options.address,
            'type': 'TSL45315',
            'ts': ts,
            'error': err
        };
        if (err) {
            self.emit('sensorValuesError', evData);
            if (callback) callback(err, null);
        } else {
            hi = bytes.readUInt8(1);
            lo = bytes.readUInt8(0);
            lx = (hi << 8) + lo;
            lx *= m;

            var devData = {
                devData: {
                    light: {
                        unit: 'lx',
                        value: lx,
                    },
                },
                rawData: {
                    addr_0x04: lo,
                    addr_0x05: hi,
                }
            };
            evData.sensValues = devData;
            self.emit('newSensorValues', evData);
            if (callback) callback(null, evData);
        }
    });
};

module.exports = TSL45315;
