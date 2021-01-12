const mongooseLoader = require("./mongooseLoader");
const socketIOLoader = require("./socketLoader");
module.exports = async () => {
  await mongooseLoader();
  console.log("Database initialized");
  await socketIOLoader();
  console.log("Socket.io initialized");
};