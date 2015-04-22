# gulp-tannwestlake
Our custom Gulp tasks packaged as a gulp "plugin"

### Add dependency to package.json
```
"dependencies": {
    "gulp-tannwestlake": "tannwestlake/gulp-tannwestlake"
}
```

### Example usage

Specify some options and pass them to the task function. Any present will overwrite the default options which can be found in `index.js` by the task name on the `settings` object. Example: `settings.deploy` would hold the default options for the deploy task. Below is an example of how to apply the `tw.deploy` task to your `gulpfile`.

```js
var gulp = require('gulp');
var tw   = require('gulp-tannwestlake')(gulp);

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

gulp.task('deploy', tw.deploy(options.deploy));
```
