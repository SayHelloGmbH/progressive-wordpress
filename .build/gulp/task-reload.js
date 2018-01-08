module.exports = function (key, config, gulp, $, errorLog) {
    return function () {
        gulp.src(config.files)
            .pipe($.livereload());
    };
};