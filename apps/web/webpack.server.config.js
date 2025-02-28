const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
	target: 'node',
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
				generator: {
					emit: false, // Don’t emit assets on server
				},
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
