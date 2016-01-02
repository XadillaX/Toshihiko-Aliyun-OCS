/**
 * XadillaX created at 2016-01-02 14:58:40 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var util = require("util");

var bling = require("bling-hashes");
var EventEmitter = require("eventemitter2").EventEmitter2;
var memjs = require("memjs");
var helper = require("./helper");

var OCS = function(servers, options) {
    EventEmitter.call(this);

    this.servers = servers;
    this.options = options;
    this.prefix = (options && options.prefix) ? options.prefix : "";
    this.hashFunc = (options && options.hash) ? options.hash : null;
    
    if(options) {
        delete options.prefix;
    }

    if(options) {
        delete options.hash;
    }

    if(util.isArray(servers)) {
        servers = servers.join(",");
    }

    this.ocs = memjs.Client.create(servers, options);

    // hash...
    if(typeof this.hashFunc === "function") {
        helper.injectHashFunc(this.ocs, this.hashFunc);
    } else if(typeof this.hashFunc === "string") {
        switch(this.hashFunc) {
            case "bkdr":
            case "ap":
            case "djb":
            case "js":
            case "rs":
            case "sdbm":
            case "pjw":
            case "elf":
            case "city32":
            case "city64": {
                helper.injectHashFunc(this.ocs, function(key) {
                    return bling[this.hashFunc];
                });
                break;
            }

            default: {
                console.error("TOSHIHIKO-ALIYUN-OCS WARING: NO SUCH HASH FUNCTION [" + this.hashFunc + "].");
                break;
            }
        }
    }
};

util.inherits(OCS, EventEmitter);

module.exports = OCS;
