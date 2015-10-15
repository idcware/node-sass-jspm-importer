'use strict';

var path = require('path');
var fs = require('fs');
var sass = require('./sass');
var jspm = require('jspm');
var jspm_common = require('jspm/lib/common');


module.exports = function(url, prev, done) {
    if(url.substr(0, 5) != 'jspm:')
        return done(); // bailout

    url = url.replace(/^jspm:/, '')+'.scss';

    jspm.normalize(url).then(function(filePath) {
        var stat;
        var parts;

        filePath = path.resolve(jspm_common.fromFileURL(filePath).replace(/\.js$/, ''));
        try {
            stat = fs.statSync(filePath);
        } catch (e) {
            try {
                parts = filePath.split(path.sep);
                parts[parts.length - 1] = '_' + parts[parts.length - 1];
                filePath = parts.join(path.sep);
                stat = fs.statSync(filePath);
            } catch (e) {
                return done();
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

