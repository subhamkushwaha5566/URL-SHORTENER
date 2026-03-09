const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
async function connectToMongoDB(url) {
  const sanitizedUrl = url.replace(/</g, "").replace(/>/g, "");
  return mongoose.connect(sanitizedUrl);
}

module.exports = {
  connectToMongoDB,
};
