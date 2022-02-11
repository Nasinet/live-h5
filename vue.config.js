module.exports = {
  // configureWebpack: {
  //   externals: process.env.NODE_ENV ? {
  //     // vue: 'Vue',
  //     // 'vue-router': 'VueRouter',
  //     // axios: 'axios'
  //   } : {}
  // },
  devServer: {
    port: '8081'
    // proxy: {
    //   '/shop': {
    //     target: 'https://live.nasinet.com/',
    //     // target: 'http://192.168.0.100',
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   '/webapi': {
    //     target: 'https://live.nasinet.com/',
    //     // target: 'http://192.168.0.100',
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   '/api': {
    //     target: 'https://live.nasinet.com/',
    //     // target: 'http://192.168.0.100',
    //     ws: true,
    //     changeOrigin: true
    //   }
    // }
  }
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/mobile'
  //   : '/'
}
