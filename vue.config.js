module.exports = {
  configureWebpack: {  
    resolve: { //解决路径相关
      alias: {  //配置别名
        'assets': '@/assets', //vue cl3可以使用 '@/assets' 其他使用 'src/assets'
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}