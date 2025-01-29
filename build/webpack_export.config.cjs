module.exports = {
  entry: {
    "export/c3runtime/plugin": "../template/main.js",
    "export/editor": "../template/editor.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/../dist",
  },
  optimization: {
    // minimize: false,
  },
  stats: "verbose",
  // mode: "development",
};
