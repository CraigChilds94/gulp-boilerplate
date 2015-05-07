# gulp-boilerplate
Some custom Gulp tasks packaged as a gulp "plugin"

### Add dependency to package.json
```
"dependencies": {
    "gulp-boilerplate": "tannwestlake/gulp-boilerplate"
}
```

### Example usage

Specify some options and pass them to the task function. Any present will overwrite the default options which can be found in `index.js` by the task name on the `settings` object. Example: `settings.deploy` would hold the default options for the deploy task. Below is an example of how to apply the `boilerplate.deploy` task to your `gulpfile`.

```js
var gulp          = require('gulp');
var boilerplate   = require('gulp-boilerplate')(gulp);

var options = {
    deploy: {
        files: [
            '**/*',
            '!{_deploy,_deploy/**}',
            '!{vendor,vendor/**}',
            '!{assets,assets/**}',
            '!{node_modules,node_modules/**}',
            '!package.json',
            '!.editorconfig',
            '!gulpfile.js',
            '!composer.json',
            '!composer.lock',
            '!README.md'
        ],
        destination: '_deploy'
    },
};

gulp.task('deploy', boilerplate.deploy(options.deploy));
```

You can find an example `gulpfile.js` and `package.json` in the [example](/example) folder. This example relies on the default options which are set in `index.js`.
