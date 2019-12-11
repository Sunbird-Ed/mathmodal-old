module.exports = {
  publicPath: '.',
  configureWebpack: {
    // No need for splitting
    optimization: {
      splitChunks: false
    }
  }
}