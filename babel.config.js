module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [], // dotenv olib tashlangan bo‘lsa, bu bo‘sh bo‘lishi mumkin
  };
};
