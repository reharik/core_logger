/**
 * Created by parallels on 8/4/15.
 */

var _logger = require('./modules/logger');
var moment = require('moment');

module.exports = function(_options) {
    var options = _options || {};
    var logger = new _logger({
        system: {
            applicationName: process.env.APPLICATION_NAME || 'root',
            environment: process.env.ENVIROMENT || 'dev'
        }
    });
    logger.addConsoleSink({
        level: options.consoleSink && options.consoleSink.level || options.level || 'silly',
        colorize: true,
        formatter: options.formatter
        || function (x) {
            return '[' + x.meta.level + '] module: '+options.moduleName+' msg: ' + x.meta.message + ' | ' + moment().format('h:mm:ss a');
        }
    }).info("added Console Sink")
        .addDailyRotateFileSink({
            level: options.fileSink && options.fileSink.level || options.level || 'info',
            filename: "/" + process.env.APPLICATION_NAME + ".log"
        })
        .info("added Daily RotateFile Sink");
    return logger;
};
