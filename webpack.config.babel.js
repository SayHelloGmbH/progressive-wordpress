import path from 'path';
import fs from 'fs';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import LiveReloadPlugin from 'webpack-livereload-plugin';

module.exports = (env, argv) => {
  const dirDist = path.resolve(__dirname, 'assets/dist');
  const dirSrc = path.resolve(__dirname, 'assets/src');
  const dev = argv.mode !== 'production';

  return {
    entry: {
      admin: `${dirSrc}/admin/index.ts`,
      //installprompt: `${dirSrc}/ui-installprompt`,
      //offline: `${dirSrc}/ui-offline`,
      //pushbutton: `${dirSrc}/ui-pushbutton`,
      //webpushbutton: `${dirSrc}/ui-webpushbutton`,
    },
    output: {
      path: dirDist,
      filename: '[name].js',
      publicPath: '/',
    },
    devtool: dev ? `cheap-module-eval-source-map` : undefined,
    plugins: [
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].[id].css',
      }),
      new LiveReloadPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: dev,
                //reloadAll: true,
              },
            },
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  require('postcss-nested'),
                  require('autoprefixer'),
                ],
              },
            },
          ],
        },
      ],
    },
    resolve: {
      alias: {},
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    externals: dev
      ? {}
      : {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
  };
};
