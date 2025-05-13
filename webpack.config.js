module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-preset-env')({
                    features: {
                      // Enable CSS features that might cause warnings
                      'nesting-rules': true,
                      'custom-selectors': true
                    }
                  })
                ]
              }
            }
          }
        ]
      }
    ]
  }
};
