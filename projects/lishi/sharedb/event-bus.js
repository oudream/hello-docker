(function(root, factory) {
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define("EventBus", [], factory);
    }
    else if (typeof exports === 'object') {
        exports["EventBus"] = factory();
    }
    else {
        root["EventBus"] = factory();
    }
})(this, function() {

    let EventBusClass = function() {
        this.listeners = {};
    };

    EventBusClass.prototype = {
        addEventListener: function(type, callback, scope) {
            let args = [];
            let numOfArgs = arguments.length;
            for (let i = 0; i < numOfArgs; i++) {
                args.push(arguments[i]);
            }
            args = args.length > 3 ? args.splice(3, args.length - 1) : [];
            if (typeof this.listeners[type] != "undefined") {
                this.listeners[type].push({scope: scope, callback: callback, args: args});
            }
            else {
                this.listeners[type] = [{scope: scope, callback: callback, args: args}];
            }
        },

        removeEventListener: function(type, callback, scope) {
            if (typeof this.listeners[type] != "undefined") {
                let numOfCallbacks = this.listeners[type].length;
                let newArray = [];
                for (let i = 0; i < numOfCallbacks; i++) {
                    let listener = this.listeners[type][i];
                    if (listener.scope == scope && listener.callback == callback) {

                    }
                    else {
                        newArray.push(listener);
                    }
                }
                this.listeners[type] = newArray;
            }
        },

        hasEventListener: function(type, callback, scope) {
            if (typeof this.listeners[type] != "undefined") {
                let numOfCallbacks = this.listeners[type].length;
                if (callback === undefined && scope === undefined) {
                    return numOfCallbacks > 0;
                }
                for (let i = 0; i < numOfCallbacks; i++) {
                    let listener = this.listeners[type][i];
                    if ((scope ? listener.scope == scope : true) && listener.callback == callback) {
                        return true;
                    }
                }
            }
            return false;
        },

        dispatch: function(type, target) {
            if (typeof this.listeners[type] === "undefined") {
                return;
            }
            let event = {
                type: type,
                target: target
            };
            let args = [];
            let numOfArgs = arguments.length;
            for (let i = 0; i < numOfArgs; i++) {
                args.push(arguments[i]);
            }
            args = args.length > 2 ? args.splice(2, args.length - 1) : [];
            args = [event].concat(args);
            let listeners = this.listeners[type].slice();
            let numOfCallbacks = listeners.length;
            for (let i = 0; i < numOfCallbacks; i++) {
                let listener = listeners[i];
                if (listener && listener.callback) {
                    let concatArgs = args.concat(listener.args);
                    listener.callback.apply(listener.scope, concatArgs);
                }
            }
        },

        getEvents: function() {
            let str = "";
            for (let type in this.listeners) {
                let numOfCallbacks = this.listeners[type].length;
                for (let i = 0; i < numOfCallbacks; i++) {
                    let listener = this.listeners[type][i];
                    str += listener.scope && listener.scope.className ? listener.scope.className : "anonymous";
                    str += " listen for '" + type + "'\n";
                }
            }
            return str;
        }
    };

    let EventBus = new EventBusClass();
    return EventBus;
});
