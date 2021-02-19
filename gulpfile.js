const { src, dest, parallel, series, watch, on} = require('gulp');

let preprocessor = 'sass';

const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const sass         = require('gulp-sass');
const less         = require('gulp-less');
const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css');

function browsersync(){
  browserSync.init({
    server: { baseDir: 'dev/'},
    notify: false,
    online: true  
  })
}

function scripts(){
  return src([
    'dev/js/script.js'
  ])
  .pipe(concat('script.min.js')) 
  .pipe(uglify())
  .pipe(dest('dev/js/'))
  .pipe(browserSync.stream())
}

function styles(){
  return src(`dev/${preprocessor}/style.${preprocessor}`)
  .pipe(eval(preprocessor)())
  .pipe(concat('style.min.css')) 
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 10 versions'],
    grid: true
  }))
  .pipe(cleancss(({
    level: {
      1: { specialComments: 0 }
    },
    format: 'beautify'
  })))
  .pipe(dest('dev/css/'))
  .pipe(browserSync.stream())
}

function startWatch(){
  watch(`dev/**/${preprocessor}/**/*`, styles);
  watch(['dev/**/*.js', '!dev/**/*.min.js'], scripts);
  watch('dev/**/*.html').on('change', browserSync.reload);

}

exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;

exports.default = parallel(scripts, styles, browsersync, startWatch);