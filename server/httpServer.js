var http = require('http');
var url = require('url');
var querystring = require('querystring');

var httpServer,
    emitter;

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

function start(port, e) {
    emitter = e;
    httpServer = http.createServer(onRequest).listen(port);
    console.log('HTTP Server has started, listening ' + port + '.');
}

exports.start = start;