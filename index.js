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

        // Script task settings
        scripts: {
            src: 'assets/js/**/*.js',
            filename: 'main.min.js',
            public: 'public/js',
            cache: 'public/cache'
        },

        // Images task settings
        images: {
            src: 'assets/img/**/*',
            public: 'public/img'
        },

        // Clean task settings
        clean: {
            paths: [
                'public/styles',
                'public/js',
                'public/img'
            ],
        },

        // Default task settings
        standard: {
            notify: {message: 'Tasks complete'},
            watch: true,
            clean: true,
            tasks: ['scripts', 'styles', 'images']
        },

        // Watch task settings
        watch: {
            tasks: [
                {path: 'assets/styles/**/*.scss', tasks: ['styles']},
                {path: 'assets/js/**/*.js', tasks: ['scripts']},
                {path: 'assets/img/**/*', tasks: ['images']}
            ]
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
            return gulp.src(realOptions.files, {base: '.'}).pipe(gulp.dest(realOptions.destination));
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
            return gulp.src(realOptions.src)
                .pipe(sass(realOptions.sass))
                .on('error', util.log)
                .pipe(autoprefix(realOptions.autoprefix))
                .pipe(gulp.dest(realOptions.public))
                .pipe(bust())
                .pipe(gulp.dest(realOptions.cache));
        };
    };

    /**
     * Scripts task
     *
     * @param  Object options
     * @return Function
     */
    function scripts(options)
    {
        var realOptions = _setOptions(settings.scripts, options);

        return function() {
            return gulp.src(realOptions.src)
                .pipe(concat(realOptions.filename))
                .pipe(gulp.dest(realOptions.public))
                .pipe(bust())
                .pipe(gulp.dest(realOptions.cache));
        };
    };

    /**
     * Images task
     *
     * @param  Object options
     * @return Function
     */
    function images(options)
    {
        var realOptions = _setOptions(settings.images, options);

        return function() {
            return gulp.src(realOptions.src)
                .pipe(gulp.dest(realOptions.public));
        };
    };

    /**
     * Clear task
     *
     * @return Function
     */
    function clear()
    {
        return function(done) {
            return cache.clearAll(done);
        };
    };

    /**
     * Clean task
     *
     * @param  Object options
     * @return Function
     */
    function clean(options)
    {
        var realOptions = _setOptions(settings.clean, options);

        return function(cb) {
            return del(realOptions.paths, cb);
        };
    };

    /**
     * Production task
     *
     * @param  Object options
     * @return Function
     */
    function production()
    {
        return function() {
            // Return the streams in one combined stream
            return merge(styles()(), scripts()(), images()());
        };
    };

    /**
     * Standard task
     *
     * @param  Object options
     * @return Function
     */
    function standard(options)
    {
        var realOptions = _setOptions(settings.standard, options);

        return function(callback) {

            if(realOptions.clean === true && realOptions.watch === true) {
                sequence('clean', realOptions.tasks, 'watch', callback);
            } else if(realOptions.clean === true && realOptions.watch === false) {
                sequence('clean', realOptions.tasks, callback);
            } else if(realOptions.clean === false && realOptions.watch === true) {
                sequence(realOptions.tasks, 'watch', callback);
            } else {
                sequence(realOptions.tasks, callback);
            }

            notifier.notify(realOptions.notify);
        };
    };

    /**
     * Watch task
     *
     * @param  Object options
     * @return Function
     */
    function watch(options)
    {
        var realOptions = _setOptions(settings.watch, options);

        return function() {
            for(index in realOptions.tasks) {
                var task = realOptions.tasks[index];
                gulp.watch(task.path, task.tasks);
            }
        };
    };

    // Give access to the tasks
    return {
        styles: styles,
        scripts: scripts,
        images: images,
        clear: clear,
        clean: clean,
        production: production,
        deploy: deploy,
        standard: standard,
        watch: watch
    };

});
