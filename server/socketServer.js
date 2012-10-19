var http = require('http');
var WebSocketServer = require('websocket').server;

var httpServer,
    wsServer,
    emitter;

function onMessage(message) {
    var data = JSON.parse(message.utf8Data);
    emitter.emit('log', data);
}

function onClose(reasonCode, description) {
    console.log('Socket Logger ' + this.remoteAddress + ' disconnected at ' + (new Date()) + '.');
}

function onRequest(request, response) {
    var connection = request.accept('log-protocol', request.origin);
    connection.on('message', onMessage);
    connection.on('close', onClose);
}

function start(port, e) {
    emitter = e;
    httpServer = http.createServer(function(request, response) {
        response.writeHead(404);
        response.end();
    }).listen(port);
    wsServer = new WebSocketServer({
        httpServer: httpServer,
        autoAcceptConnections: false
    });
    wsServer.on('request', onRequest);
    console.log('Socket Server has started, listening ' + port + '.');
}

exports.start = start;