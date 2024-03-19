/*
用于启用压缩，配合nginx设置，减小chunk-vendor.js大小 
*/
//【echarts配置】,添加依赖
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');

const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
//使用环境变量NODE_ENV,如果是production，表示是生产环境
const isProduction = process.env.NODE_ENV === 'production'
//如果是打包生产环境，则添加打包配置，如文件拷贝、压缩等；否则使用开发环境配置
if (isProduction) {
    console.log('【使用生产环境打包配置】')
    //生产环境导出配置
    module.exports = {
        productionSourceMap: false,
        configureWebpack: {
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@i': path.resolve(__dirname, './src/assets'),
                }
            },
            plugins: [
                // Ignore all locale files of moment.js
                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

                // 配置compression-webpack-plugin压缩
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                }),
                new webpack.optimize.LimitChunkCountPlugin({
                    maxChunks: 5,
                    minChunkSize: 100
                }),
                //【echarts配置】，将echarts的js文件直接拷贝到dist目录
                new CopyWebpackPlugin([
                    { from: './src/assets/js/echarts.common.min.js', to: './js' }
                ])
            ],
            //【echarts配置】，打包时排除echarts，减小chunk-vendor.js大小 ，提高首次加载速度
            externals: {
                echarts: "echarts",
            }
        }
    }
} else {
    console.log('【使用开发环境配置】')
    //非生产环境导出配置，主要配置一个开发代理，指向后端，解决跨域问题，在request.js中，就可以直接使用/api
    module.exports = {
        //配置本地开发运行服务器
        devServer: {
            //跨域代理配置，拦截所有的/api开头的请求
            proxy: {
                '/api': {
                    target: 'http://localhost:8088',  //需要跨域的后端地址
                    ws: true,
                    changOrigin: true,  //允许跨域
                    pathRewrite: {
                        '^/api': ''  //请求时，使用/api
                    }
                }
            }
        }
    }
}