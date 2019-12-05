module.exports = {
    chainWebpack: config => {
      config.externals({
        'jquery': 'jquery',
        'MathQuill': 'MathQuill'
      })
    },
    css: {
      extract: false
    }
  }