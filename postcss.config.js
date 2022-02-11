module.exports = ({ file }) => {
  const isVant = file && file.dirname && file.dirname.indexOf('vant') > -1;
  const rootValue = isVant ? 37.5 : 75; // 判断条件 请自行调整

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue: rootValue, // 设计稿宽度的1/10,
        propList: ['*'] // 需要做转化处理的属性，如`hight`、`width`、`margin`等，`*`表示全部
      }
    }
  }
}
