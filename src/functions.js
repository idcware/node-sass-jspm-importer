'use strict';

var path = require('path');
var fromFileURL = require('./common').fromFileURL;
var sass = require('./sass');
var jspm = require('jspm');
var jspm_config = require('jspm/lib/config');
jspm_config.loadSync();


module.exports.resolve_function = function(path_prefix) {
    path_prefix = path_prefix || '';
    return {
        'jspm_resolve($exp)': function(exp, done) {
            jspm.normalize(exp.getValue()).then(function(respath) {
                respath = path.resolve(fromFileURL(respath).replace(/\.js$|\.ts$/, ''));
                var res = path.join(path_prefix, path.relative(jspm_config.pjson.packages, respath));
                // strip any default files that 0.17 includes, we only want
                // up to the package name
                if (res.indexOf("@") > -1) {
                    res = res.match(/.+@[^\/]+/)[0];
                }
                done(new sass.types.String(res));
            }, function(e) {
                done(sass.compiler.types.Null());
            });
        }
    };
};
