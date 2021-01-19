const { Schema, model } = require("mongoose");

const Device = Schema({
  deviceName: {
    type: String,
    default: "CLASSROOM-I",
  },
  deviceId: {
    type: String,
    default: "qwer",
  },
  streaming: {
    type: Boolean,
    default: false,
  },
  cameraPlugged: {
    type: Boolean,
    default: false,
  },
});
module.exports = model("Device", Device);
