var gulp = require('gulp');
var tw   = require('gulp-tannwestlake')(gulp);

// Styles task
gulp.task('styles', tw.styles());

// Scripts task
gulp.task('scripts', tw.scripts());

// Images task
gulp.task('images', tw.images());

// Clean task
gulp.task('clean', tw.clean());

// Clear task
gulp.task('clear', tw.clear());

// Watch task
gulp.task('watch', tw.watch());

// Default task
gulp.task('default', tw.standard());

// Production task
gulp.task('production', ['clean'], tw.production());

// Deployment task
gulp.task('deploy', ['production'], tw.deploy());
