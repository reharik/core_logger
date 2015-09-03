/**
 * Created by parallels on 8/4/15.
 */

var _logger = require('./modules/logger');

var logger = new _logger({
        system: {
            applicationName: process.env.APPLICATION_NAME || 'root',
            environment: process.env.ENVIROMENT || 'dev'
        }
    });
    logger.addDailyRotateFileSink({
            level:  'info',
            filename: "/" + process.env.APPLICATION_NAME + ".log"
        })
        .info("added Daily RotateFile Sink");

module.exports = logger;
