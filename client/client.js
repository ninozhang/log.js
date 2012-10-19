function append(text) {
    var $log = $('<div>').html(text);
    $('#main').append($log);
}

function clear() {
    $('#main').children().remove();
}

function close() {
    if (socket) {
        socket.close();
        socket = null;
    }
}

var socket = new WebSocket('ws://' + url, 'client-protocol');

socket.addEventListener('open', function(event) {
    append('已连接到服务器，等待接收日志');
});

socket.addEventListener('close', function(event) {
    append('已与服务器断开连接！');
});

socket.addEventListener('message', function(event) {
    var data = JSON.parse(event.data),
        tag = data.tag,
        level = data.level,
        args = data.args,
        message = '';
    message += 'tag:' + tag;
    message += 'level:' + level;
    append(message);
});