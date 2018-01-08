import * as main from './config.js';

module.exports = function (key, config, gulp, $, errorLog) {
    return function () {

        const mainConfig = main;

        $.livereload.listen();

        console.log('starting styles..');
        gulp.watch(mainConfig.styles.args.src, ['styles']);

        for (let subtask of mainConfig.scripts.subtasks) {
            console.log(`starting scripts:${subtask}..`);
            gulp.watch(`${mainConfig.scripts.args.build}${subtask}/**/*.js`, [`scripts:${subtask}`]);
        }

        console.log('starting reload..');
        gulp.watch(mainConfig.reload.args.files).on('change', $.livereload.changed);

        for (let subtask of mainConfig.minify.subtasks) {
            console.log(`starting minify:${subtask}..`);
            if (subtask === 'scripts') {
                gulp.watch(mainConfig.minify.args.scripts.src, [`minify:${subtask}`]);
            } else if (subtask === 'svg') {
                gulp.watch(mainConfig.minify.args.svg.src, [`minify:${subtask}`]);
            }
        }
    };
};