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

    // Store default settings for all tasks
    var settings = {

        // Deploy task settings
        deploy: {
            files: ['**/*'],
            destination: '_deploy'
        },

        // Style task settings
        styles: {
            autoprefix: {
                browsers: "last 15 versions"
            },
            public: 'public/styles',
            src: 'assets/styles/**/*.scss',
            cache: 'public/cache',
            sass: {
                sourceComments: 'normal'
            }
        },
    };

    /**
     * Handle option setting
     *
     * @param Object defaults  Default options
     * @param Object supplied User supplied
     */
    function _setOptions(defaults, supplied)
    {
        if(supplied === undefined) return defaults;

        var options = defaults;

        for(key in supplied) {
            var option = supplied[key];

            if(option !== undefined) {
                options[key] = supplied[key];
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
        var realOptions = _setOptions(settings.deploy, options);

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
        var realOptions = _setOptions(settings.styles, options);

        return function() {
            gulp.src(realOptions.src)
                .pipe(sass(realOptions.sass))
                .on('error', util.log)
                .pipe(autoprefix(realOptions.autoprefix))
                .pipe(gulp.dest(realOptions.public))
                .pipe(bust())
                .pipe(gulp.dest(realOptions.cache));
        };
    };

    // Give access to the tasks
    return {
        styles: styles,
        deploy: deploy
    };

});
