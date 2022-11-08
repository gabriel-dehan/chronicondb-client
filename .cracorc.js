const { loaderByName, addAfterLoader, removeLoaders } = require("@craco/craco");

// Fix a bug with react-scripts 4 for not resolving assets from /public
// https://github.com/facebook/create-react-app/issues/9937

module.exports = {
  reactScriptsVersion: "react-scripts",
  style: { css: { loaderOptions: () => { return { url: false } } } },
  webpack: {
    configure: (webpackConfig, { env }) => {
      const isEnvDevelopment = env === "development";
      const isEnvProduction = env === "production";
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
      removeLoaders(webpackConfig, loaderByName("resolve-url-loader"));

      const resolveUrlLoader = {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      };

      addAfterLoader(
        webpackConfig,
        loaderByName("postcss-loader"),
        resolveUrlLoader
      );

      return webpackConfig;
    },
  },
}

