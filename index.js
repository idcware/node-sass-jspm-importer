'use strict';

var path = require('path');
var fs = require('fs');
var jspm = require('jspm')
var jspm_config = require('jspm/lib/config');
jspm_config.loadSync();

var sass;
try {
    sass = require('node-sass');
} catch(e) {
    sass = require('gulp-sass').compiler;
}


module.exports.importer = function(url, prev, done) {
    if(url.substr(0, 5) != 'jspm:')
        return done(); // bailout

    url = url.replace(/^jspm:/, '')+'.scss';

    jspm.normalize(url).then(function(path) {
        var stat;
        var parts;
        
        path = path.replace(/file:\/\/(.*?)(\.js)?$/, '$1');
        try {
          stat = fs.statSync(path);
        } catch (e) {
          try {
            parts = path.split('/');
            parts[parts.length - 1] = '_' + parts[parts.length - 1];
            path = parts.join('/');
            stat = fs.statSync(path);
          } catch (e) {
            return done();
          }
        }
        if(stat.isFile()) {
            done({
                file: path
            });
        } else {
            done();
        }
    }, function(e) {
        console.log("Could not resolve path:", url)
        done();
    });
};

module.exports.resolve_function = function(path_prefix) {
    path_prefix = path_prefix || '';
    return {
        'jspm_resolve($exp)': function(exp, done) {
            jspm.normalize(exp.getValue()).then(function(respath) {
                respath = respath.replace(/file:\/\/(.*?)(\.js)?$/, '$1');
                var res = path.join(path_prefix, path.relative(jspm_config.pjson.packages, respath))
                done(new sass.types.String(res));
            }, function(e) {
                done(sass.compiler.types.Null());
            });
        }
    };
};
