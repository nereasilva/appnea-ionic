// This environment file now uses placeholder values that will be replaced at runtime
// by the PlatformConfigService based on the current platform (web, Android, iOS)
export const environment = {
  production: false,
  // These values will be overridden by PlatformConfigService
  apiUrl: 'placeholder-will-be-replaced-at-runtime',
  mongoUri: 'mongodb://127.0.0.1:27017/appnea'
};
