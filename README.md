# sass-jspm-importer
This package provides a [sass importer](https://github.com/sass/node-sass#importer--v200---experimental) function that uses [jspm](https://github.com/jspm/jspm-cli/) to resolve paths.

[![npm](https://nodei.co/npm/sass-jspm-importer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/sass-jspm-importer/)


[![Build Status](https://travis-ci.org/idcware/node-sass-jspm-importer.svg?branch=master&style=flat)](https://travis-ci.org/idcware/node-sass-jspm-importer)
[![npm version](https://badge.fury.io/js/sass-jspm-importer.svg)](http://badge.fury.io/js/sass-jspm-importer)
[![Dependency Status](https://david-dm.org/idcware/node-sass-jspm-importer.svg?theme=shields.io)](https://david-dm.org/idcware/node-sass-jspm-importer)
[![devDependency Status](https://david-dm.org/idcware/node-sass-jspm-importer/dev-status.svg?theme=shields.io)](https://david-dm.org/idcware/node-sass-jspm-importer#info=devDependencies)

## Usage

### Gulp Task
```javascript
var sassJspm = require('sass-jspm-importer');

gulp.task('build-sass', function() {
    return gulp.src('src/sass/*.scss')
        .pipe(sass({
            errLogToConsole: true,
            functions: sassJspm.resolve_function('/lib/'),
            importer: sassJspm.importer
        }))
        .pipe(gulp.dest('dist/css'));
});
```

Where `/lib/` is the path to your `jspm_packages` folder in your document root.

### In Sass
```sass
$fa-font-path: jspm_resolve("font-awesome/fonts/");
@import "jspm:font-awesome/scss/font-awesome";

// do fun stuff with font-awesome !
```
The `jspm:`-prefixed imports will be handled by the custom importer.
