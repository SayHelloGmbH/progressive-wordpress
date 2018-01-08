import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import babelloader from 'babel-loader';

module.exports = function (key, config, gulp, $, errorLog) {
    return function () {
        gulp.src([
            `${config.build + key}/**/*.js`,
            `!${config.build + key}/modules/*.js`
        ])
            .pipe(
                gulpWebpack({
                    module: {
                        rules: [
                            {
                                test: /\.js$/,
                                exclude: /node_modules/,
                                loader: "babel-loader"
                            }
                        ]
                    },
                    output: {
                        filename: `${key}.js`
                    },
                    externals: {
                        "jquery": "jQuery"
                    }
                }, webpack)
            )
            .on('error', errorLog)
            .pipe(gulp.dest(config.base))
    };
};