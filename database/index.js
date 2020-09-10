const mongoose = require("mongoose");

function createConnection() {
  return mongoose.connect("mongodb://localhost:27017/tambola", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}

async function cleanDB(models = []) {
  if (!Array.isArray(models)) {
    return new Error(` expected argument of type Array, got ${typeof models}`);
  }
  if (models.length < 1) {
    return true;
  }

  return await Promise.all(models.map((model) => model.deleteMany({})));
}

module.exports = function (models = [], reset = false) {
  createConnection()
    .then(async () => {
      if (reset) {
        await cleanDB(models);
        return console.log("DB refreshed !");
      }

      return console.log("DB connected");
    })
    .catch((error) => console.error(error));
};
