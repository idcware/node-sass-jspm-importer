'use strict';

var path = require('path');
var fs = require('fs');
var sass = require('./sass');
var jspm = require('jspm')


module.exports = function(url, prev, done) {
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

