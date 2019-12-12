// See http://brunch.io for documentation.
exports.files = {
  stylesheets: { joinTo: {
      'app.css': /^app/
    }
  }
};

exports.plugins = {
  babel: {
    presets: ['latest']
  },
  sass: {
    options: {
      includePaths: ['./node_modules/bootstrap/scss/'],
      precision: 8
    }
  }
};

