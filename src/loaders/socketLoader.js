const io = require("socket.io-client")
const usb = require("usb-detection");
const Device = require("../models/Device");
const Service = require("../utilities/Service");
module.exports = () => {
    const SERVER = process.env.SERVER
    const socket = io(SERVER)
    usb.startMonitoring();
    const service = new Service(Device,socket)
    socket.on("connect", async () => {
      const device = await service.initSocket(usb);
      socket.emit("device_info", device);
    });
    socket.on("update_info", async (data) => {
      await service.handleUpdateInfo(data);
    });
    socket.on("start_streaming", async (data) => {
      await service.handleStartStream(socket, data);
    });
    socket.on("start_casting", async(streamCode)=> {
      await service.handleStartCast(streamCode)
    })
};