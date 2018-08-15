import minify from 'gulp-minify-css';
import sassImportJson from 'gulp-sass-import-json';
import sass from 'gulp-sass';

module.exports = function (key, config, gulp, $, errorLog) {
	return function () {
		gulp.src(config.src)
			.pipe(sassImportJson({isScss: true}))
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest(config.dest))
			.on('error', errorLog)
			// minify
			.pipe(minify())
			.pipe($.rename({
				suffix: '.min'
			}))
			.on('error', errorLog)
			.pipe(gulp.dest(config.dest))
			//reload
			.pipe($.livereload());
	};
};