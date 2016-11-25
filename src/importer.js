'use strict';

var path = require('path');
var fs = require('fs');
var sass = require('./sass');
var jspm = require('jspm');
var fromFileURL = require('./common').fromFileURL;


module.exports = function(url, prev, done) {
    if (url.substr(0, 5) != 'jspm:')
        return done(); // bailout

    url = url.replace(/^jspm:/, '');

    jspm.normalize(url).then(function(filePath) {
        var file = resolveFile(filePath, '.scss');
        if (file) {
            done(file);
        } else {
            file = resolveFile(filePath, '.sass');
            if (file) {
                done(file);
            } else {
                file = resolveFile(filePath, '.css')
                if (file) {
                  done(file);
                } else {
                  done();
                }
            }
        }
    });

    function resolveFile(filePath, extension) {
        var stat;
        var parts;
        var origFilePath;
        var regex;
        var scssRegex = /\.scss$/;
        var sassRegex = /\.sass$/;

        origFilePath = path.resolve(fromFileURL(filePath).replace(/\.js$/, extension));
        filePath = origFilePath;

        try {
            stat = fs.statSync(filePath);
            if (extension === '.css') {
                // The file is there, with the .css extension.
                // Strip the .css from the filePath to have SASS build this into
                // the output. If we keep the .css extension here, it leaves it
                // a plain CSS @import for the browser to resolve.
                filePath = filePath.replace(/\.css$/, '');
            }
        } catch (e) {
            if (extension === '.css') {
              return null;
            } else {
                try {
                    parts = filePath.split(path.sep);
                    parts[parts.length - 1] = '_' + parts[parts.length - 1];
                    filePath = parts.join(path.sep);
                    stat = fs.statSync(filePath);
                } catch (e) {
                    return null;
                }
            }
        }
        if (stat.isFile()) {
            return { file: filePath };
        } else {
            return null;
        }
    }
};
