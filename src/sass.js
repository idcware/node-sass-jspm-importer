'use strict';

try {
    module.exports = require('node-sass');
} catch(e) {
    module.exports  = require('gulp-sass').compiler;
}
