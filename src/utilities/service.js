
const { Builder, By, Key, until } = require("selenium-webdriver");
const chromedriver = require("chromedriver")

module.exports = class Service {
    constructor(deviceModel,socket){
        this.deviceModel = deviceModel
        this.socket = socket
    }
    initSocket = (usb) => {
        return new Promise((resolve) => {
          try {
            usb.find(async (err, pluggedDevices) => {
              const camera = pluggedDevices.find(
                (pluggedDevice) =>
                  pluggedDevice.deviceName == "USB Composite Device"
              );
              const cameraPlugged = camera ? true : false;
              const deviceRegistered = await this.deviceModel.findOne();
              let device;
              if (deviceRegistered)
                device = await this.deviceModel.findOneAndUpdate(
                  {},
                  { streaming: false, cameraPlugged }
                );
              else {
                device = await this.deviceModel.create({ cameraPlugged });
              }
    
              return resolve(device);
            });
          } catch (error) {}
        });
  };
  handleUpdateInfo = async (data) => {
    await this.deviceModel.updateOne({},{...data})
  }
  handleStartStream = async(socket,data) => {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      const { deviceId, streamTitle, description, userEmail } = data;
      await driver.get(process.env.FRONTEND);
      await driver
        .findElement(By.id("usernameInput"))
        .sendKeys(`device-${deviceId}@device.com`);
      await driver.findElement(By.id("passwordInput")).sendKeys("FLIBVC123");
      const loginBtn = await driver.findElement(By.id("loginBtn"));
      loginBtn.click();
      await driver
        .wait(until.elementLocated(By.id("startStreamBtn")))
        .then((el) => el.click());
      await driver
        .wait(until.elementLocated(By.id("title")))
        .then((el) => el.sendKeys(streamTitle));
      await driver
        .wait(until.elementLocated(By.id("owner")))
        .then((el) => el.sendKeys(userEmail));
      await driver
        .wait(until.elementLocated(By.id("descriptionInput")))
        .then((el) => el.sendKeys(description));
      const startBtn = await driver.findElement(By.id("startBtn"));
      startBtn.click();
      await driver
        .wait(until.elementLocated(By.id("streamRoom")))
        .then((el) => {
          socket.emit("redirect", userEmail)
        });
        //socket.emit("redirect", userEmail)
      socket.on("stop_streaming", () => {
        driver.quit();
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  handleStartCast = async(streamCode) => {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
      const device = await this.deviceModel.findOne()
      await driver.get(process.env.FRONTEND);
      await driver
        .findElement(By.id("usernameInput"))
        .sendKeys(`device-${device.deviceId}@device.com`);
      await driver.findElement(By.id("passwordInput")).sendKeys("FLIBVC123");
      const loginBtn = await driver.findElement(By.id("loginBtn"));
      loginBtn.click();
      // const streamBox = await driver.findElement(By.id(streamCode));
      // streamBox.click();
      await driver
        .wait(until.elementLocated(By.id(streamCode)))
        .then((el) => el.click());
      this.socket.on("stop_streaming", () => {
        driver.quit();
      });
    } catch (error) {
      console.log(error.message);
    }
  }

}