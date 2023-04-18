const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const devMode = argv.mode === "development";

  return {
    entry: {
      app: "./src/main.js",
    },
    output: {
      filename: devMode ? "[name].js" : "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    devtool: "source-map",
    devServer: {
      static: "./dist",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env"]],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
            "postcss-loader",
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? "[name].css" : "[name].[contenthash].css",
      }),
      new CopyPlugin({
        patterns: [
          { from: "./src/api", to: path.resolve(__dirname, "dist/api") },
        ],
      }),
    ],
  };
};
