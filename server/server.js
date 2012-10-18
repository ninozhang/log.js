var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require("querystring");
var WebSocketServer = require('websocket').server;

var httpServer,
    wsServer;

function logs(request, response) {

}

function onRequest(request, response) {
    console.log('on request:' + request.url);
    var query = querystring.parse(url.parse(request.url).query),
        method = query['method'],
        size = parseInt(query['size']) || 1,
        json = {};
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(json));
    response.end();
}

httpServer = http.createServer(onRequest).listen(8080);
console.log('Log Server has started.');

wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

wsServer.on('request', function(request) {
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});