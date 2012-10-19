var events = require('events'),
    httpServer = require('./httpServer'),
    socketServer = require('./socketServer'),
    clientServer = require('./clientServer');

var emitter = new events.EventEmitter();

// httpServer.start(7776, emitter);
socketServer.start(7777, emitter);
clientServer.start(8080, emitter);