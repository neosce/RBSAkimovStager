const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        vendors: ["webix", "webix/webix.css"],
        entry: path.resolve('./src/js/index.ts'),
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        modules: ['.', path.resolve('node_modules')]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            /*{
                test: /\.(js|ts)x?$/,
                loader: 'babel-loader',
            },*/
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {publicPath: ''},
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            /*{
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            }*/
            /*{
                test: /\.(woff|woff2|eot|ttf|otf|svg|png|gif|jpg|jpeg)$/,
                loader: 'file-loader',
                options: {
                    outputPath: './dist/res/',
                },
            },*/
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("development"),
                    URL: JSON.stringify("http://localhost:9000"),
                }
            }
        ),
        new HtmlWebpackPlugin({
            title: 'TaskManager',
            template: path.resolve('./src/template.html'), // шаблон
            filename: 'index.html', // название выходного файла
            chunks: ['vendors', 'entry'],
            chunksSortMode: 'manual',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
            },
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].style.css',
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
    ],
/*    externals: {
        jquery: 'jQuery'
    },*/
    mode: 'development',
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve('./dist'),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
};
