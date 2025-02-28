const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
	entry: {
		main: path.resolve(__dirname, 'src/main.ts'),
		polyfills: path.resolve(__dirname, 'src/polyfills.ts'),
	},
	module: {
		rules: [
			{
				test: /\.pug$/,
				use: [
					{
						loader: '@webdiscus/pug-loader',
						options: {
							method: 'render',
							doctype: 'html',
							plugins: [require('pug-plugin-ng')],
						},
					},
					{
						loader: path.resolve(
							__dirname,
							'prepend-mixin-loader.js'
						),
					},
				],
			},
			{
				test: /\.(png|jpg|jpeg)/,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new Dotenv({
			path: path.resolve(__dirname, '.env'),
			systemvars: true,
		}),
	],
};
