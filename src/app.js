const loaders = require("./loaders");

const startDevice = () => {
    require('dotenv').config()
  loaders();
};
startDevice();