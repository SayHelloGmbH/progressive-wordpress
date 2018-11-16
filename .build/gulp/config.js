export const assetsDir = 'assets/';
export const assetsBuild = '.build/assets/';

export const config = {

	styles: {
		args: {
			src: `${assetsBuild}styles/**/*.scss`,
			dest: `${assetsDir}styles/`
		}
	},

	scripts: {
		subtasks: [
			'ui',
			'admin',
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
				'{includes,inc,partials,templates}/**/*.{php,html,twig}'
			]
		}
	},

	svg: {
		args: {
			src: [
				'assets/**/*.svg',
				'!assets/**/*.min.svg'
			],
			dest: 'assets/'
		}
	},

	watch: {}
};