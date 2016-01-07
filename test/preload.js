/**
 * XadillaX created at 2016-01-07 17:02:48 With ♥
 *
 * Copyright (c) 2016 Souche.com, all rights
 * reserved.
 */
"use strict";

var OCS = require("../");

module.exports = OCS.create("127.0.0.1", 11212, "admin", process.env.MEMCACHED_PASS, {
    prefix: "__tmtest__"
});
