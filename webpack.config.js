const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimiizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  // 入口
  entry: './src/index.js',
  // 出口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash].js'
    // filename: '[name].js'
  },
  // 模块转换规则
  module: {
    // test 匹配文件扩展名的正则
    // use => loader名称，使用模块名称
    // include/exclude 手动指定必须处理文件夹或屏蔽不需要处理的文件夹
    // query 为loader提供额外设置选项
    rules: [
      {
        // npm install style-loader css-loader -D
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: [{
            loader: MiniCssExtractPlugin.loader,
            //publicPath解决图片路径不对问题
            options: {
                publicPath: '/'
            }
            // 添加css处理 增加 postcss.config.js文件
        }, 'css-loader','postcss-loader']
        
        // use: ['style-loader', 'css-loader']
        // use: [{
        //        loader: 'style-loader',
        //        options: {
        //            insert: 'top'
        //        }
        //     },'css-loader']
      },
      {
        // 编译less  npm install less less-loader -D
        test: /\.less/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'less-loader'
        ]
        // use: ['style-loader','css-loader','less-loader']
      },
      {
        //编译sass  npm install node-sass sass-loader -D
        test: /\.scss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
        // use: ['style-loader','css-loader','sass-loader']
      },
      {
        // npm install file-loader url-loader -D
        // 支持图片
        test: /\.(png|jpg|gif|svg|bmp)$/,
        use: {
          loader: 'url-loader',
          options: {
            // 10KB 以下使用 base64保存
            limit: 10 * 1024,
            outputPath: 'images/'
          }
        }
      },
      {
          // 转义 es6 / es7
          // npm install babel-loader @babel/core @babel/preset-env -D
          //   npm install @babel/polyfill -D
          //   npm install @babel/runtime @babel/plugin-transform-runtime -D
          // 创建 .babelrc
          
          test: /\.js$/,
          loader:'babel-loader',
          exclude: '/node_modules/'

      }
    ]
  },
  // 插件
  plugins: [
    // 自动生产html文件 html-webpack-plugin
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      hash: true,
      minify: {
        //去掉属性的双引号  可以不加双引号但是建议加上
        // removeAttributeQuotes: true,
        //删除注释
        removeComments: true
      }
    }),
    
    // css 分离 mini-css-extract-plugin -D
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].css'
    }),
    
    // 拷贝静态文件 npm install copy-webpack-plugin -D
    // new CopyWebpackPlugin({
    //     from: path.resolve(__dirname,'src/static'),
    //     to: path.resolve(__dirname,'dist/static')
    // }),

    // 清除dist
    new CleanWebpackPlugin(),

    // js css 压缩
    //npm install terser-webpack-plugin optimize-css-assets-webpack-plugin -D
    new TerserPlugin({
        //开启多进程
        parallel: true,
        // 设置缓存
        cache:false
    }),
    new OptimiizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssPocessor: require('cssnano')
    })
  ],
  
  // 开发服务器
  // npm i webpack-dev-server -D
  // dev 修改为 webpack-dev-server --open
  devServer: {
    // 指定根目录
    contentBase: path.resolve(__dirname, 'dist'),
    host: 'localhost',
    port: 8999,
    // 是否启用gzip 等压缩
    compress: true,
    // 服务器代理
    proxy: {
        // 将 /api/test 开头的接口地址代理到 http://localhost:3000/test
        "/api/test": {
            target: 'http://localhost:3000',
            //https 则设置为 true
            secure: false,
            // 跨域设置为
            changeOrigin: false,
            pathRewrite: {
                '^/api/test': '/test'
            }
        }
    }
  },
  stats: { children: false }
};

