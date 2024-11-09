// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add these resolver configurations
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];
config.resolver.assetExts.push('wav');

// Add URL polyfill
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  url: require.resolve('url/'),
};

module.exports = config; 