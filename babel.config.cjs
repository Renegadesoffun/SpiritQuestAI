// babel.config.cjs
module.exports = function(api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@': './app',
            '@assets': './app/assets',
            '@components': './app/components',
            '@constants': './app/constants',
            '@hooks': './app/hooks'
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx',
            '.mjs'
          ]
        }
      ]
    ]
  };
};