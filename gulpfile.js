'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    rek = require('rekuire'),
    reload = browserSync.reload;

//  for 'data' task
var TrendetsDb = rek('db');
require('date-utils');
var startDefault = rek('start-default');
var q = require('q');

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/web/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/web/js/main.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/web/style/main.scss',
        img: 'src/web/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/web/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/web/**/*.html',
        js: 'src/web/js/**/*.js',
        style: 'src/web/style/**/*.scss',
        img: 'src/web/img/**/*.*',
        fonts: 'src/web/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Trendets"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true})); //Выплюнем их в папку build
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()) //Прогоним через rigger
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})) //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);

gulp.task('downloadData', function(cb){
    return startDefault.downloadData();
});

gulp.task('uploadData', function(cb){
    return startDefault.uploadData()
    .then(function (events){
        if (events instanceof Array) {
        for (var i = 0; i < events.length; i++) {
            console.log(events[i]['description']);
        }
        return events;
        }   
    });
    // return startDefault.uploadData();
});

gulp.task('removeData', function(cb){
    return startDefault.removeData();
});


// gulp.task('data', ['update-database'], function () {
//     var db = new TrendetsDb(),
//         startPromise = db.exists() ? 'ok' : db.create();
//     //db.delete();
//     return q(startPromise).then(db.connect)
//                           .then(function () {
//                               return db.Events.all();
//                           })
//                           .then(function (events) {
//                               var lastEvent = events.sort(function (a, b) { return b.date - a.date })[0];
//                               return lastEvent;
//                           })
//                           .then(function (lastEvent) {
//                               var from = lastEvent ? lastEvent.date.addDays(1).clearTime() : new Date(2014, 0, 1),
//                                   to = Date.today();
//                               if (from < to) {
//                                   console.log('Requesting events from', from, 'to', to);
//                                   return quotesRetriever.getQuotes(from, to)
//                               } else {
//                                   console.log('Quotes are up to date');
//                                   return []
//                               }
//                           })
//                           .then(function (newQuotes) {
//                               var promises = [];
//                               if (newQuotes.length > 0)
//                                   console.log(newQuotes.length + ' Quotes received.');
//                               for (var i = 0; i < newQuotes.length; i++) {
//                                   promises.push(db.Quotes.create(newQuotes[i]));
//                               }
//                               return q.all(promises).then(function () {
//                                   console.log(newQuotes.length + ' Quotes inserted into db.');
//                               }, console.error);
//                           })
//                           .then(function () {
//                               console.log('Generating data file.');
//                               return dataGenerator.generate('./web/js/data.js', true);
//                           }, console.error);
// });