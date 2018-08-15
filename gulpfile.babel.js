import {config, assetsDir, assetsBuild} from './.build/gulp/config.js';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

const errorLog = function (error) {
	console.log(error);
	if (this.emit) {
		this.emit('end');
	}
};

function getTask(task) {

	task = task.split(':');
	const mainTask = task[0];
	let subTask = task[1];
	if (undefined === subTask) {
		subTask = '';
	}

	let taskConfig = '';
	for (let [key, values] of Object.entries(config)) {
		if (key === mainTask) {
			taskConfig = values.args;
		}
	}

	return require('./.build/gulp/task-' + mainTask)(subTask, taskConfig, gulp, $, errorLog);
}

/**
 * ----------------
 * TASKS ----------
 * ----------------
 */
for (let [task, values] of Object.entries(config)) {

	if (values.subtasks !== undefined && Object.keys(values.subtasks).length !== 0) {

		let subTask = '';
		const allTasks = [];

		for (let key of values.subtasks) {

			subTask = `${task}:${key}`;

			allTasks.push(subTask);
			gulp.task(subTask, getTask(subTask));
		}

		gulp.task(task, allTasks);

	} else {
		gulp.task(task, getTask(task));
	}
}

gulp.task('default', ['styles', 'scripts', 'svg', 'watch']);