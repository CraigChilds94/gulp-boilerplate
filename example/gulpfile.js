var gulp = require('gulp');
var boilerplate   = require('gulp-boilerplate')(gulp);

// Styles task
gulp.task('styles', boilerplate.styles());

// Scripts task
gulp.task('scripts', boilerplate.scripts());

// Images task
gulp.task('images', boilerplate.images());

// Clean task
gulp.task('clean', boilerplate.clean());

// Clear task
gulp.task('clear', boilerplate.clear());

// Watch task
gulp.task('watch', boilerplate.watch());

// Default task
gulp.task('default', boilerplate.standard());

// Production task
gulp.task('production', ['clean'], boilerplate.production());

// Deployment task
gulp.task('deploy', ['production'], boilerplate.deploy());
