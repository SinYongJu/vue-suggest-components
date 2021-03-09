const path = require('path')

module.exports = {
  configureWebpack: {
    // devServer: {
    //   proxy: {
    //     '/api/*': {
    //     //   target: ,
    //     //   changeOrigin: true
    //     },
    //     // ...
    //   },
    //   disableHostCheck: true
    // },
    resolve: {
      alias: {
        '@': path.resolve('src/'),
        '@api': path.resolve('src/api/'),
        '@css': path.resolve('src/assets/css/'),
        '@font': path.resolve('src/assets/font/'),
        '@image': path.resolve('src/assets/image/'),
        '@resource': path.resolve('src/assets/resource/'),
        '@components': path.resolve('src/components'),
        '@commons': path.resolve('src/components/commons/'),
        // '@sections': path.resolve('src/components/sections/'),
        '@constants': path.resolve('src/constants/'),
        '@pages': path.resolve('src/pages/'),
        '@store': path.resolve('src/store/'),
        '@utils': path.resolve('src/utils/')
      }
    }
  }
}
