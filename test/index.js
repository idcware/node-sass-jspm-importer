'use strict';

var mockery = require('mockery');
var chai = require('chai');
var expect = chai.expect;
var Q = require('q');
var fs = require('fs');

mockery.registerMock('jspm', {
    normalize: function(f) {
        return Q('file://test/'+f+'.js')
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
            fs.writeFileSync('test/fakeSCSSfile.scss', '#id{display:block}');
            fs.writeFileSync('test/_fakeSCSSpartial.scss', '#id{display:inline}');
            fs.writeFileSync('test/fakeCSS.css', '#id{display:flex}');
            fs.writeFileSync('test/fakeSASSfile.sass', '#id\n  display: block');
            fs.writeFileSync('test/_fakeSASSpartial.sass','#id\n  display: inline');
        });
        afterEach(function() {
            fs.unlinkSync('test/fakeSCSSfile.scss');
            fs.unlinkSync('test/_fakeSCSSpartial.scss');
            fs.unlinkSync('test/fakeCSS.css');
            fs.unlinkSync('test/fakeSASSfile.sass');
            fs.unlinkSync('test/_fakeSASSpartial.sass');
        });
        it('should import scss jspm files', function(done) {
            sass.render({
                data: '@import "jspm:fakeSCSSfile";',
                outputStyle: 'compressed',
                importer: sassJspm.importer
            }, function(err, result) {
                if(err) throw err;

                expect(result.css.toString()).to.equal('#id{display:block}\n');
                done();
            });
        });
        it('should import scss partials', function(done) {
            sass.render({
                data: '@import "jspm:fakeSCSSpartial";',
                outputStyle: 'compressed',
                importer: sassJspm.importer
            }, function(err, result) {
                if(err) throw err;

                expect(result.css.toString()).to.equal('#id{display:inline}\n');
                done();
            });
        });
        it('should also accept css files', function(done) {
            sass.render({
                data: '@import "jspm:fakeCSS";',
                outputStyle: 'compressed',
                importer: sassJspm.importer
            }, function(err, result) {
                if(err) throw err;

                expect(result.css.toString()).to.equal('#id{display:flex}\n');
                done();
            });
        });
        it('should import sass jspm files', function(done) {
            sass.render({
                data: '@import "jspm:fakeSASSfile";',
                outputStyle: 'compressed',
                importer: sassJspm.importer
            }, function(err, result) {
                if(err) throw err;

                expect(result.css.toString()).to.equal('#id{display:block}\n');
                done();
            });
        });
        it('should import sass partials', function(done) {
            sass.render({
                data: '@import "jspm:fakeSASSpartial";',
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
