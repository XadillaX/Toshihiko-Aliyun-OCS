/**
 * XadillaX created at 2016-01-04 14:56:07 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var OCS = module.exports = require("./lib/ocs");

/**
 * create
 * @param {String|Array} servers the servers addresses
 * @param {Object} options the ocs options
 * @return {OCS} the OCS wrapper
 */
module.exports.create = function(host, port, username, password, options) {
    return new OCS(host, port, username, password, options);
};
