const winston = require('winston');
const moment = require('moment');
const os = require('os');
require('winston-logstash');
require('winston-loggly-bulk');

module.exports = function () {
    const useTransports = process.env.LOGGING_TRANSPORTS;

    let transports = [];
    if(useTransports && useTransports.indexOf('logstash') >=0 )
    {
        let logstash = new (winston.transports.Logstash)({
            port: 5000,
            node_name: os.hostname(),
            host: "mf_logstash",
            // max_connect_retries: 10,
            timeout_connect_retries: 1500
        });
        logstash.on('error', function(err) {
            // console.error(err); // replace with your own functionality here
        });
        transports.push(logstash);
    }

  if(useTransports && useTransports.indexOf('loggly') >=0 && !!process.env.LOGGLY_TOKEN) {
    let loggly = new (winston.transports.Loggly)({
      token: process.env.LOGGLY_TOKEN,
      subdomain: "methodfitness",
      tags: ["Winston-NodeJS"],
      json:true,
      level: process.env.LOGGING_LEVEL || 'info,'
    });
    transports.push(loggly);
  }

    if(!useTransports || useTransports.indexOf('console') >= 0)
        transports.push(
          new (winston.transports.Console)({
              handleExceptions: true,
              prettyPrint: true,
              colorize: true,
              silent: false,
              timestamp: true,
              json: false,
              formatter: (x) => {
                  return `[${x.meta.level || x.level}] module: ${process.env.APPLICATION_NAME} msg: ${x.meta.details || x.details} | ${moment().format('h:mm:ss a')}`;
              }
          }));

    winston.configure({
        transports,
        level: process.env.LOGGING_LEVEL || 'silly'
    });

    let message = {
        system: {
            environment: process.env.ENV,
            applicationName: process.env.APPLICATION_NAME,
            host: os.hostname(),
            pid: process.pid
        },
        sprops: {},
        nprops: {},
        tags: [],
        details: ""
    };

    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    function mapError(err, message) {
        message.details = err.message;
        message.stackTrace = err.stack;
        err.keys && err.keys.forEach(key => {
            if (isNumeric(err[key]))
                message.nprops[key] = err[key];
            else if (typeof (err[key]) === 'string')
                message.sprops[key] = err[key];
        });

        return message;
    }

    function mapMessage(input, level) {
        let newMessage = Object.assign({}, message);
        if (input === null) {
            return;
        }
        newMessage.level = level;
        message["@timestamp"] = moment().toISOString();

        if (input instanceof Error) {
            return mapError(input, newMessage);
        }
        if (input.error instanceof Error) {
            return mapError(input.error, newMessage);
        }
        newMessage.details = input;
        return newMessage;
    }

    const trace = (message, ...args) => {
      if(args){
        message = util.format(message, ...args)
      }
      winston.silly(mapMessage(message, 'trace'));
    };

    const debug = (message, ...args) => {
      if(args){
        message = util.format(message, ...args)
      }
      winston.debug(mapMessage(message, 'debug'));
    };

    const info = (message, ...args) => {
      if(args){
        message = util.format(message, ...args)
      }
      winston.info(mapMessage(message, 'info'));
    };

    const warn = (message, ...args) => {
      if(args){
        message = util.format(message, ...args)
      }
      winston.warn(mapMessage(message, 'warn'));
    };

    const error = (message, ...args) => {
      if(args){
        message = util.format(message, ...args)
      }
      winston.error(mapMessage(message, 'error'));
    };

    return {
        trace,
        debug,
        info,
        warn,
        error
    }
};
