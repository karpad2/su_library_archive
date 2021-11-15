const path = require("path");

module.exports = {
  entry: "/src/index.js",
  target: "node14",
  externals: {
    "firebase-functions": "commonjs2 firebase-functions",
  },
  output: {
    path: path.resolve(__dirname, "../functions"),
  },
};
