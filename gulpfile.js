(function () {
    'use strict';

    // Libraries to import
    var fs           = require('fs'),
        gulp         = require('gulp'),
        bower        = require('gulp-bower'),
        dependencies = require('main-bower-files'),
        jshint       = require('gulp-jshint'),
        concat       = require('gulp-concat'),
        rimraf       = require('rimraf'),
        uglify       = require('gulp-uglify'),
        jsonminify   = require('gulp-jsonminify'),
        ngAnnotate   = require('gulp-ng-annotate'),
        less         = require('gulp-less'),
        pug          = require('gulp-pug'),
        stylish      = require('jshint-stylish'),
        CleanCSS     = require('less-plugin-clean-css'),
        imagemin     = require('gulp-imagemin'),
        pngquant     = require('imagemin-pngquant'),
        directory    = require('./gulp/directory');

    // Install dependencies
    gulp.task('bower', () => {
        try {
            var stats = fs.statSync('./bower');
            return bower({ cmd : 'install'});
        } catch (e) {
            return bower({ cmd : 'update'});
        }
    });

    // Concat all vendor javascript files, removes the debug informations and
    // reruns the uglify on minimified files
    gulp.task('javascript-vendor', ['dependencies'], () => {
        let files = dependencies({filter : '**/*.js'});
        console.log(files);

        return gulp.src(files)
            .pipe(concat('vendor.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(directory.target.javascript));
    });

    // Concat all application javascript files, removes the debug informations and
    // reruns the uglify on minimified files
    gulp.task('javascript-application', () => {
        var javascript = [
            directory.source.javascript + 'application.js',
            directory.source.javascript + 'application/configuration/**/*',
            directory.source.javascript + 'application/filter/**/*',
            directory.source.javascript + 'application/service/**/*',
            directory.source.javascript + 'application/controller/**/*',
        ];

        return gulp.src(javascript)
            .pipe(concat('application.min.js'))
            .pipe(ngAnnotate({
                single_quotes : true
            }))
            .pipe(uglify())
            .pipe(gulp.dest(directory.target.javascript));
    });

    gulp.task('jshint', ['build'], () => {
        return gulp.src(directory.target.javascript + 'application.min.js')
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
    });

    gulp.task('vendor-fonts', ['dependencies'], () => {
        return gulp.src(dependencies({filter : '**/*.(eot|woff2?|ttf|svg)'}))
            .pipe(gulp.dest(directory.target.assets + 'fonts'));
    });

    gulp.task('stylesheet-vendor', ['dependencies'], () => {
        return gulp.src(dependencies({filter : '**/*.css'}))
            .pipe(concat('vendor.min.css'))
            .pipe(gulp.dest(directory.target.stylesheet));
    });

    gulp.task('stylesheet-application', () => {
        return gulp.src(directory.source.less + 'application.less')
            .pipe(less({
                plugins: [new CleanCSS({advanced: true})]
            }))
            .pipe(gulp.dest(directory.target.stylesheet));
    });

    gulp.task('copy-data', () => {
        var dataFiles = [
            directory.source.javascript + 'application/i18n/*.json',
            directory.source.javascript + 'application/data/*.json',
        ];

        return gulp.src(dataFiles)
            .pipe(jsonminify())
            .pipe(gulp.dest(directory.target.root + 'data'));
    });

    gulp.task('template', () => {
        return gulp.src(directory.source.pug + '**/*.pug')
            .pipe(pug({pretty : true}))
            .pipe(gulp.dest(directory.target.root))
    });

    gulp.task('image', () => {
        return gulp.src(directory.source.image + '*.png')
            .pipe(imagemin({
            	progressive: true,
            	svgoPlugins: [ {removeViewBox: false} ],
            	use: [ pngquant() ]
            }))
            .pipe(gulp.dest(directory.target.image));
    });


    /**
     * Watchers
     */
    gulp.task('watch-template', () => {
        return gulp.watch(directory.source.pug + '**/*.pug', ['template']);
    });

    gulp.task('watch-copy-data', () => {
        var dataFiles = [
            directory.source.javascript + 'application/i18n/*.json',
            directory.source.javascript + 'application/data/*.json',
        ];

        return gulp.watch(dataFiles, ['copy-data']);
    });

    gulp.task('watch-dependencies-bower', () => {
        return gulp.watch('bower.json', ['bower', 'javascript-vendor', 'stylesheet-vendor']);
    });

    gulp.task('watch-javascript', () => {
        return gulp.watch(directory.source.javascript + '**/**/*.js', ['javascript-application']);
    });

    gulp.task('watch-stylesheet', () => {
        return gulp.watch(directory.source.less + '**/*', ['stylesheet-application']);
    });

    gulp.task('watch-image', () => {
        return gulp.watch(directory.source.image + '*.png', ['image']);
    });

    gulp.task('default', ['dependencies', 'build', 'lint']);
    gulp.task('dependencies', ['bower']);
    gulp.task('build', ['javascript', 'stylesheet', 'template', 'copy-data', 'image']);
    gulp.task('javascript', ['javascript-vendor', 'javascript-application']);
    gulp.task('stylesheet', ['stylesheet-vendor', 'stylesheet-application', 'vendor-fonts']);
    gulp.task('lint', ['jshint']);
    gulp.task('watch', ['watch-dependencies-bower', 'watch-javascript', 'watch-stylesheet', 'watch-template', 'watch-copy-data']);
}());
