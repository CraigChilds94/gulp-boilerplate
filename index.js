/**
 * gulp-tannwestlake
 * @param Gulp gulp
 */
module.exports = (function(gulp) {

    // Include our dependencies, starting with style stuff
    var sass        = require('gulp-sass'),
        autoprefix  = require('gulp-autoprefixer'),
        minify      = require('gulp-minify-css'),
        rename      = require('gulp-rename'),

        // Scripts
        uglify      = require('gulp-uglify'),
        strip       = require('gulp-strip-debug'),
        concat      = require('gulp-concat'),

        // Images
        png         = require('imagemin-optipng'),
        jpg         = require('imagemin-jpegtran'),
        gif         = require('imagemin-gifsicle'),
        cache       = require('gulp-cache'),

        // Other
        util        = require('gulp-util'),
        del         = require('del'),
        bust        = require('gulp-buster'),
        notify      = require('gulp-notify'),
        notifier    = require('node-notifier'),
        merge       = require('merge-stream')
        sequence    = require('run-sequence');

    /**
     * Deployment task
     *
     * @param  Object options
     * @return Function
     */
    function deploy(options)
    {
        return function() {
            gulp.src(options.files, {base: '.'}).pipe(gulp.dest(options.destination));
        };
    }

    // Give access to the tasks
    return {
        deploy: deploy
    };

});
