/**
 * Created by Ismaël on 30/12/2016.
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var babelify = require('babelify');
var es2015 = require('babel-preset-es2015');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();
var stringify = require('stringify');
var conf = {
    src: {
        scss: 'sass/app.scss',
        css: 'css/app.css',
        js: 'js/app.js',
        bundle: 'bundle.js'
    },
    dest: {
        css: 'css',
        js: 'js/build'
    },
    watch: {
        scss: 'sass/**/*.scss',
        css: 'css/*.css',
        js: 'js/*.js'
    }
};


// Compile sass files from /scss into /css
gulp.task('sass', function() {
    return gulp.src(conf.src.scss)
        .pipe(sass())
        .pipe(gulp.dest(conf.dest.css))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Start Browsersync
gulp.task('browserSync', function() {
    browserSync.init({
        proxy: 'local.jeanne'
    })
});


// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src(conf.src.css)
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(conf.dest.css))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    browserify(conf.src.js)
        .transform(babelify, {"presets": [es2015], "sourceMaps": true})
        .transform(stringify, {
            appliesTo: { includeExtensions: ['.html'] }
        })
        .add(conf.src.js)
        .bundle()
        .pipe(source(conf.src.bundle))
        .pipe(buffer())
        .pipe(rename({basename:'app' }))
        .pipe(gulp.dest(conf.dest.js))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min'}))
        .pipe(gulp.dest(conf.dest.js))
});


// Run everything
gulp.task('default', ['sass', 'minify-css', 'minify-js']);

// Starting browsersync
gulp.task('dev', ['browserSync','sass', 'minify-css', 'minify-js'], function() {
    gulp.watch(conf.watch.scss, ['sass']);
    gulp.watch(conf.watch.css, ['minify-css']);
    gulp.watch(conf.watch.js, ['minify-js']);
});