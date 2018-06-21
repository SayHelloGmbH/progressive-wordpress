const assetsDir = 'assets/';
const assetsBuild = '.build/assets/';

const config = {

	styles: {
		args: {
			src: `${assetsBuild}styles/**/*.scss`,
			compass: {
				css: `${assetsDir}styles/`,
				image: `${assetsDir}img/`,
				sass: `${assetsBuild}styles/`,
				style: 'expanded'
			}
		}
	},

	scripts: {
		subtasks: [
			'ui',
			'admin'
		],
		args: {
			base: `${assetsDir}scripts/`,
			build: `${assetsBuild}scripts/`
		}
	},

	reload: {
		args: {
			files: [
				'*.php',
				'{Classes,inc}/**/*.{php,html}'
			]
		}
	},

	minify: {
		subtasks: ['svg', 'scripts'],
		args: {
			svg: {
				src: [
					'**/assets/img/icons/*.svg',
					'**/assets/img/icons/**/*.svg',
					'!**/*.min.svg',
					'!assets/img/icons/mdi/**/*.svg',
					'!assets/img/icons/mdi/*.svg'
				],
				dest: './'
			},
			scripts: {
				src: [
					`${assetsDir}scripts/*.js`,
					`!${assetsDir}scripts/*.min.js`
				],
				dest: './',
				base: `${assetsDir}scripts/`,
				build: `${assetsBuild}scripts/`
			}
		}
	},

	watch: {}
};

module.exports = config;