import gulp from 'gulp';
import nunjuksRender from "gulp-nunjucks-render";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import browserSync from "browser-sync";
import concat from "gulp-concat";
import cleanCSs from "gulp-clean-css";
import ts from "gulp-typescript";
import sourcemaps from "gulp-sourcemaps";

const sass = gulpSass(dartSass);
var tsProject = ts.createProject({
        declaration: false,
        noImplicitAny: false
});

gulp.task('html', async () => {
        return gulp.src('src/html/pages/*.njk')
            .pipe(nunjuksRender({path: ['./src']}))
            .pipe(gulp.dest("dist"));
});

gulp.task('build-images-dev', () => {
        return gulp.src(['src/assets/images/*.{gif,jpg,png,svg}'])
            .pipe(gulp.dest('dist/assets/images')),
            gulp.src(['src/assets/icons/*.{gif,jpg,png,svg}'])
            .pipe(gulp.dest('dist/assets/icons'));
});

gulp.task('styles', () => {
        return gulp.src('src/scss/**/*.scss')
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(concat('style.min.css'))
            .pipe(cleanCSs({compatibility: "ie8"}))
            .pipe(gulp.dest("dist/styles"));
});

gulp.task('scripts', () => {
        return gulp.src('src/js/*.ts')
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("dist/js"));
});

gulp.task("watch", async function() {
        browserSync.create().init({
                server: {
                        baseDir: "dist"
                }
        })
        gulp.watch('dist/*.html').on("change", browserSync.reload);
        gulp.watch('src/html/**/*.njk', gulp.series("html")) ;
        gulp.watch('src/scss/*.scss', gulp.series("styles")) ;
        gulp.watch('src/assets/**/*.{gif,jpg,png,svg}', gulp.series("build-images-dev"));
});

gulp.task("default", gulp.series("html","build-images-dev", "styles", "scripts", "watch"));
