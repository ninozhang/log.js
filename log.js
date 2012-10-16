/**
 * log.js
 */
(function() {

    var nativeConsole = window.nativeConsole || window.console;
    window.nativeConsole = nativeConsole;

    function toArray(obj) {
        return Array.prototype.slice.call(obj);
    }

    function $() {

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

    function stringifyCSS(css) {
        var text = '';
        for(var key in css) {
            text += key + ':' + css[key] + ';';
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
            var text = stringifyCSS(css);
            target.style.cssText = text;
            return css;
        } else if(typeof property === 'object') {
            for (var key in property) {
                css[key] = property[key];
            }
            var text = stringifyCSS(css);
            target.style.cssText = text;
            return css;
        }
    }

    function log() {
        nativeConsole.log.apply(nativeConsole, arguments);
        arguments = toArray(arguments);
        arguments.unshift(2);
        this.append.apply(this, arguments);
    }

    function info() {
        nativeConsole.info.apply(nativeConsole, arguments);
        arguments = toArray(arguments);
        arguments.unshift(2);
        this.append.apply(this, arguments);
    }

    function warn() {
        nativeConsole.warn.apply(nativeConsole, arguments);
        arguments = toArray(arguments);
        arguments.unshift(2);
        this.append.apply(this, arguments);
    }



    var Log = function() {
        this.init.apply(this, arguments);
    };

    Log.prototype.defaults = {

    };

    Log.prototype.init = function(options) {
        this.config(options);

        var that = this;
        window.console = {
                log: function() {
                    log.apply(that, arguments);
                },
                info: function() {
                    info.apply(that, arguments);
                },
                warn: function() {
                    warn.apply(that, arguments);
                }
            };
    };

    Log.prototype.config = function(options) {

    };

    Log.prototype.render = function() {
        if (this.el) {
            return this.el;
        }
        this.el = document.createElement('div');
        css(this.el, {
            'position': 'fixed',
            'opacity': 0.8,
            'color': '#fff',
            'background-color': '#333'
        });
        document.body.appendChild(this.el);
    };
    
    Log.prototype.append = function() {
        if (!this.el) {
            this.render();
        }
        var level = arguments[0],
            objs = toArray(arguments).slice(1),
            label = document.createElement('div');
        label.innerHTML = level + ':' + JSON.stringify(objs);
        this.el.appendChild(label);
    };

    Log.prototype.clear = function() {
        if (this.el) {
            this.el.innerHTML = '';
        }
    };

    Log.prototype.destory = function() {
        if (this.el) {
            document.body.removeChild(this.el);
        }
    };

    window.Log = Log;
})();