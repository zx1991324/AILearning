Page({
  data: {
    deviceId: '',
    connected: false,
    lightLevel: 50,
    autoMode: false
  },

  onLoad: function() {
    this.initBluetooth()
  },

  initBluetooth: function() {
    wx.openBluetoothAdapter({
      success: (res) => {
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        wx.showToast({
          title: '请填开蓝牙',
          icon: 'none'
        })
      }
    })
  },

  startBluetoothDevicesDiscovery: function() {
    wx.startBluetoothDevicesDiscovery({
      services: ['FFF0'],
      success: (res) => {
        this.onBluetoothDeviceFound()
      }
    })
  },

  onBluetoothDeviceFound: function() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (device.name === 'BeautyLight') {
          this.setData({
            deviceId: device.deviceId
          })
          this.connectDevice()
        }
      })
    })
  },

  connectDevice: function() {
    wx.createBLEConnection({
      deviceId: this.data.deviceId,
      success: (res) => {
        this.setData({
          connected: true
        })
        wx.showToast({
          title: '连接成功',
          icon: 'success'
        })
      }
    })
  },

  adjustLight: function(e) {
    const value = e.detail.value
    this.setData({
      lightLevel: value
    })
    if (this.data.connected) {
      // 发送亮度调整命令
      this.sendLightCommand(value)
    }
  },

  toggleAutoMode: function() {
    this.setData({
      autoMode: !this.data.autoMode
    })
    if (this.data.connected) {
      // 发送自动模式切换命令
      this.sendAutoModeCommand(this.data.autoMode)
    }
  },

  sendLightCommand: function(level) {
    const buffer = new ArrayBuffer(2)
    const dataView = new DataView(buffer)
    dataView.setUint8(0, 0x01) // 命令类型：调整亮�度
    dataView.setUint8(1, level) // 亮度值
    
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: 'FFF0',
      characteristicId: 'FFF1',
      value: buffer,
      success: (res) => {
        console.log('发送设备成功')
      },
      fail: (res) => {
        console.error('发送失败', res)
      }
    })
  },

  sendAutoModeCommand: function(enabled) {
    const buffer = new ArrayBuffer(2)
    const dataView = new DataView(buffer)
    dataView.setUint8(0, 0x02) // 命令类型：自动模式
    dataView.setUint8(1, enabled ? 0x01 : 0x00) // 开启／关闭
    
    wx.writeBLECharacteristicValue({
      deviceId: this.data.deviceId,
      serviceId: 'FFF0',
      characteristicId: 'FFF1',
      value: buffer,
      success: (res) => {
        console.log('发送设备成功')
      },
      fail: (res) => {
        console.error('发送失败', res)
      }
    })
  },

  onUnload: function() {
    if (this.data.connected) {
      wx.closeBLEConnection({
        deviceId: this.data.deviceId
      })
    }
    wx.closeBluetoothAdapter()
  }
})