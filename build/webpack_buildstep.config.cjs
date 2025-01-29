module.exports = {
  entry: {
    "exportStep/config": "../template/config.js",
  },
  experiments: {
    outputModule: true,
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/../dist",
    library: { type: "module" },
  },
  optimization: {
    // minimize: false,
  },
  stats: "verbose",
  // mode: "development",
};
