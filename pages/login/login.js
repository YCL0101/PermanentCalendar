var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    passWord: '',
    phone: ''
  },
  login(e) {
    //获取页面信息
    // 获取页面信息
    var e = e.detail.value;
    var phone = e.phone;
    var passWord = e.passWord;

    // 手机号格式验证的正则表达式
    var phoneRegex = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    // 密码长度
    var passwordLength = 6;

    // 输入检验
    if (!phone || !passWord) {
      wx.showToast({
        icon: 'none',
        title: '信息不可为空！',
      });
      return false;
    } else if (!phoneRegex.test(phone)) {
      // phoneRegex.test(phone) 是一个正则表达式的方法
      wx.showToast({
        icon: 'none',
        title: '手机号格式不正确！',
      });
      return false;
    } else if (passWord.length !== passwordLength) {
      // 密码长度验证
      wx.showToast({
        icon: 'none',
        title: '密码长度必须为' + passwordLength + '位！',
      });
      return false;
    } else {
      wx.request({
        url: host + 'api/login',
        method: 'GET',
        data: {
          phone: phone,
          passWord: passWord
        },
        // 处理成功响应
        success: function (res) {
          // console.log('请求成功', res);
          // setStorageSync将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容
          wx.setStorageSync('userinfo', res.data);
          console.log('请求成功', res.data);
          var success = res.data.success;
          console.log(phone);
          console.log(success);
          // 登录失败
          if (success === false) {
            wx.showToast({
              icon: 'none',
              title: '账号或密码有误',
            });
          } else {
            // // 登录成功，nickName写入全局
            // app.globalData.nickName = res.data.nickName;
            // console.log("login" + app.globalData.nickName);
            //返回我的
            wx.reLaunch({
              url: '../me/me',
            });
          }
        },
        // 处理失败响应
        fail: function (error) {
          console.log('请求失败', error);
        }
      });
    }

  },
  //注册跳转
  register() {
    wx.navigateTo({
      url: '../register/register',
    })
  }
})