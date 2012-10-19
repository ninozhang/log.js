var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');
var WebSocketServer = require('websocket').server;

var httpServer,
    wsServer,
    emitter,
    clients = {};

function broadcast(message, tag) {
    var connections = [];
    if (clients['/']) {
        connections = connections.concat(clients['/']);
    }
    if (tag) {
        tag = '/' + tag;
        if (clients[tag]) {
            connections = connections.concat(clients[tag]);
        }
    }
    var length = connections.length,
        connection;
    for (var i = 0; i < length; i++) {
        var connection = connections[i];
        connection && connection.sendUTF(message);
    }
}

function onClose(reasonCode, description) {
    for (var key in clients) {
        var connections = clients[key],
            length = connections ? connections.length : 0;
        for (var i = 0; i < length; i++) {
            if (connections[i] === this) {
                connections[i] = null;
                break;
            }
        }
    }
    console.log('Client [' + this.remoteAddress + '] disconnected at ' + (new Date()) + '.');
}

function onRequest(request, response) {
    var connection = request.accept('client-protocol', request.origin);
    var path = request.resourceURL.path;
    if (path.length > 1 &&
        (path.lastIndexOf('/') === path.length - 1)) {
        path = path.substr(0, path.length - 1);
    }
    if (!clients[path]) {
        clients[path] = [];
    }
    clients[path].push(connection);
    connection.on('close', onClose);
    console.log('Client [' + this.remoteAddress + '] connected, path [' + path + '].');
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
    emitter.on('log', function(data) {
        broadcast(JSON.stringify(data), data.tag);
    });
    console.log('Client Server has started, listening ' + port + '.');
}

exports.start = start;