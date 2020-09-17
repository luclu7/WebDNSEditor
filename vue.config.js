module.exports = {
  configureWebpack: {
    devServer: {
      headers: { 'Access-Control-Allow-Origin': '*' }
    }
  },
  devServer: {
      proxy: {
          "/api" : { 
              target : "http://pve.lan:8088/getRecords", 
              changeOrigin : true
          }
      }, 
      disableHostCheck : true
  },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = 'Web DNS editor(n\'t)'
                return args
            })
    }

}