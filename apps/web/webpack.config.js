const path = require('path');

module.exports = {
	// Default target is "web", so no need to set it explicitly.
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
							'./prepend-mixin-loader.js'
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
		new dotenv({
			path: path.resolve(__dirname, '.env'),
		}),
	],
};
