let { ADMIN__PORT } = process.env;

let path = require('path');

module.exports = {
  devServer: {
    port: ADMIN__PORT,
  },

  configureWebpack: {
    module: {
      // PUG
      rules: [
        {
          test: /\.pug$/,
          loader: 'pug-plain-loader',
          options: {
            basedir: path.resolve(__dirname, ''),
          },
        },
      ],
    },
  },
};
