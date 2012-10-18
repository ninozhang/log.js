var fs = require('fs');

function route(handle, pathname, request, response) {
    if (typeof handle[pathname] === 'function') {
        handle[pathname](request, response);
    } else if(pathname.indexOf('.css') > 0) {
        fs.readFile('web/' + pathname, function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(data);
            response.end();
        });
    } else if(pathname.indexOf('favicon.ico') > 0) {
        fs.readFile('web/favicon.ico', function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'image/x-icon'});
            response.write(data);
            response.end();
        });
    }  else if(pathname.indexOf('.gif') > 0) {
        fs.readFile('web/' + pathname, function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'image/gif'});
            response.write(data);
            response.end();
        });
    } else if(pathname.indexOf('.less') > 0) {
        fs.readFile('web/' + pathname, function (err, data) {
            if (err) throw err;
            response.write(data);
            response.end();
        });
    }  else if(pathname.indexOf('.jpg') > 0) {
        fs.readFile('web/' + pathname, function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'image/jpeg'});
            response.write(data);
            response.end();
        });
    } else if(pathname.indexOf('.png') > 0) {
        fs.readFile('web/' + pathname, function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'image/png'});
            response.write(data);
            response.end();
        });
    } else if(pathname.indexOf('.html') > 0) {
        fs.readFile('web/' + pathname, function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data);
            response.end();
        });
    } else if(pathname.indexOf('.js') > 0) {
        fs.readFile('web/' + pathname, function (err, data) {
            if (err) throw err;
            response.writeHead(200, {'Content-Type': 'text/javascript'});
            response.write(data);
            response.end();
        });
    } else {
        console.log("No request handler found for " + request.url);
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
}

exports.route = route;