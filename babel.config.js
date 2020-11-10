// 为了避免开发模式下不能使用console.log()
const proPlugin = []
if(process.env.NODE_ENV === 'production'){
  proPlugin.push('transform-remove-console')
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ], 
    ...proPlugin,
    '@babel/plugin-syntax-dynamic-import'
  ]
}