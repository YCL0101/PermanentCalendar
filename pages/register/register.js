//注册页面
var app = getApp();
var host = app.globalData.host;
Page({
  data: {
    nickName: '',
    passWord: '',
    phone: ''
  },
  register(e) {
    console.log("注册")
    var e = e.detail.value
    var nickName = e.nickName
    var phone = e.phone
    var passWord = e.passWord
 

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

        url: host + 'api/register',
        method: 'POST',
        data: {
          phone: phone,
          nickName: nickName,
          passWord: passWord
        },
        success: function (res) {
          console.log('请求成功', res.data);
          var success=res.data.success;
          var message=res.data.message;
          console.log('请求成功', success);
          // 处理成功响应
          if(success){
            console.log('63');
             wx.showToast({
              icon: 'none',
              title: '注册成功'
            }),
            wx.navigateBack({
              delta: 2
            })
          }else{
            wx.showToast({
              icon: 'none',
              title: message,
            })
          }
         
        },
        fail: function (error) {
          console.log('请求失败', error);
          // 处理失败响应
        }
      });
    }


  }
})