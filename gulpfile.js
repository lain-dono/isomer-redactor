var browserify = require('browserify');

var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    source = require('vinyl-source-stream'),
    watch = require('gulp-watch');

gulp.task('js', function() {
  var bundleStream = browserify('./src/main.js').bundle();

  bundleStream
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', ['js'], function() {
  gulp.watch('src/**', ['js'])
});

gulp.task('server', function(next) {
  var connect = require('connect'),
      server = connect();
  server.use(connect.static('./')).listen(process.env.PORT || 9999, next);
});

gulp.task('reload', ['server'], function() {
  var server = livereload();
  //gulp.watch('src/**', ['js'])
  gulp.watch('build/**').on('change', function(event) {
      server.changed(event.path);
      console.log('File '+event.path+' was '+event.type+', running tasks...');
  });
});

gulp.task('default', ['watch']);
