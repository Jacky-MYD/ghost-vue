const path = require('path')
module.exports = {
    pages: {
        // 修改项目的入口文件
        index: {
            entry: 'examples/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        },
    },
    // 扩展webpack配置，使packages加入编译
    chainWebpack: config => {
        config.module
            .rule('js')
            .include.add(path.resolve(__dirname, 'packages')).end()
            .use('babel')
            .loader('babel-loader')
            .tap(options => {
                return options
            })
    },
    // devServer: {
    //     open: true,
    //     host: 'localhost',
    //     port: 8080,
    //     https: false,
    //     proxy: {//配置跨域
    //         '/api': {
    //             target: 'http://localhost:5001/api/',//这里后台的地址模拟的;应该填写你们真实的后台接口
    //             ws: true,
    //             changOrigin: true,//允许跨域
    //             pathRewrite: {
    //                 '^/api': ''//请求的时候使用这个api就可以
    //             }
    //         }
            
    //     }
    // },
    configureWebpack: {
        performance: {
            hints: "warning", // 枚举
            maxAssetSize: 30000000, // 整数类型（以字节为单位）
            maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
            assetFilter: function(assetFilename) {
            // 提供资源文件名的断言函数
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
            
            }
        }
    }
}