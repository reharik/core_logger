/**
 * Created by rharik on 6/1/2015.
 */

var TestLogger = function(){
    this.messages = [];
};

TestLogger.prototype.error = function(msg){
    this.messages.push({'level':'error', 'message': msg});
};
TestLogger.prototype.warn = function(msg){
    this.messages.push({'level':'warn', 'message': msg});
};
TestLogger.prototype.info = function(msg){
    this.messages.push({'level':'info', 'message': msg});
};
TestLogger.prototype.debug = function(msg){
    this.messages.push({'level':'debug', 'message': msg});
};
TestLogger.prototype.trace = function(msg){
    this.messages.push({'level':'trace', 'message': msg});
};

TestLogger.prototype.getMessages = function(){
    return this.messages;
};

TestLogger.prototype.getErrorMessages = function(){
    return this.messages.map(function(item){
        if(item.level == 'error') return item;
    });
};

TestLogger.prototype.getWarnMessages = function(){
    return this.messages.map(function(item){
        if(item.level == 'warn') return item;
    });
};

TestLogger.prototype.getInfoMessages = function(){
    return this.messages.map(function(item){
        if(item.level == 'info') return item;
    });
};

TestLogger.prototype.getDebugMessages = function(){
    return this.messages.map(function(item){
        if(item.level == 'debug') return item;
    });
};

TestLogger.prototype.getTraceMessages = function(){
    return this.messages.map(function(item){
        if(item.level == 'trace') return item;
    });
};

module.exports = TestLogger;