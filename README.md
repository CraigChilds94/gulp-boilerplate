# gulp-tannwestlake
Our custom Gulp tasks packaged as a gulp "plugin"

### Example usage
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
