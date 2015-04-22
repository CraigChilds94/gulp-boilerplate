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
     * Handle option setting
     *
     * @param Object defaults  Default options
     * @param Object supplied User supplied
     */
    function _setOptions(defaults, supplied)
    {
        if(supplied === undefined) return defaults;

        var options;

        for(key in supplied) {
            var option = supplied[key];

            if(option === undefined) {
                options[key] = defaults[key];
            } else if(typeof option === 'object') {
                options[key] = _setOptions(defaults[key], supplied[key]);
            }
        }

        return options;
    };

    /**
     * Deployment task
     *
     * @param  Object options
     * @return Function
     */
    function deploy(options)
    {
        var defaults = {
            files: ['**/*'],
            destination: '_deploy'
        };

        var realOptions = _setOptions(defaults, options);

        return function() {
            gulp.src(realOptions.files, {base: '.'}).pipe(gulp.dest(realOptions.destination));
        };
    };

    /**
     * Styles task
     *
     * @param  Object options
     * @return Function
     */
    function styles(options)
    {
        return function() {
            gulp.src(options.src)
                .pipe(sass(options.sass))
                .on('error', util.log)
                .pipe(autoprefix(options.autoprefix))
                .pipe(gulp.dest(options.public))
                .pipe(bust())
                .pipe(gulp.dest(options.cache));
        };
    };

    // Give access to the tasks
    return {
        styles: styles,
        deploy: deploy
    };

});
