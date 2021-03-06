"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var purescript = require("gulp-purescript");
var jsvalidate = require("gulp-jsvalidate");
var run = require("gulp-run");

var paths = [
  "src/**/*.purs",
  "bower_components/purescript-*/src/**/*.purs",
  "test/**/*.purs"
];

gulp.task("make", function() {
  return gulp.src(paths)
    .pipe(plumber())
    .pipe(purescript.pscMake());
});

gulp.task("jsvalidate", ["make"], function () {
  return gulp.src("output/**/*.js")
    .pipe(plumber())
    .pipe(jsvalidate());
});

var docTasks = [];

var docTask = function(name) {
  var taskName = "docs-" + name.toLowerCase();
  gulp.task(taskName, function () {
    return gulp.src("src/" + name.replace(/\./g, "/") + ".purs")
      .pipe(plumber())
      .pipe(purescript.pscDocs())
      .pipe(gulp.dest("docs/" + name + ".md"));
  });
  docTasks.push(taskName);
};

["Data.URI", "Data.URI.Authority", "Data.URI.Common", "Data.URI.Host",
 "Data.URI.Path", "Data.URI.Query", "Data.URI.Scheme", "Data.URI.Types",
 "Data.URI.UserInfo"].forEach(docTask);

gulp.task("docs", docTasks);

gulp.task("test", function() {
  return gulp.src(paths)
    .pipe(plumber())
    .pipe(purescript.psc({ main: "Test.Main" }))
    .pipe(run("node"));
});

gulp.task("default", ["jsvalidate", "docs", "test"]);
