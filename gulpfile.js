//General
const gulp = require('gulp');
const debug = require('gulp-debug');
const data = require('gulp-data');
const options = require('./config'); 

const browsersync = require('browser-sync').create();

const gnf = require('gulp-npm-files');
const rename = require('gulp-rename');
const { series } = require('gulp');
const fs = require('file-system');
var del = require('del');

//PostCSS - CSS
const postcss = require('gulp-postcss');
const util = require('postcss-utilities');
const rucksack = require('rucksack-css');
const pxtorem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postCssImport = require('postcss-import');
const postCssMixins = require('postcss-mixins');
const postCssFor = require('postcss-for');
const postCssSimpleVars = require('postcss-simple-vars');
const postCssMath = require('postcss-math');
const postCssEasing = require('postcss-easing-gradients');
const tailwindcss = require('tailwindcss');
const tailwindcssNesting = require('tailwindcss/nesting');

//Minify and optimization
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const minify = require('gulp-minify');

//Html
const prettyHtml = require('gulp-pretty-html');
const processhtml = require('gulp-processhtml');
const twig = require('gulp-twig');

/*
* BrowserSync
*/

function serve(done) {
    browsersync.init({
        server: {
            baseDir: options.paths.build.base
        },
        port: 3000
    });
    done();
}

/*
* BrowserSync Reload
*/
function reload(done) {
  browsersync.reload();
  done();
}

/*
* Copy dependencies to build/assets/js/vendor
*/
function plugins_init() {
    return gulp.src(gnf(), {base:'./'})
        .pipe(gulp.dest(`${options.paths.src.js}`))
}

exports.plugins_init = plugins_init;

function plugins_rename() {
    return gulp.src(`${options.paths.src.js}/node_modules/**/*`)
        .pipe(gulp.dest(`${options.paths.src.js}/vendor/`));
};

exports.plugins_rename = plugins_rename;

function plugins_delete(){
    return del(`${options.paths.src.js}/node_modules/`, {force:true});
}

exports.plugins_delete = plugins_delete;

function plugins_build(){
    return gulp.src(`${options.paths.src.js}/vendor/**/*`)
        .pipe(gulp.dest(`${options.paths.build.js}/vendor/`));
}

exports.plugins_delete = plugins_delete;

exports.plugins_build = series(plugins_init, plugins_rename, plugins_delete, plugins_build);

/*
* Copy dependencies to dist/assets/js/vendor
*/
function plugins_dist() {
    return gulp.src(`${options.paths.build.js}/vendor/**/*`)
        .pipe(gulp.dest(`${options.paths.dist.js}/vendor/`));
}

exports.plugins_dist = plugins_dist;


/*
* IMG to WEBP
*/
function img_min() {
    return gulp.src(`${options.paths.src.img}/**/*`)
        .pipe(imagemin([
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5})
        ]))
        .pipe(gulp.dest(options.paths.build.img))
}

exports.img_min = img_min;

function img_webp() {
    return gulp.src(`${options.paths.src.img}/**/*`)
        .pipe(webp())
        .pipe(gulp.dest(options.paths.build.img))
}

exports.img_webp = img_webp;

/*
* Move IMG from build to dist
*/
function img_dist() {
    return gulp.src(`${options.paths.build.img}/**/*`)
        .pipe(gulp.dest(options.paths.dist.img))
}

exports.img_dist = img_dist;


/*
* Move font from src to build
*/
function fonts_build() {
    return gulp.src(`${options.paths.src.base}/assets/fonts/**/*.{ttf,eot,woff,woff2}`)
        .pipe(gulp.dest(`${options.paths.build.base}/assets/fonts/`));
}

exports.fonts_build = fonts_build;

/*
* Move font from build to dist
*/
function fonts_dist() {
    return gulp.src(`${options.paths.src.base}/assets/fonts/**/*.{ttf,eot,woff,woff2}`)
        .pipe(gulp.dest(`${options.paths.dist.base}/assets/fonts/`));
}

exports.fonts_dist = fonts_dist;

/*
* JS Build
*/
function js_build() {
    return gulp.src(`${options.paths.src.js}/*.js`)
    .pipe(gulp.dest(options.paths.build.js))
}

exports.js_build = js_build;


/*
* JS Dist
*/
function js_dist() {
    return gulp.src(`${options.paths.src.js}/*.js`)
        .pipe(minify({
            ext:{
                min:'.min.js'
        },
    }))
    .pipe(gulp.dest(options.paths.dist.js));

}

