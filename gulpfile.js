const gulp = require('gulp'),
      plumber = require('gulp-plumber'),
      pug = require('gulp-pug'),
      minifyHTML = require('gulp-htmlmin'),
      sass = require('gulp-sass'),
      cleanCSS = require('gulp-clean-css'),
      imagemin = require('gulp-imagemin'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify'),
      concat = require('gulp-concat'),
      replace = require('gulp-replace'),
      connect = require('gulp-connect');

gulp.task('pug', () => {
  gulp.src('app/*.pug')
    .pipe(replace('{VERSION}', Date.now()))
    .pipe(plumber())
    .pipe(pug({
        pretty: true
    }))
    .on('error', console.log)
    .pipe(minifyHTML({collapseWhitespace: true}))
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
});

gulp.task('sass', () => {
  gulp.src('app/assets/sass/main.sass')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/assets/css'))
    .pipe(connect.reload());
});

gulp.task('images', () => {
  gulp.src('app/assets/images/**/*')
  .pipe(imagemin())
  .pipe(gulp.dest('public/assets/images'));
});

gulp.task('js', () => {
  gulp.src('app/assets/js/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('public/assets/js'))
    .pipe(connect.reload());
});

gulp.task('audio', () => {
  gulp.src('app/assets/audio/*')
    .pipe(gulp.dest('public/assets/audio/'))
});

gulp.task('vendor', () => {
  gulp.src(['node_modules/pixi.js/dist/pixi.min.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('public/assets/js'));
});

gulp.task('watch', () => {
  gulp.watch('app/*.pug', ['pug']);
  gulp.watch('app/assets/sass/*.sass', ['sass']);
  gulp.watch('app/assets/images/**/*', ['images']);
  gulp.watch('app/assets/js/*.js', ['js']);
  gulp.watch('app/assets/audio/*', ['audio']);
});


gulp.task('connect', function() {
  connect.server({
    root: 'public',
    port: 3000,
    livereload: true
  });
});

gulp.task('default', ['connect', 'watch']);

gulp.task('build_public', () => {
  gulp.start('pug', 'sass', 'images', 'js', 'vendor', 'audio');
});