/**
 * XadillaX created at 2016-01-02 15:29:42 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

/**
 * injectHashFunc
 * @param {Memjs} ocs the Memjs object
 * @param {Function} func the customized hash code function
 */
exports.injectHashFunc = function(ocs, func) {
    ocs.server = (function(key) {
        var origIdx = func(key) % this.servers.length;
        var idx = origIdx;
        var serv = this.servers[idx];
        while(serv.wakeupAt && serv.wakeupAt > Date.now()) {
            idx = (idx + 1) % this.servers.length;
            if(idx === origIdx) return null;
            serv = this.servers[idx];
        }
        return serv;
    }).bind(ocs);
};
