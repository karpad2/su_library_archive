const path = require("path");
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": ["remove-comments"]
  
  //outputDir: path.resolve(__dirname, "./docs")
}
