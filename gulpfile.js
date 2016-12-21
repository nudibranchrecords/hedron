'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

gulp.task('sass', function () {
 
  return gulp.src('src/sass/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'));

});

gulp.task('watch', function () {
    var beepOnError = function (done) {
        return function (err) {
            if (err) {
                process.stdout.write('\u0007');
            }
            done(err);
        };
    };

    watch('src/sass/**/*.scss', batch(function (events, done) {
        gulp.start('sass', beepOnError(done));
    }));
});