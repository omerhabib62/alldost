// Metro config for ALLDost native — wraps Expo default with NativeWind
// so tailwind classes compile at bundle time.
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './src/global.css' });
