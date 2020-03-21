/**
 * 覆盖默认webpack配置的,将我们的antd-mobile变成按需引入的方式
 */
const { override, fixBabelImports } = require("customize-cra");

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: "css"
  })
);
