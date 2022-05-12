var babel = require("gulp-babel");
var uglify = require("gulp-uglify");

var gulp = require("gulp");

const del = require("del");

gulp.task("start:build", function (done) {
  gulp
    .src(["src/**/*.js"])
    .pipe(babel())
    .pipe(
      uglify({
        mangle: true,
        compress: false
      })
    )
    .pipe(gulp.dest("./lib"));
  done();
});

gulp.task("clean:build", function () {
  return del(["./lib/"]);
});

exports.build = gulp.series("clean:build", "start:build");
