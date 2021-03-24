const { src, dest, watch, series, parallel } = require('gulp');
const fileinclude = require('gulp-file-include');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const pathExists = require('path-exists');
const { PATHS, SOURCE_MAP_PATH, DEST_PATH } = require('./paths');

// Swallow error
function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Clean dist
function cleanDist() {
    return src(DEST_PATH)
        .pipe($.clean());
}

// Clear cache
function clearCache(done) {
    return $.cache.clearAll(done);
}

function reload(done) {
    browserSync.reload();
    done();
}

function server(done) {
    browserSync.init({
      server: {
        baseDir: DEST_PATH
      },
    });
    done();
}

// Task functions
function css() {
    return src(PATHS.css.origin)
        .pipe(dest(PATHS.css.dist));
}

function html() {
    return src(PATHS.html.origin)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .on('error', swallowError)
        .pipe(dest(PATHS.html.dist));
}

function image() {
    return src(PATHS.images.origin)
        .pipe($.cache($.imagemin([
            $.imagemin.mozjpeg({ quality: 75, progressive: true }),
            $.imagemin.optipng({ optimizationLevel: 5 }),
            $.imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ])))
        .on('error', swallowError)
        .pipe(dest(PATHS.images.dist));
}

// Watch files
function watchFiles() {
    watch(PATHS.css.origin, series(css, reload));
    watch(PATHS.images.origin, series(image, reload));
    watch(PATHS.html.origin, series(html, reload));
}

// Define complex tasks
const clean = series(cleanDist);
const develop = parallel(css, image, html);
const build = () => {
    return pathExists.sync(DEST_PATH) ? series(clean, develop) : develop;
}

// Export tasks
module.exports = {
    clean,
    cache: series(clearCache),
    watch: series(watchFiles),
    dev: series(develop, server, watchFiles),
    default: develop,
    build: series(clearCache, build())
}