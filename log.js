/**
 * log.js
 */
(function() {

    var nativeConsole = window.nativeConsole || (window.nativeConsole = window.console);

    function toArray(obj) {
        return Array.prototype.slice.call(obj);
    }

    function extend(obj) {
        var args = toArray(arguments).slice(1),
            length = args.length;
        for (var i = 0; i < length; i++) {
            var source = args[i];
            for (var prop in source) {
                var value = source[prop];
                if (typeof value === 'object') {
                    extend(obj[prop], value);
                } else if (typeof prop !== 'undefined') {
                    obj[prop] = value;
                }
            }
        }
        return obj;
    }

    function random(l) {
        var r, s = '', t;
        r = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        l && (t = Math.ceil(l / 4));
        t || (t = 3);
        while (t > 0) {
            s += r();
            t--;
        }
        return l ? s.substr(0, l) : s;
    };

    function $(selector) {

    }

    function parseCSS(text) {
        var array = text.split(';'),
            count = array.length,
            css = {};
        for (var i = 0; i < count; i++) {
            var str = array[i],
                pair = str.split(':');
            if (str) {
                css[pair[0]] = pair[1];
            }
        }
        return css;
    }

    function toCSS(css) {
        var text = '',
            value;
        for(var key in css) {
            value = css[key];
            if (typeof key !== 'undefined' &&
                (typeof value === 'string' || typeof value === 'number')) {
                text += key + ':' + css[key] + ';';
            }
        }
        return text;
    }

    function css(target, property, value) {
        if (!target) {
            return {};
        }
        var style = target.style;
        if (!style) {
            return {};
        }
        var cssText = style.cssText;
        var css = parseCSS(cssText);
        if (!property && !value) {
            return css;
        } else if (typeof property === 'string' &&
            typeof value === 'undefined') {
            return  css[property];
        } else if (typeof property === 'string' &&
            typeof value !== 'undefined') {
            css[property] = value;
            var text = toCSS(css);
            target.style.cssText = text;
            return css;
        } else if(typeof property === 'object') {
            for (var key in property) {
                css[key] = property[key];
            }
            var text = toCSS(css);
            target.style.cssText = text;
            return css;
        }
    }



    var Log = function() {
        this.init.apply(this, arguments);
    };

    Log.prototype.defaults = {
        'levels': ['log', 'info', 'warn', 'error'],
        'elements': ['container', 'control', 'content', 'status'],
        'cssTag': '/*log-' + random() + '*/',
        'cssPrefix': 'log-' + random() + '-',
        'base': {
            'font-size': '12px',
            'color': '#fff',
        },
        'container': {
            'position': 'fixed',
            'opacity': 0.8,
            'background-color': '#333',
            'top': 0,
            'left': 0,
            'z-index': 999
        },
        'control': {
            'background-color': '#111',
            'height': '18px'
        },
        'content': {

        },
        'status': {
            'background-color': '#111',
            'height': '18px'
        },
        'log': {

        },
        'info': {
            'color': '#00d8ff',
        },
        'warn': {
            'color': '#f7b71e',
        },
        'error': {
            'color': '#ff1800',
        },
        'remote': {
            'tag': random(4),
            'enable': false,
            'url': '127.0.0.1:7777'
        }
    };

    Log.prototype.init = function(options) {
        var that = this;

        window.console = {
                log: function() {
                    that.log.apply(that, arguments);
                },
                info: function() {
                    that.info.apply(that, arguments);
                },
                warn: function() {
                    that.warn.apply(that, arguments);
                },
                error: function() {
                    that.error.apply(that, arguments);
                }
            };

        this.config(options, true);
        this.render();
    };

    Log.prototype.log = function () {
        nativeConsole.log.apply(nativeConsole, arguments);
        arguments = toArray(arguments);
        arguments.unshift(0);
        this.append.apply(this, arguments);
    };

    Log.prototype.info = function () {
        nativeConsole.info.apply(nativeConsole, arguments);
        arguments = toArray(arguments);
        arguments.unshift(1);
        this.append.apply(this, arguments);
    };

    Log.prototype.warn = function () {
        nativeConsole.warn.apply(nativeConsole, arguments);
        arguments = toArray(arguments);
        arguments.unshift(2);
        this.append.apply(this, arguments);
    };

    Log.prototype.error = function () {
        nativeConsole.error.apply(nativeConsole, arguments);
        arguments = toArray(arguments);
        arguments.unshift(3);
        this.append.apply(this, arguments);
    };

    Log.prototype.config = function(options, silent) {
        if (!options) {
            return;
        }
        extend(this.defaults, options);
        if (silent !== true) {
            this.update();
        }
    };

    Log.prototype.render = function() {
        if (this.el) {
            return this.el;
        }
        this.el = document.createElement('div');
        this.control = document.createElement('div');
        this.content = document.createElement('div');
        this.status = document.createElement('div');
        this.addClass(this.el, 'container');
        this.addClass(this.control, 'control');
        this.addClass(this.content, 'content');
        this.addClass(this.status, 'status');
        this.el.appendChild(this.control);
        this.el.appendChild(this.content);
        this.el.appendChild(this.status);
        document.body.appendChild(this.el);
        this.update();
    };

    Log.prototype.update = function() {
        var defaults = this.defaults,
            remote = defaults.remote;
        this.status.innerHTML = remote.tag;
        this.updateStyle();
    };
    
    Log.prototype.append = function() {
        if (!this.el) {
            this.render();
        }
        var defaults = this.defaults,
            remote = defaults.remote,
            levels = defaults.levels,
            level = arguments[0],
            objs = toArray(arguments).slice(1),
            label = document.createElement('div');
        this.addClass(label, levels[level]);
        label.innerHTML = JSON.stringify(objs);
        this.content.appendChild(label);
        if (remote.enable) {
            this.send.apply(this, arguments);
        }
    };

    Log.prototype.clear = function() {
        if (this.el) {
            this.content.innerHTML = '';
        }
    };

    Log.prototype.destory = function() {
        if (this.el) {
            document.body.removeChild(this.el);
        }
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    };

    Log.prototype.updateStyle = function() {
        var defaults = this.defaults,
            head = document.getElementsByTagName("head").item(0),
            styles = document.getElementsByTagName("style"),
            length = styles.length,
            style;
        for (var i = length - 1; i >= 0; i--) {
            var styleText = styles[i].innerHTML;
            if (styleText.indexOf(defaults.cssTag) > -1) {
                style = styles[i];
                break;
            }
        }
        if (!style) {
            style = document.createElement('style');
            style.type = 'text/css';
            head.appendChild(style);
        }
        style.innerHTML = this.toStyle();
    };

    Log.prototype.addClass = function (target, className) {
        if (target && className) {
            className = this.defaults.cssPrefix + className;
            if (target.className.indexOf(className) < 0) {
                target.className += ' ' + className;
            }
        }
    };

    Log.prototype.removeClass = function (target, className) {
        if (target && className) {
            className = this.defaults.cssPrefix + className;
            target.className = target.className.replace(className, '');
        }
    };

    Log.prototype.toStyle = function () {
        var defaults = this.defaults,
            prefix = defaults.cssPrefix,
            levels = defaults.levels,
            elements = defaults.elements,
            text = defaults.cssTag,
            iterator;
        iterator = function(o) {
            var css = extend({}, defaults.base, defaults[o]);
            text += '\n.' + prefix + o + '{' + toCSS(css) + '}';
        };
        levels.forEach(iterator);
        elements.forEach(iterator);
        return text;
    };

    Log.prototype.send = function() {
        var level = arguments[0],
            args = toArray(arguments).slice(1),
            defaults = this.defaults,
            remote = defaults.remote,
            tag = remote.tag,
            url = remote.url,
            data = {tag: tag, level: level, args: args},
            message = JSON.stringify(data);
        if (WebSocket) {
            this.websocket(message);
        } else {
            this.xhr(message);
        }
    };

    Log.prototype.xhr = function(message) {
        var defaults = this.defaults,
            remote = defaults.remote,
            url = remote.url,
            protocol = 'http://',
            request = new XMLHttpRequest();
        if (url.indexOf(protocol) < 0) {
            url = protocol + url;
        }
        if (url.indexOf('?') < 0) {
            url += '?';
        }
        url += '&message=' + message;
        request.open('GET', url, false);
        request.send();
    };

    Log.prototype.websocket = function(message) {
        var that = this,
            defaults = this.defaults,
            remote = defaults.remote,
            url = remote.url,
            protocol = 'ws://';
        if (!this.socket) {
            if (url.indexOf(protocol) < 0) {
                url = protocol + url;
            }
            var onOpen = function() {
                    that.socketReady = true;
                    that.websocket();
                },
                onClose = function() {
                    that.socketReady = false;
                    that.socket = null;
                    that.websocket();
                };
            this.socket = new WebSocket(url, 'log-protocol');
            this.socketReady = false;
            this.socket.addEventListener('open', onOpen);
            this.socket.addEventListener('error', onClose);
            this.socket.addEventListener('close', onClose);
        }
        if (!this.socketReady) {
            if (!this.socketBuffer) {
                this.socketBuffer = [];
            }
            if (message) {
                this.socketBuffer.push(message);
            }
        } else {
            var length = this.socketBuffer.length;
            for (var i = 0; i < length; i++) {
                var buffer = this.socketBuffer[i];
                this.socket.send(buffer);
            }
            this.socketBuffer = [];
            if (message) {
                this.socket.send(message);
            }
        }
    };

    window.Log = Log;
    document.addEventListener('DOMContentLoaded', function(){
        window.log = new Log();
    }, false);
})();