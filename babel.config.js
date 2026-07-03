// Babel config for ALLDost native — adds NativeWind preset so tailwind
// className props are transformed to StyleSheet-compatible objects.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
