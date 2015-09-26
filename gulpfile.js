var gulp = require('gulp');
/**
 *  delete for release directory
 *
 *  @param  {Function} cb   call back function
 */
gulp.task('clean', function(cb){
  var del = require('del');
  del(['./dist']);
  cb();
});

/**
 *   Build the project. Generate development image in dev directory
 */
gulp.task('build', function() {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var sourcemaps = require('gulp-sourcemaps');
  var babelify = require('babelify');

  return browserify('./src/js/main.js', {debug: true})
    .transform(babelify)
    .bundle()
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dev/js'));
});

/**
 *  Build the project. Generate release image in dist directory
 */
gulp.task('release', ['clean', 'build'], function(){
  var minifyCSS = require('gulp-minify-css');
  var usemin = require('gulp-usemin');
  var uglify = require('gulp-uglify');

  gulp.src('./src/img/**').pipe(gulp.dest('./dist/img'));
  gulp.src('./dev/js/app.js')
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js'));

  gulp.src('./dev/*.html')
    .pipe( usemin({
      css: [minifyCSS()]
    }))
    .pipe(gulp.dest('./dist'));
});

/**
 *  By watching the change of the code file, run the build, if necessary
 */
gulp.task('watch', ['build'], function(){
  gulp.watch(['./src/js/*.js', './src/js/*.jsx', '!./src/js/app.js'], ['build']);
});

/**
 *  To start the HTTP server with a development folder to the root
 */
gulp.task('server', ['watch'], function(){
  var connect = require('connect');
  var serveStatic = require('serve-static');

  var app = connect();
  app.use(serveStatic(__dirname + '/dev'));
  app.listen(8080);
});

/**
 *  gulp default
 */
gulp.task('default', ['build']);
