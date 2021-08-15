const atlasdb = require("./atlasdb");

if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI: atlasdb
  }
} else {
  module.exports = {
    mongoURI: "mongodb://localhost/blogapp"
  }
}