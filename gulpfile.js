var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var ghPages = require('gulp-gh-pages');

gulp.task('build', function() {
  gulp.src([
    'src/*.coffee',
  ])
  .pipe(coffee({bare: true}))
  .pipe(concat('d3-bdc.js'))
  .pipe(gulp.dest('./dist'))
});

// gulp.task('minify', ['build'], function() {
//   gulp.src('dist/*.js')
//   .pipe(minify({
//       ignoreFiles: ['.min.js']
//   }))
//   .pipe(gulp.dest('dist'))
// });

gulp.task('watch', ['build'], function () {
  gulp.watch('src/*.coffee', ['build']);
});

gulp.task('deploy', function() {
  return gulp.src(['demo/*', 'bower_components/*', 'dist/*'])
    .pipe(ghPages());
});
