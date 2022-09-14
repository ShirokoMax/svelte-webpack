const sourceMapsInProduction = false;

const SveltePreprocess = require('svelte-preprocess');
const Autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const path = require('path');

// todo rewrite hardcode
const mode = 'development';
// const mode = process.env.NODE_ENV ?? 'development';
const isProduction = mode === 'production';
const isDevelopment = !isProduction;

const config = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		bundle: [
			'./src/main.ts'
		]
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte')
		},
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: path.resolve(__dirname, 'public/build'),
		publicPath: '/build/',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: isDevelopment
						},
						emitCss: isProduction,
						hotReload: isDevelopment,
						hotOptions: {
							// List of options and defaults: https://www.npmjs.com/package/svelte-loader-hot#usage
							noPreserveState: false,
							optimistic: true,
						},
						preprocess: SveltePreprocess({
							scss: true,
							sass: true,
							postcss: {
								plugins: [
									Autoprefixer
								]
							}
						})
					}
				}
			},

			// Required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
			// See: https://github.com/sveltejs/svelte-loader#usage
			{
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			},

			{
				test: /\.(scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									Autoprefixer
								]
							}
						}
					},
					'sass-loader'
				]
			},

			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
				]
			},

			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	devServer: {
		hot: true,
	},
	target: isDevelopment ? 'web' : 'browserslist',
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
	],
	devtool: isProduction && !sourceMapsInProduction ? false : 'source-map',
	stats: {
		chunks: false,
		chunkModules: false,
		modules: false,
		assets: true,
		entrypoints: false
	}
};

module.exports = config;
