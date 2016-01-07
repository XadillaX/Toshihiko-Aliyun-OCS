/**
 * XadillaX created at 2016-01-02 14:58:40 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var _ = require("lodash");
var debug = require("debug")("OCS");
var EventEmitter = require("eventemitter2").EventEmitter2;
var Memcached = require("node_memcached");
var Scarlet = require("scarlet-task");

var OCS = function(host, port, username, password, options) {
    EventEmitter.call(this);

    this.host = host;
    this.port = port;
    this.username = username;
    this.password = password;
    this.options = options;
    this.prefix = (options && options.prefix) ? options.prefix : "";
    this.onError = (options && options.onError) ? options.onError : function() {};
    
    if(options) {
        delete options.prefix;
    }

    debug(_.merge({
        username: username,
        password: password 
    }, options));

    this.ocs = Memcached.createClient(port, host, _.merge({
        username: username,
        password: password 
    }, options));

    var self = this;
    this.on("error", this.onError);
    this.ocs.on("error", function(err) {
        self.emit("error", err);
    });
};

util.inherits(OCS, EventEmitter);

OCS.prototype._getKey = function(dbName, tableName, key) {
    if(typeof key !== "object") {
        return this.prefix + dbName + ":" + tableName + ":" + key;
    }

    var keys = _.keys(key);
    if(!keys.length) {
        return this.prefix + dbName + ":" + tableName;
    } else if(keys.length === 1) {
        return this.prefix + dbName + ":" + tableName + ":" + key[keys[0]];
    }

    // get a minlen for keys...
    var minlen = 1;
    for(var i = 0; i < keys.length; i++) {
        for(var j = i + 1; j < keys.length; j++) {
            var ml = Math.min(keys[i].length, keys[j].length);
            for(var k = 0; k < ml; k++) {
                if(keys[i][k] !== keys[j][k]) {
                    if(k > minlen) {
                        minlen = k + 1;
                    }
                    break;
                }
            }

            if(k === ml && k > minlen) minlen = k + 1;
        }
    }

    // sort keys...
    keys.sort();

    // cut each key to minlen...
    var base = this.prefix + dbName + ":" + tableName;
    for(var i = 0; i < keys.length; i++) {
        base += ":";
        base += keys[i].substr(0, minlen);
        base += key[keys[i]];
    }

    return base;
};

OCS.prototype._getKeys = function(dbName, tableName, keys) {
    var self = this;
    return keys.map(function(key) {
        return self._getKey(dbName, tableName, key);
    });
};

OCS.prototype.deleteData = function(dbName, tableName, key, callback) {
    var key = this._getKey(dbName, tableName, key);
    this.ocs.delete(key, function(err, data) {
        callback(err, data);
    });
};

OCS.prototype.deleteKeys = function(dbName, tableName, keys, callback) {
    if(!keys.length) return process.nextTick(callback);

    var self = this;
    var scarlet = new Scarlet(10);

    var err;
    var del = function(to) {
        var key = to.task;
        self.deleteData(dbName, tableName, key, function(_err) {
            if(_err && _err !== "Key not found") {
                if(_err instanceof Error) err = _err;
                else err = new Error(_err);
            }

            scarlet.taskDone(to);
        });
    };

    for(var i = 0; i < keys.length; i++) {
        scarlet.push(keys[i], del);
    }

    scarlet.afterFinish(keys.length, function() {
        callback(err);
    }, false);
};

OCS.prototype.setData = function(dbName, tableName, key, data, callback) {
    key = this._getKey(dbName, tableName, key);
    this.ocs.set(key, data, function(err, data) {
        callback(err, data);
    });
};

OCS.prototype.getData = function(dbName, tableName, keys, callback, stayKeys) {
    var self = this;
    if(!util.isArray(keys)) {
        keys = [ keys ];
    }

    if(!stayKeys) {
        keys = this._getKeys(dbName, tableName, keys);
    }

    if(!keys.length) return callback(undefined, []);
    if(1 === keys.length) {
        return this.ocs.get(keys[0], function(err, data) {
            if(err) return callback(err);
            if(undefined === data) return callback(undefined, []);
            
            return callback(undefined, [ data ]);
        });
    }

    var result = [];

    var scarlet = new Scarlet(10);
    var fetcher = function(taskObject) {
        var idx = taskObject.task;
        var key = keys[idx];
        self.getData(dbName, tableName, [ key ], function(err, data) {
            if(err && err !== "Key not found") return scarlet.taskDone(taskObject);
            if(!data || !data.length) return scarlet.taskDone(taskObject);
            result[idx] = data[0];
            scarlet.taskDone(taskObject);
        }, true);
    };

    for(var i = 0; i < keys.length; i++) result.push(null);
    for(var i = 0; i < keys.length; i++) {
        scarlet.push(i, fetcher);
    }

    scarlet.afterFinish(keys.length, function() {
        result = _.compact(result);
        callback(undefined, result);
    }, false);
};

module.exports = OCS;
