# Toshihiko Aliyun OCS (Cache Layout)

[![travis.ci](https://img.shields.io/travis/XadillaX/Toshihiko-Aliyun-OCS.svg)](https://travis-ci.org/XadillaX/Toshihiko-Aliyun-OCS)
[![coveralls](https://img.shields.io/coveralls/XadillaX/Toshihiko-Aliyun-OCS.svg)](https://coveralls.io/r/XadillaX/Toshihiko-Aliyun-OCS)
[![License](https://img.shields.io/npm/l/toshihiko-aliyun-ocs.svg?style=flat)](https://www.npmjs.org/package/toshihiko-aliyun-ocs)
[![Dependency Status](https://david-dm.org/XadillaX/Toshihiko-Aliyun-OCS.svg)](https://david-dm.org/XadillaX/Toshihiko-Aliyun-OCS)
[![Toshihiko-Memcached](http://img.shields.io/npm/v/toshihiko-aliyun-ocs.svg)](https://www.npmjs.org/package/toshihiko-aliyun-ocs)
[![Toshihiko-Memcached](http://img.shields.io/npm/dm/toshihiko-aliyun-ocs.svg)](https://www.npmjs.org/package/toshihiko-aliyun-ocs)

The Aliyun OCS support for Toshihiko as an addon.

## Installation

```sh
$ npm install toshihiko-aliyun-ocs --save
```

## How to Use

When you define a Toshihiko, you could pass the object into `cache` option:

```javascript
var T = require("toshihiko");
var toshihiko = new T.Toshihiko("database", "username", "", {
    cache: {
        name: "aliyun-ocs",
        host: "ALIYUN_OCS_HOST",
        port: 11211,
        username: "ALIYUN_OCS_USERNAME",
        password: "ALIYUN_OCS_PASSWORD",
        options: { prefix: "_" }
    }
});
```

> `name` must be `aliyun-ocs` and then Toshihiko will search for the package `toshihiko-aliyun-ocs`.
>
> You can give a `prefix` in `options`.

Otherwise, you may create this object by yourself and pass the created object into cached:

```javascript
var OCS = require("toshihiko-aliyun-ocs");
var object = Memcached.create(HOST, PORT, USERNAME, PASSWORD, OPTIONS);
var toshihiko = new T.Toshihiko(DATABASE, USERNAME, PASSWORD, {
    cache: object
});
```

or

```javascript
var Memcached = require("toshihiko-aliyun-ocs");
var object = new Memcached(HOST, PORT, USERNAME, PASSWORD, OPTIONS);
var toshihiko = new T.Toshihiko(DATABASE, USERNAME, PASSWORD, {
    cache: object
});
```

And then you may enjoy the cache layer of Toshihiko!

## Contribution

You're welcome to make pull requests or issues!

「雖然我覺得不怎麼可能有人會關注我」