exports.js_dist = js_dist;

function clean_js_dist() {
    return del(`${options.paths.dist.js}/site.js`, {force:true});
}
exports.clean_js_dist = clean_js_dist;

/*
* CSS Build
*/
function css_build() {
    var plugins = [
        postCssImport(),
        postCssMixins(),
        postCssEasing(),
        postCssFor(),
        postCssSimpleVars(),
        postCssMath(),
        tailwindcssNesting(),
        tailwindcss(options.config.tailwindjs),
        util(),
        rucksack(),
        autoprefixer(),
        pxtorem({
            rootValue: 16,
            propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'margin', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'padding'],
            replace: false
        })
    ];
    return gulp.src(`${options.paths.src.css}/style.css`)
        .pipe(postcss(plugins))
        .pipe(gulp.dest(options.paths.build.css)
    );
}

exports.css_build = css_build;

/*
* CSS Dist
*/
function css_dist() {
    var plugins = [
        postCssImport(),
        postCssMixins(),
        postCssEasing(),
        postCssFor(),
        postCssSimpleVars(),
        postCssMath(),
        tailwindcssNesting(),
        tailwindcss(options.config.tailwindjs),
        util(),
        rucksack(),
        autoprefixer(),
        pxtorem({
            rootValue: 16,
            propList: ['font', 'font-size', 'line-height', 'letter-spacing', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'margin', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right', 'padding'],
            replace: false
        }),
        cssnano({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
            }]
        })
    ];
    return gulp.src(`${options.paths.src.css}/style.css`)
        .pipe(postcss(plugins))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(options.paths.dist.css)
    );
}

exports.css_dist = css_dist;

function clean_css_dist() {
    return del(`${options.paths.dist.css}/style.css`, {force:true});
}
exports.clean_css_dist = clean_css_dist;

/*
* Twig compiler
*/

function twig_build(){
    return gulp.src(`${options.paths.src.base}/*.twig`)
    .pipe(data(function () {
        return JSON.parse(fs.readFileSync('./data.json'));
    }))
    .pipe(twig())
    .pipe(prettyHtml())
    .pipe(gulp.dest(options.paths.build.base));
}

exports.twig_build = twig_build;

function twig_dist(){
    return gulp.src(`${options.paths.src.base}/*.twig`)
    .pipe(data(function () {
        return JSON.parse(fs.readFileSync('./data.json'));
    }))
    .pipe(twig())
    .pipe(prettyHtml())
    .pipe(processhtml())
    .pipe(gulp.dest(options.paths.dist.base));
}

exports.twig_dist = twig_dist;

/**
 * Move favicon file
 */
function favicon_move_build(){
    return gulp.src(`${options.paths.src.base}/assets/favicon/*`)
    .pipe(gulp.dest(`${options.paths.build.base}/assets/favicon`));
}

exports.favicon_move_build = favicon_move_build;

function favicon_move_dist(){
    return gulp.src(`${options.paths.src.base}/assets/favicon/*`)
    .pipe(gulp.dest(`${options.paths.dist.base}/assets/favicon`));
}

exports.favicon_move_dist = favicon_move_dist;

/*
* Dev task (watch files + browsersync)
*/

function watchFiles(){
    gulp.watch('./data.json', gulp.series(twig_build, reload));
    gulp.watch(`${options.paths.src.base}/**/*.twig`, gulp.series(twig_build, reload));
    gulp.watch(`${options.paths.src.css}/**/*.css`, gulp.series(css_build, reload));
    gulp.watch(`${options.paths.src.js}/*.js`, gulp.series(js_build, reload));
    gulp.watch(`${options.paths.src.fonts}/**/*`, gulp.series(fonts_build, reload));
    gulp.watch(`${options.paths.src.img}/**/*`, gulp.series(img_min, img_webp, reload));
}

const watch = gulp.parallel(watchFiles);

const dev = gulp.series(serve, watch);
exports.dev = dev;

/*
* Init
*/
exports.init = series(twig_build, css_build, plugins_build, js_build, fonts_build, img_min, img_webp, favicon_move_build);

/*
* Build main task
*/
exports.build = series(twig_build, css_build, plugins_build, js_build, fonts_build, img_min, img_webp, favicon_move_build);

/*
* Dist main task 
*/
exports.dist = series(twig_dist, css_dist, clean_css_dist, plugins_dist, js_dist, clean_js_dist, fonts_dist, img_dist, favicon_move_dist);
