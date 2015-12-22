'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var less = require('gulp-less');
var concat = require('gulp-concat');
var lib    = require('bower-files')();
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');

var BROWSER_SYNC_RELOAD_DELAY = 500;


gulp.task('bowerJS', function() {
    gulp.src(lib.ext('js').files)
    .pipe(concat('lib.min.js'))
    .pipe(uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
    .pipe(gulp.dest('./public/js'));
});



gulp.task('bowerCSS', function() {
    gulp.src(lib.ext('css').files)
        .pipe(concat('lib.min.css'))
        .pipe(uglify().on('error', function(e) { console.log('\x07',e.message); return this.end(); }))
        .pipe(gulp.dest('./public/css'));

});


gulp.task('less', function() {
    gulp.src('./public/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('nodemon', function(cb) {
    var called = false;
    return nodemon({
            script: 'app.js',
            watch: ['app.js', 'routes/**.js', 'views/**/*.jade']
        })
        .on('start', function onStart() {

            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {

            setTimeout(function reload() {
                browserSync.reload({
                    stream: false //
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
});


gulp.task('watch', function() {
    gulp.watch('./public/css/*.less', ['less']);
});

gulp.task('browser-sync', ['nodemon', 'bowerJS', 'bowerCSS', 'less', 'watch'], function() {
    browserSync.init({
        files: ['public/js/*.js', 'public/js/vendor/*.js', 'public/css/*.css', 'views/**/*.jade'],
        proxy: 'http://localhost:3000',
        port: 7070,
        browser: ['google-chrome']
    });
});

gulp.task('default', ['browser-sync']);
