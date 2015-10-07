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
 *  error to log and notify
 *
 */
function handleErrors() {
  var notify = require('gulp-notify');
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  console.log(args);
  this.emit('end'); // Keep gulp from hanging on this task
}

/**
 *  get target
 */
function getTarget(args) {
  if(typeof args.t !== "undefined" && args.t != null){
    return args.t;
  } else if(typeof args.target !== "undefined" && args.target != null){
    return args.target;
  }
  return 'main.js';
}

/**
 *   Build the project. Generate development image in dev directory
 *    --src | -s src file name. default 'main.js'
 */
gulp.task('build', function() {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  var buffer = require('vinyl-buffer');
  var sourcemaps = require('gulp-sourcemaps');
  var babelify = require('babelify');
  var notify = require('gulp-notify');
  var argv = require('minimist')(process.argv.slice(2));

  var src_file_path = '';
  var src_root_path = './src/js/';
  var target = getTarget(argv);
  src_file_path = src_root_path + target;

  console.log(src_file_path);

  return browserify(src_file_path, {debug: true})
    .transform(babelify)
    .bundle()
    .on('error', handleErrors)
    .pipe(source(target))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dev/js'))
    .pipe(notify("End of build!"));
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
  // gulp.watch(['./src/js/*.js', './src/js/*.jsx', '!./src/js/app.js'], ['build']);
  var watch_target_src = ['./src/js/*.js', './src/js/*.jsx', '!./src/js/app.js'];
  var watch = require('gulp-watch');
  watch(watch_target_src, function(){
    gulp.start(['build']);
  });
});

/**
 *  To start the HTTP server with a development folder to the root
 */
// gulp.task('server', ['watch'], function(){
gulp.task('server', function(){
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
