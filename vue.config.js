//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  publicPath: '.',
  configureWebpack: {
    // No need for splitting
    optimization: {
      splitChunks: false
    },
    //plugins: [new BundleAnalyzerPlugin()]
  },
  filenameHashing: false,
  pages: {
    mathmodal: {
      entry: './src/main.js',
      filename: 'index.html'
    }
  }
}