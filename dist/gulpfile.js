var gulp = require('gulp'),
    uglify = require('gulp-uglify'), //压缩JS
    babel = require('gulp-babel'), //es6转es5
    cleanCss = require('gulp-clean-css'),//- 压缩CSS为一行；
    rename = require('gulp-rename'),//重命名
    stylus = require('gulp-stylus'), //CSS预编译
    styl = require('gulp-stylus'), //stylus预编译
    autoprefixer = require('gulp-autoprefixer'), //自动加兼容
    less = require('gulp-less'), //less预编译
    sourcemaps = require('gulp-sourcemaps'); //less找到引入的文件

gulp.task('default', ['textJS', 'textCSS', 'textSTYL','testLESS']); //定义默认任务


gulp.task('textJS', function () { //JS处理
    gulp.src('statics/js/**/*.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dists/js/'))
});

gulp.task('textCSS', function () { //CSS处理
    gulp.src('statics/css/**/*.css')
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dists/css/'))
});

gulp.task('textSTYL', function () { //Styl处理
    gulp.src('statics/css/**/*.styl')
        .pipe(styl())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
        }))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dists/css/'))
});

gulp.task('testLESS', function () {//LESS处理
    gulp.src('statics/css/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dists/css/'))
});


gulp.task('auto', function () {
    gulp.watch('statics/css/**/*.styl', ['textSTYL']); //监听文件修改，当文件修改则执行styl任务
    gulp.watch('statics/css/**/*.css', ['textCSS']);
    gulp.watch('statics/css/**/.less', ['testLESS']);
    gulp.watch('statics/js/*.js', ['textJS']);
})