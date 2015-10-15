'use strict';

var path = require('path');
var fromFileURL = require('./common').fromFileURL;
var sass = require('./sass');
var jspm = require('jspm')
var jspm_config = require('jspm/lib/config');
jspm_config.loadSync();


module.exports.resolve_function = function(path_prefix) {
    path_prefix = path_prefix || '';
    return {
        'jspm_resolve($exp)': function(exp, done) {
            jspm.normalize(exp.getValue()).then(function(respath) {
                respath = fromFileURL(respath).replace(/\.js$/, '');
                var res = path.join(path_prefix, path.relative(jspm_config.pjson.packages, respath))
                done(new sass.types.String(res));
            }, function(e) {
                done(sass.compiler.types.Null());
            });
        }
    };
};
