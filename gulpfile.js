/**
 * Created by Luiz Vid on 04/06/2015.
 */
var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

// Clean output dist directory
gulp.task('clean', del.bind(null, ['dist/*'], {dot: true}));

gulp.task('js-min', function() {
    return gulp.src(['src/*-factory.js', 'src/*-directive.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('jstree-angular.min.js'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('js-pack', function() {
    return gulp.src(['demo/simple/js/vendor/jstree.min.js', 'src/*-factory.js', 'src/*-directive.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('jstree-angular.pack.min.js'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

// Build production files, the default task
gulp.task('default', ['clean', 'js-min', 'js-pack']);