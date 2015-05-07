/**
 * gulp-boilerplate
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
        cache       = require('gulp-cache'),

        // Other
        util        = require('gulp-util'),
        del         = require('del'),
        bust        = require('gulp-buster'),
        notify      = require('gulp-notify'),
        notifier    = require('node-notifier'),
        merge       = require('merge-stream')
        sequence    = require('run-sequence');

    // Store default globalSettings for all tasks
    var globalSettings = {

        // Deploy task globalSettings
        deploy: {
            files: ['**/*'],
            destination: '_deploy'
        },

        // Style task globalSettings
        styles: {
            autoprefix: {
                browsers: "last 15 versions"
            },
            public: 'public/styles',
            src: 'assets/styles/**/*.scss',
            cache: 'public/cache',
            sass: {
                sourceComments: 'normal'
            },
            minify: false
        },

        // Script task globalSettings
        scripts: {
            src: 'assets/js/**/*.js',
            filename: 'main.min.js',
            public: 'public/js',
            cache: 'public/cache',
            uglify: false,
            strip: false
        },

        // Images task globalSettings
        images: {
            src: 'assets/img/**/*',
            public: 'public/img'
        },

        // Clean task globalSettings
        clean: {
            paths: [
                'public/styles',
                'public/js',
                'public/img'
            ],
        },

        // Default task globalSettings
        standard: {
            notify: {message: 'Tasks complete'},
            watch: true,
            clean: true,
            tasks: ['scripts', 'styles', 'images']
        },

        // Watch task globalSettings
        watch: {
            tasks: [
                {path: 'assets/styles/**/*.scss', tasks: ['styles']},
                {path: 'assets/js/**/*.js', tasks: ['scripts']},
                {path: 'assets/img/**/*', tasks: ['images']}
            ]
        },
    };

    /**
     * Handle errors
     *
     * @param error
     */
    var _logErrors = function(error)
    {
        console.log("An error has occured:");
        console.log(error.toString());

        util.log(error);
        this.emit('end');
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
     * @param  Object customOptions
     * @return Function
     */
    function deploy(customOptions)
    {
        var options = _setOptions(globalSettings.deploy, customOptions);

        return function() {
            return gulp.src(options.files, {base: '.'}).pipe(gulp.dest(options.destination));
        };
    };

    /**
     * Styles task
     *
     * @param  Object customOptions
     * @return Function
     */
    function styles(customOptions)
    {
        var options = _setOptions(globalSettings.styles, customOptions);

        return function() {
            var styles = gulp.src(options.src)
                .pipe(sass(options.sass))
                .on('error', _logErrors)
                .on('error', notify.onError('Error: <%= error.message %>'))
                .pipe(autoprefix(options.autoprefix));

            if(options.minify === true) {
                styles = styles.pipe(minify());
            }

            return styles.pipe(gulp.dest(options.public))
                .pipe(bust())
                .pipe(gulp.dest(options.cache));
        };
    };

    /**
     * Scripts task
     *
     * @param  Object customOptions
     * @return Function
     */
    function scripts(customOptions)
    {
        var options = _setOptions(globalSettings.scripts, customOptions);

        return function() {
            var scripts = gulp.src(options.src).pipe(concat(options.filename));

            if(options.strip === true) {
                scripts = scripts.pipe(strip());
            }

            if(options.uglify === true) {
                scripts = scripts.pipe(uglify());
            }

            return scripts.pipe(gulp.dest(options.public))
                .pipe(bust())
                .pipe(gulp.dest(options.cache));
        };
    };

    /**
     * Images task
     *
     * @param  Object customOptions
     * @return Function
     */
    function images(customOptions)
    {
        var options = _setOptions(globalSettings.images, customOptions);

        return function() {
            return gulp.src(options.src)
                .pipe(gulp.dest(options.public));
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
     * @param  Object customOptions
     * @return Function
     */
    function clean(customOptions)
    {
        var options = _setOptions(globalSettings.clean, customOptions);

        return function(cb) {
            return del(options.paths, cb);
        };
    };

    /**
     * Production task
     *
     * @param  Object customOptions
     * @return Function
     */
    function production()
    {
        return function() {
            // Return the streams in one combined stream
            return merge(styles({minify: true})(), scripts({strip: true, uglify: true})(), images()());
        };
    };

    /**
     * Standard task
     *
     * @param  Object customOptions
     * @return Function
     */
    function standard(customOptions)
    {
        var options = _setOptions(globalSettings.standard, customOptions);

        return function(callback) {

            if(options.clean === true && options.watch === true) {
                sequence('clean', options.tasks, 'watch', callback);
            } else if(options.clean === true && options.watch === false) {
                sequence('clean', options.tasks, callback);
            } else if(options.clean === false && options.watch === true) {
                sequence(options.tasks, 'watch', callback);
            } else {
                sequence(options.tasks, callback);
            }

            notifier.notify(options.notify);
        };
    };

    /**
     * Watch task
     *
     * @param  Object customOptions
     * @return Function
     */
    function watch(customOptions)
    {
        var options = _setOptions(globalSettings.watch, customOptions);

        return function() {
            for(index in options.tasks) {
                var task = options.tasks[index];
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
