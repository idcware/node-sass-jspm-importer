'use strict';

var mockery = require('mockery');
var chai = require('chai');
var path = require('path');
var expect = chai.expect;
var Q = require('q');
var fs = require('fs');

mockery.registerMock('jspm', {
    normalize: function(f) {
        return Q('file://test/'+f+'.js')
    }
});

mockery.registerMock('jspm/lib/common', {
    fromFileURL: function(path) {
        return path.substr(7);
    }
});

mockery.registerMock('jspm/lib/config', { // internal jspm api ?
    loadSync: function() {},
    pjson: {
        packages: process.cwd()+'/test'
    }
});

var sassJspm;
var sass = require('node-sass');


describe('sass-jspm-importer', function() {
    beforeEach(function() {
        mockery.enable({
            warnOnUnregistered: false,
        });
        sassJspm = require('../src/index');
    });
    afterEach(function() {
        mockery.disable();
    });
    describe('importer', function() {
        beforeEach(function() {
            // cannot just mock fs since it uses libsass..
            fs.writeFileSync('test/fakefile.scss', '#id{display:block}');
            fs.writeFileSync('test/_fakepartial.scss', '#id{display:inline}');
        });
        afterEach(function() {
            fs.unlinkSync('test/fakefile.scss');
            fs.unlinkSync('test/_fakepartial.scss');
        });
        it('should import jspm files', function(done) {
            sass.render({
                data: '@import "jspm:fakefile";',
                outputStyle: 'compressed',
                importer: sassJspm.importer
            }, function(err, result) {
                if(err) throw err;

                expect(result.css.toString()).to.equal('#id{display:block}\n');
                done();
            });
        });
        it('should import partials', function(done) {
            sass.render({
                data: '@import "jspm:fakepartial";',
                outputStyle: 'compressed',
                importer: sassJspm.importer
            }, function(err, result) {
                if(err) throw err;

                expect(result.css.toString()).to.equal('#id{display:inline}\n');
                done();
            });
        });
    });
    describe('resolve function', function() {
        it('should resolve the jspm path', function(done) {
            sass.render({
                data: '#id{content:jspm_resolve("fake/file")}',
                outputStyle: 'compressed',
                functions: sassJspm.resolve_function('/abs/path/prefix/')
            }, function(err, result) {
                if(err) throw err;

                expect(result.css.toString()).to.equal('#id{content:/abs/path/prefix/fake/file}\n');
                done();
            });
        });
    });
});
