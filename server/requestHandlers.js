var url = require('url');
var fs = require('fs');
var querystring = require("querystring");

function index(request, response) {
    fs.readFile('web/index.html', function (err, data) {
        if (err) throw err;
        data = String(data).replace(new RegExp('{ts}', 'gm'), new Date().getTime());
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
}

function logs(request, response) {
    var query = querystring.parse(url.parse(request.url).query),
        size = parseInt(query['size']) || 1,
        json = {};
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(json));
    response.end();
}

exports.index = index;
exports.log = logs;