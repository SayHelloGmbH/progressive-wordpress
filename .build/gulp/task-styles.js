import minify from 'gulp-minify-css';

module.exports = function (key, config, gulp, $, errorLog) {
    return function () {
        gulp.src(config.src)
            .pipe($.compass({
                css: config.compass.css,
                image: config.compass.image,
                sass: config.compass.sass,
                style: config.compass.style,
                require: ['sass-json-vars'],
            }))
            .on('error', errorLog)
            // minify
            .pipe(minify())
            .pipe($.rename({
                suffix: '.min'
            }))
            .on('error', errorLog)
            .pipe(gulp.dest(config.compass.css))
            //reload
            .pipe($.livereload());
    };
};