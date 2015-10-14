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
    jspm.normalize(url).then(function(normalizedPath) {
        var stat;
        var parts;

        normalizedPath = normalizedPath.replace(/file:\/\/(.*?)(\.js)?$/, '$1');
        try {
            stat = fs.statSync(normalizedPath);
        } catch (e) {
            try {
                parts = normalizedPath.split('/');
                parts[parts.length - 1] = '_' + parts[parts.length - 1];
                normalizedPath = parts.join('/');
                stat = fs.statSync(normalizedPath);
            } catch (e) {
                return done();
            }
        }
        if(stat.isFile()) {
            done({
                file: normalizedPath
            });
        } else {
            done();
        }
    }, function(e) {
        console.log("Could not resolve path:", url)
        done();
    });
};

