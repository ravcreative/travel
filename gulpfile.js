const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const browserSync = require("browser-sync");
const cssbeautify = require("gulp-cssbeautify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");

const server = browserSync.create();

const paths = {
  styles : {
    src: "app/src/styles/scss/**/*.scss",
    dest: "app/dist/css",
  },
  html : {
    src: "app/dist/*.html"
  }
}

function style() {
  return src(paths.styles.src, { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.styles.dest, { sourcemaps: true }))
    .pipe(server.stream());
}

function serve(){
  server.init({
    server: {
      baseDir: "./app/dist"
    }
  })
  
  watch(paths.styles.src, style);
  watch(paths.html.src).on('change', server.reload );
}

exports.serve = serve;
exports.style = style;
exports.default = parallel(
  style,
  serve
);