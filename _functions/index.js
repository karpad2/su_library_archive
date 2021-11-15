const functions = require("firebase-functions");
const {
  makeStaticHandlers,
  makeHotHandlers,
  makeWebpackConfig,
} = require("webpack-cloud-functions");
const path = require("path");

let hotHandlers;
if (process.env.NODE_ENV === "production") {
  hotHandlers = makeStaticHandlers(require("./main.js").default());
} else {
  hotHandlers = makeHotHandlers(
    makeWebpackConfig({
      mode: "development",
      context: path.resolve(__dirname, ".."),
      ...require("../scripts/webpackOptions.js"),
    })
  );
}

exports.sitemapHandler = functions.https.onRequest(
  hotHandlers.getHandler("sitemapHandler")
);


exports.renderpdftoimage=functions.runWith({
  timeoutSeconds: 540,
  memory: "4GB"
})
.storage.object().onFinalize(hotHandlers.getHandler("pdfHandler"));
