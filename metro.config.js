const { getDefaultConfig } = require("expo/metro-config")
const { withNativeWind } = require("nativewind/metro")

const config = getDefaultConfig(__dirname)

config.resolver.sourceExts.push("sql", "js", "jsx", "ts", "tsx")

module.exports = withNativeWind(config, {
  input: "./global.css",
  inlineRem: 16,
})
