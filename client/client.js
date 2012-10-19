var screen = window.screen,
    sWidth = screen.clientWidth,
    sHeight = screen.clientHeight,
    levels = ['log', 'info', 'warn', 'error'],
    href = window.location.href,
    index = href.indexOf('?'),
    tagString = index > 0 ? href.substring(index + 1) : '',
    tags,
    logs = [];

function addLog(tag) {console.log('log:' + tag);
    var url = server + tag,
        socket = new WebSocket('ws://' + url, 'client-protocol'),
        log = new Log({
            'remote': {
                'tag': tag,
                'enable': false
            }
        });

    function onClose() {
        log.info('已与服务器断开连接！');
    }

    function onOpen() {
        log.info('已连接到服务器，等待接收日志');
    }

    function onMessage(event) {
        var data = JSON.parse(event.data),
            level = levels[data.level],
            args = data.args;
        if (tag !== data.tag) {
            args.unshift(data.tag);
        }
        log[level].apply(log, args);
    }

    socket.addEventListener('open', onOpen);
    socket.addEventListener('close', onClose);
    socket.addEventListener('message', onMessage);

    logs.push(log);
}


function onResize(event) {
    var count = logs.length,
        index = count - 1,
        rows = Math.ceil(count / columns),
        tWidth = sWidth / columns,
        tHeight = sHeight / rows,
        rWidth = sWidth,
        log,
        controlHeight, statusHeight, contentHeight,
        containerWidth;
    for (var row = rows; (row > 0) && (index >= 0); row--) {
        rWidth = sWidth;
        for (var column = columns; (column > 0) && (index >= 0); column--) {
            log = logs[index];
            controlHeight = log.controlHeight();
            statusHeight = log.statusHeight();
            contentHeight = tHeight - controlHeight - statusHeight;
            containerWidth = index === 0 ? rWidth : tWidth;
            rWidth -= containerWidth;
            log.config({
                container: {
                    'width': containerWidth + 'px'
                },
                control: {
                    'height': controlHeight + 'px'
                },
                content: {
                    'height': contentHeight + 'px'
                },
                status: {
                    'height': statusHeight + 'px'
                }
            });
            index--;
        }
    }
}



function init() {
    if (tagString.lastIndexOf('/') === (tagString.length - 1)) {
        tagString = tagString.substr(0, tagString.length - 1);
    }
    tags = tagString.split(',');
    tags.forEach(function(tag) {console.log('tag:' + tag);
        addLog(tag);
    });

    window.onresize = onResize;
    onResize();
}
init();