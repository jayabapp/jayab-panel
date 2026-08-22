/** @type {import('next').NextConfig} */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   config.plugins.push(
  //     new CopyPlugin({
  //       patterns: [
  //         {
  //           from: path.join(__dirname, "node_modules/tinymce"),
  //           to: path.join(__dirname, "public/lib/tinymce"),
  //         },
  //       ],
  //     })
  //   );
  //   return config;
  // },
  // webpackDevMiddleware: (config) => {
  //   return config;
  // },
};

module.exports = nextConfig;
