var TSL45315 = require('./../tsl45315');
var async = require('async');

var sens = new TSL45315();

async.series([

        function(cB) {
            sens.getPowerMode(function(val) {
                console.log('power mode is: ' + val);
                cB(null, 'read power mode');
            });
        },
        function(cB) {
            sens.getTimingMode(function(val) {
                console.log('timing mode is: ' + val);
                cB(null, 'read timing mode');
            });
        },
        function(cB) {
            sens.getSensorId(function(val) {
                console.log('sensor id is: ' + val);
                cB(null, 'read sensor id');
            });
        },
        function(cB) {
            sens.getPSaveSkipMode(function(val) {
                console.log('sensor psaveskip mode is: ' + val);
                cB(null, 'read psaveskip mode');
            });
        },
        function(cB) {
            sens.getLux(function(val) {
                console.log('light value is: ' + val + ' lux');
                cB(null, 'read sensor value');
            });
        },
        function(cB) {
            sens.setPowerMode('powerDown', function(err, val) {
                console.log('power mode is now: ' + val);
                cB(err, 'set power mode to off');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 500);
        },
        function(cB) {
            sens.setPowerMode('normalMode', function(err, val) {
                console.log('power mode is now: ' + val);
                cB(err, 'set power mode to normal');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 500);
        },
        function(cB) {
            sens.setTimingMode('200ms', function(err, val) {
                console.log('timing mode is now: ' + val);
                cB(err, 'set timing mode to 200ms');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 500);
        },
        function(cB) {
            sens.setTimingMode('100ms', function(err, val) {
                console.log('timing mode is now: ' + val);
                cB(err, 'set timing mode to 100ms');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 500);
        },
        function(cB) {
            sens.setPSaveSkipMode(1, function(err, val) {
                console.log('psaveskip mode is now: ' + val);
                cB(err, 'set psaveskip mode to 1');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 500);
        },
        function(cB) {
            sens.getTimingMode(function(val) {
                console.log('timing mode is: ' + val);
                cB(null, 'read timing mode');
            });
        },
        function(cB) {
            sens.setPSaveSkipMode(0, function(err, val) {
                console.log('psaveskip mode is now: ' + val);
                cB(err, 'set psaveskip mode to 0');
            });
        },
        function(cB) {
            setTimeout(function() {
                sens.getLux(function(val) {
                    console.log('light value is: ' + val + ' lux');
                    cB(null, 'read sensor value');
                });
            }, 500);
        },
        function(cB) {
            sens.getTimingMode(function(val) {
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
                sens.getLux(function(val) {
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
