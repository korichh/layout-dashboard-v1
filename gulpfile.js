import gulp from "gulp"
import browserSync from "browser-sync"
import del from "del"
import nodePath from "path"
import ejs from "gulp-ejs"
import rename from "gulp-rename"
import autoprefixer from "gulp-autoprefixer"
import gulpSass from "gulp-sass"
import * as dartSass from "sass"
import gulpZip from "gulp-zip"
import beautify from "gulp-beautify"
import htmlmin from "gulp-htmlmin"
import cleanCSS from "gulp-clean-css"
import uglify from "gulp-uglify"

browserSync.create()
const sass = gulpSass(dartSass)
const srcFolder = './src'
const buildFolder = './docs'
const path = {
    src: {
        html: `${srcFolder}/html/*.ejs`,
        css: `${srcFolder}/scss/**/*.{css,scss}`,
        js: `${srcFolder}/js/**/*.js`,
        img: `${srcFolder}/img/**/*.{jpg,jpeg,png,svg,webp}`,
        resources: `${srcFolder}/resources/**/*`,
    },
    build: {
        html: `${buildFolder}/`,
        css: `${buildFolder}/css/`,
        js: `${buildFolder}/js/`,
        img: `${buildFolder}/img/`,
        resources: `${buildFolder}/`,
    },
    watch: {
        html: `${srcFolder}/html/**/*`,
        css: `${srcFolder}/scss/**/*`,
        js: `${srcFolder}/js/**/*`,
        img: `${srcFolder}/img/**/*`,
        resources: `${srcFolder}/resources/**/*`,
    }
}

const clean = () => {
    return del(buildFolder)
}

const html = () => {
    return gulp.src(path.src.html)
        .pipe(ejs())
        .pipe(rename({ extname: '.html' }))
        .pipe(beautify.html())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream())
}

const htmlMin = () => {
    return gulp.src(path.src.html)
        .pipe(ejs())
        .pipe(rename({ extname: '.html' }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream())
}

const css = () => {
    return gulp.src(path.src.css)
        .pipe(sass())
        .pipe(autoprefixer({ cascade: false, grid: true, overrideBrowserslist: ["last 5 versions"] }))
        .pipe(beautify.css())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())
}

const cssMin = () => {
    return gulp.src(path.src.css)
        .pipe(sass())
        .pipe(autoprefixer({ cascade: false, grid: true, overrideBrowserslist: ["last 5 versions"] }))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())
}

const js = () => {
    return gulp.src(path.src.js)
        .pipe(beautify.js())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream())
}

const jsMin = () => {
    return gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream())
}

const img = () => {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream())
}

const resources = () => {
    return gulp.src(path.src.resources)
        .pipe(gulp.dest(path.build.resources))
        .pipe(browserSync.stream())
}

const watcher = () => {
    browserSync.init({
        server: { baseDir: `${buildFolder}` },
        notify: false
    })

    gulp.watch(path.watch.html, html)
    gulp.watch(path.watch.css, css)
    gulp.watch(path.watch.js, js)
    gulp.watch(path.watch.img, img)
    gulp.watch(path.watch.resources, resources)
}

const zip = () => {
    del.sync(`${buildFolder}/*.zip`)
    return gulp.src(`${buildFolder}/**/*`, {})
        .pipe(gulpZip(`${nodePath.basename(nodePath.resolve())}.zip`))
        .pipe(gulp.dest(buildFolder))
}

gulp.task('build', gulp.series(clean, html, css, js, img, resources))
gulp.task('prod', gulp.series(clean, htmlMin, cssMin, jsMin, img, resources))
gulp.task('dev', gulp.series(clean, html, css, js, img, resources, watcher))
gulp.task('zip', zip)