var http = require("http");
var url = require("url");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("Request for " + request.url);
        route(handle, pathname, request, response);
    }

    http.createServer(onRequest).listen(6666);
    console.log("Log Server has started.");
}

var handle = {};
handle["/"] = requestHandlers.index;
handle["/logs"] = requestHandlers.logs;

start(router.route, handle);