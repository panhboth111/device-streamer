const mongoose = require("mongoose");
module.exports = async () => {
  const DB_CONNECTION = process.env.DB_CONNECTION
  const connection = await mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  return connection.connection.db;
};