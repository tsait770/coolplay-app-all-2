const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure expo-router is properly configured for web
config.resolver.alias = {
  ...config.resolver.alias,
};

// Add web-specific configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
