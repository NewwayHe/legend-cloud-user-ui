const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
var webpack = require('webpack');
module.exports = {
    lintOnSave: true, // false:取消ESLint 校验，process.env.NODE_ENV === 'development'
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === 'production' && process.env.UNI_PLATFORM === 'h5') {
            // externals 属性添加 config 此项配置使  import config from '@/config/config.js'; 在生产环境的时候不会打包到代码里面
            config.set('externals', { '@/config/config.js': 'config' })
        }
    },

    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production' && process.env.UNI_PLATFORM === 'h5') {
            // 将serviceConfig.js 复制到根目录。目的是为了把serviceConfig.js里面的config变量挂载到全局里
            config.plugins.push(
                new CopyWebpackPlugin([
                    {
                        from: path.join(__dirname, 'config/serviceConfig.js'),
                        to: path.join(__dirname, 'unpackage/dist', process.env.NODE_ENV === 'production' ? 'build/h5' : 'dev/h5')
                    }
                ])
            )
			// 给H5端加一个版本号(用打包时的时间戳来做版本号)
			config.plugins.push(
				new webpack.DefinePlugin({
					WEBPACKTIME: JSON.stringify(new Date().getTime()),
				})
			)
        }
    }
}
