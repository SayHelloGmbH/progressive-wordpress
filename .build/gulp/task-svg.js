module.exports = function (key, config, gulp, $, errorLog) {
	return function () {
		gulp.src(config.src)
			//.pipe($.debug({title: 'svg:'}))
			.pipe($.svgmin())
			.pipe($.rename({
				suffix: '.min'
			}))
			.on('error', errorLog)
			.pipe(gulp.dest(config.dest));
	};
};