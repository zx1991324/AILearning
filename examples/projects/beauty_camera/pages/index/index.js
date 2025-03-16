// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    motto: 'Hello World',
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    backgroundColor: '#FFD700',
    showColorPicker: false,
    photoPath: '',
    devicePosition: 'front'
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onLoad() {
    // 检查相机权限
    wx.authorize({
      scope: 'scope.camera',
      success: () => {
        console.log('相机权限已获取')
      },
      fail: () => {
        wx.showToast({
          title: '请授权相机权限',
          icon: 'none'
        })
      }
    })
  },
  // 切换颜色选择器
  toggleColorPicker() {
    this.setData({
      showColorPicker: !this.data.showColorPicker
    })
  },
  // 更改背景颜色
  onColorChange(e) {
    this.setData({
      backgroundColor: e.detail.color
    })
  },
  // 拍照
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          photoPath: res.tempImagePath
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '拍照失败',
          icon: 'none'
        })
      }
    })
  },
  // 切换相机前后置
  switchCamera() {
    this.setData({
      devicePosition: this.data.devicePosition === 'back' ? 'front' : 'back'
    })
  },
  // 分享
  onShareAppMessage() {
    return {
      title: '纯色背景拍照',
      path: '/pages/index/index',
      imageUrl: this.data.photoPath
    }
  },
  retake() {
    this.setData({
      photoPath: ''
    })
  },
  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({
      backgroundColor: color
    });
  },
  // 保存照片到相册
  savePhoto() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.photoPath,
      success: () => {
        wx.showToast({
          title: '保存成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.log(err)
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (settingRes) => {
                    console.log(settingRes)
                  }
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'error'
          })
        }
      }
    })
  }
})
