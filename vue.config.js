const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    historyApiFallback: {
      disableDotRule: true, // Allow requests for files with dots, like `.txt`
    },
  },
};
