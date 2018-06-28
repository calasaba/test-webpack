/*
* @Author: calasaba
* @Date:   2018-06-26 13:59:48
* @Last Modified by:   calasaba
* @Last Modified time: 2018-06-26 16:38:26
*/
const path                     = require('path');
const webpack                  = require('webpack');
const CopyWebpackPlugin        = require('copy-webpack-plugin');
const CleanWebpackPlugin       = require('clean-webpack-plugin');
const HtmlWebpackPlugin        = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');


var config = {
    //入口文件
    entry : {
        index  : path.resolve(__dirname,'src','index.js'),
        page   : path.resolve(__dirname,'src','page.js'),
        vendor : 'lodash'//多个页面所需的公共库文件,防止重复打包带入
    },
    //出口文件
    output : {
        publicPath : '/',//这里要放的是静态资源CDN的地址
        path       : path.resolve(__dirname,'dist'),
        filename   : '[name].[hash].js'
    },
    //给文件夹配置别名,可以加快webpack查找模块的速度
    resolve : {
        extensions : ['.js','.css','.json'],
        alias      : {}
    },
    module : {
        rules : [
            {
                test : /\.css$/,
                use  : ExtractTextWebpackPlugin.extract({
                    fallback : 'style-loader',
                    use      : ['css-loader','postcss-loader']
                }),
                include : path.join(__dirname,'src'),
                exclude : /node_modules/
            },
            {
                test : /\.less$/,
                use  : ExtractTextWebpackPlugin.extract({
                    fallback : 'style-loader',
                    use      : ['css-loader','postcss-loader','less-loader']
                }),
                include : path.join(__dirname,'src'),
                exclude : /node_modules/
            },
            {
                test : /\.scss$/,
                use  : ExtractTextWebpackPlugin.extract({
                    fallback : 'style-loader',
                    use      : ['css-loader','postcss-loader','sass-loader']
                }),
                include : path.join(__dirname,'src'),
                exclude : /node_modules/
            },
            {
                test : /\.jsx?$/,
                use  : {
                    loader : 'babel-loader',
                    query  : {//同时可以把babel配置写到根目录下的.babelrc中
                        presets : ['env','stage-0']// env转换es6 stage-0转es7
                    }
                }
            },
            {
                test : /\.(png|jpg|jpeg|gif|svg)/,
                use  : {
                    loader : 'url-loader',
                    options : {
                        outputPath : 'images/',
                        limit      : 1*1024
                    }
                }
            }
        ]
    },
    plugins : [
        new HtmlWebpackPlugin({
            template : path.resolve(__dirname,'src','index.html'),
            filename : 'index.html',
            chunks   : ['index', 'vendor'],
            hash     : true,//防止缓存
            minify   : {
                removeAttributeQuotes : true//压缩 去掉引号
            }
        }),
        new HtmlWebpackPlugin({
            template : path.resolve(__dirname,'src','page.html'),
            filename : 'page.html',
            chunks   : ['page', 'vendor'],
            hash     : true,//防止缓存
            minify   : {
                removeAttributeQuotes : true//压缩 去掉引号
            }
        }),
        new webpack.ProvidePlugin({
            _ : 'lodash'//所有页面都会引入 _ 这个变量，不用再import引入
        }),
        new ExtractTextWebpackPlugin('css/[name].[hash].css'),
        new CopyWebpackPlugin([
            {
                from : path.resolve(__dirname,'static'),
                to   : path.resolve(__dirname,'dist/static'),
                ignore : ['.*']
            }
        ]),
        new CleanWebpackPlugin([path.join(__dirname,'dist')]),
    ],
    devtool : 'eval-source-map',
    devServer : {
        contentBase : path.join(__dirname,'dist'),
        port        : 3880,
        host        : 'localhost',
        overlay     : true,
        compress    : false //服务器返回浏览器的时候是否启动gzip压缩
    },
    // watch : true,
    // watchOption : {
    //     ignored : /node_modules/,
    //     aggregateTimeout : 100, //防止重复保存频繁重新编译,500毫米内重复保存不打包
    //     poll             : 1000 //每秒询问的文件变更的次数
    // }
};
module.exports = config;