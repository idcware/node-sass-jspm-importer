'use strict';

var path = require('path');
var fs = require('fs');
var sass = require('./sass');
var jspm = require('jspm');
var fromFileURL = require('./common').fromFileURL;


module.exports = function(url, prev, done) {
    if(url.substr(0, 5) != 'jspm:')
        return done(); // bailout

    url = url.replace(/^jspm:/, '')+'.scss';

    jspm.normalize(url).then(function(filePath) {
        var stat;
        var parts;
        var origFilePath;

        origFilePath = path.resolve(fromFileURL(filePath).replace(/\.js$/, ''));
        filePath = origFilePath;

        try {
            stat = fs.statSync(filePath);
        } catch (e) {
            try {
                parts = filePath.split(path.sep);
                parts[parts.length - 1] = '_' + parts[parts.length - 1];
                filePath = parts.join(path.sep);
                stat = fs.statSync(filePath);
            } catch (e) {
                // Check if the file exists with a .css extension
                filePath = origFilePath.replace(/\.scss$/, '.css');
                try {
                    stat = fs.statSync(filePath);
                    // The file is there, with the .css extension.
                    // Strip the .css from the filePath to have SASS build this into
                    // the output. If we keep the .css extension here, it leaves it
                    // a plain CSS @import for the browser to resolve.
                    filePath = origFilePath.replace(/\.scss$/, '');
                } catch (e) {
                    return done();
                }
            }
        }
        if(stat.isFile()) {
            done({
                file: filePath
            });
        } else {
            done();
        }
    }, function(e) {
        console.log("Could not resolve path:", url);
        done();
    });
};
