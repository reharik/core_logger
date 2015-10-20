//var AWS = require("aws-sdk"),
//    Winston = require("winston"),
//    Joi = require("joi"),
//    Util = require("util"),
//    Enum = require("./sqsEnum.js"),
//    _ = require("lodash");
//
//var SqsLogstash = Winston.transports.SqsLogstash = module.exports = function(options){
//
//    var internals = this.internals = {
//        options : {
//            aws : {
//                region : "us-east-1"
//            },
//            sqs : { }
//        },
//        context : {},
//        schema : Joi.object().keys({
//            aws : Joi.object().keys({
//                region : Joi.string().valid(Enum.awsRegions()),
//                accessKeyId : Joi.string().required(),
//                secretAccessKey : Joi.string().required()
//            }).required(),
//            sqs : Joi.object().keys({
//                QueueUrl : Joi.string().uri().required()
//            }).required()
//        })
//    };
//
//    validate(options);
//    internals.options.aws = _.assign(internals.options.aws, options.aws);
//    internals.options.sqs = _.assign(internals.options.sqs, options.sqs);
//
//    internals.context.sqs = new AWS.SQS(internals.options.aws);
//
//    function validate(options){
//        Joi.validate(options, internals.schema, {allowUnknown : true}, function(err){
//            if(err)
//                throw err;
//        });
//    }
//}
//
//Util.inherits(SqsLogstash, Winston.Transport);
//
//SqsLogstash.prototype.log = function(level, message, meta, callback){
//    this.internals.context.sqs.sendMessage({
//            QueueUrl : this.internals.options.sqs.QueueUrl,
//            MessageBody : JSON.stringify(meta)
//        }, function(err, response){
//            return callback(err, !!response);
//        }
//    );
//}
