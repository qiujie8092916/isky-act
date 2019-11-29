"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var loadingContainerEl = document.getElementById('loadingContainer');
var loadingEl = document.getElementById('loading');
var loginEl = document.getElementsByClassName('register')[0];
var headerEl = document.getElementById('header');
var toastEl = document.getElementById('toast');
var toastMsgEl = document.getElementById('toastMsg');
var redeemElList = [document.getElementById('redeem1'), document.getElementById('redeem2')];
var redeemStatusList = [1, 1];

function isJSONString(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      return !!(_typeof(obj) == 'object' && obj);
    } catch (e) {
      return false;
    }
  }
}

function getHeader(callback) {
  if (Iron.utils.UtilDevice.isApp()) {
    Iron.bridge.appGetHeader(function (header) {
      callback(header);
    });
  } else {
    var headerJSONString = decodeURIComponent(Iron.utils.UtilCommon.urlQuery('header'));

    if (isJSONString(headerJSONString)) {
      callback(JSON.parse(headerJSONString));
    } else {
      callback();
      console.error("header from urlQuery is not a json string");
    }
  }
}

function showToast(msg) {
  if (Iron.utils.UtilDevice.isApp()) {
    Iron.bridge.appToast(msg);
  } else {
    toastMsgEl.innerText = msg;
    toastEl.style.display = 'block';
    setTimeout(function () {
      toastEl.style.display = 'none';
      toastMsgEl.innerText = '';
    }, 1200);
  }
}

var animation = bodymovin.loadAnimation({
  container: loadingEl,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: './loading.json'
});

function showLoading() {
  loadingContainerEl.style.display = 'flex';
}

function hideLoading() {
  loadingContainerEl.style.display = 'none';
}

function back() {
  if (Iron.utils.UtilDevice.isApp()) {
    Iron.bridge.appViewBack();
  } else if (Iron.utils.UtilDevice.isWxMini()) {
    wx.miniProgram.navigateBack();
  }
}

function share() {
  if (Iron.utils.UtilDevice.isApp()) {
    Iron.bridge.appOpenPage('share', {// paramsReqList:[],
      // sharePageCategory:"",
      // sharePageImage:images[0],
      // sharePageType:"wxApp",
    });
  }
}

function toLogin() {
  getHeader(function (_ref) {
    var token = _ref.token;

    if (token) {
      console.error('to login disabled');
    } else {
      if (Iron.utils.UtilDevice.isApp()) {
        Iron.bridge.appOpenPage('login');
      } else if (Iron.utils.UtilDevice.isWxMini()) {
        wx.miniProgram.navigateTo({
          url: '/pages/wxLogin/wxLogin'
        });
      }
    }
  });
}

function toSunrise() {
  if (Iron.utils.UtilDevice.isApp()) {
    Iron.bridge.appOpenPage('sunrise');
  } else if (Iron.utils.UtilDevice.isWxMini()) {
    wx.miniProgram.navigateTo({
      url: '/pages/index/dutyFree/dutyFree'
    });
  }
}

function toCouponCenter() {
  if (Iron.utils.UtilDevice.isApp()) {
    Iron.bridge.appOpenPage('couponList');
  } else if (Iron.utils.UtilDevice.isWxMini()) {
    wx.miniProgram.navigateTo({
      url: '/pages/index/coupon/coupon'
    });
  }
}

function toVipRoomDetail(productId) {
  if (Iron.utils.UtilDevice.isApp()) {
    Iron.bridge.appOpenWebView('https://webapp.iskytrip.com/vipRoomDetail?productId=' + productId);
  } else if (Iron.utils.UtilDevice.isWxMini()) {
    wx.miniProgram.navigateTo({
      url: '/pages/vip/vipRoomDetail/vipRoomDetail?productId=' + productId
    });
  }
}

function queryRedeemCodeStatusByUser(callback) {
  //callback([]) 0：不可领取；1：可领取；2：已领取
  getHeader(function (header) {
    var defaultCallbackData = [1, 1];

    if (header.token) {
      var QueryRedeemCodeStatusByUser =
      /*#__PURE__*/
      function (_Iron$base$BaseModel) {
        _inherits(QueryRedeemCodeStatusByUser, _Iron$base$BaseModel);

        function QueryRedeemCodeStatusByUser() {
          var _this;

          var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          _classCallCheck(this, QueryRedeemCodeStatusByUser);

          _this = _possibleConstructorReturn(this, _getPrototypeOf(QueryRedeemCodeStatusByUser).call(this));
          _this.apiModule = 'marketactivities';
          _this.url = '/redeem/queryRedeemCodeStatusByUser';
          _this.headers = header;
          _this.useProd = true;
          return _this;
        }

        return QueryRedeemCodeStatusByUser;
      }(Iron.base.BaseModel);

      var promise1 = new QueryRedeemCodeStatusByUser();
      var promise2 = new QueryRedeemCodeStatusByUser();
      promise1.setParams({
        codeType: 1
      });
      promise2.setParams({
        codeType: 2
      });
      Promise.all([promise1, promise2].map(function (promise) {
        return promise.execute();
      })).then(function (resultList) {
        callback(resultList.map(function (result) {
          return result.resultData[0].allowStatus;
        }));
      })["catch"](function (err) {
        callback(defaultCallbackData);
      });
    } else {
      callback(defaultCallbackData);
    }
  });
}

function gainRedeemCodeByUser(type) {
  //1锦江	2猫眼
  if (type === 1 && redeemStatusList[0] !== 1) {
    return;
  }

  if (type === 2 && redeemStatusList[1] !== 1) {
    return;
  }

  getHeader(function (header) {
    if (header.token) {
      var GainRedeemCodeByUser =
      /*#__PURE__*/
      function (_Iron$base$BaseModel2) {
        _inherits(GainRedeemCodeByUser, _Iron$base$BaseModel2);

        function GainRedeemCodeByUser() {
          var _this2;

          var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

          _classCallCheck(this, GainRedeemCodeByUser);

          _this2 = _possibleConstructorReturn(this, _getPrototypeOf(GainRedeemCodeByUser).call(this));
          _this2.apiModule = 'marketactivities';
          _this2.url = '/redeem/gainRedeemCodeByUser';
          _this2.headers = header;
          _this2.useProd = true;
          return _this2;
        }

        return GainRedeemCodeByUser;
      }(Iron.base.BaseModel);

      var _gainRedeemCodeByUser = new GainRedeemCodeByUser();

      _gainRedeemCodeByUser.setParams({
        codeType: type
      });

      showLoading();

      _gainRedeemCodeByUser.execute().then(function (result) {
        var msg;
        hideLoading();

        switch (result.resultCode) {
          case '0':
            {
              msg = '领取成功，请注意查收短信';
              refreshStatus();
            }
            ;
            break;

          case '21201001':
            msg = '您已领取过该权益啦';
            break;

          case '21201002':
            msg = '哇哦，权益已被抢光啦';
            break;

          case '21201003':
            msg = '领取失败，请重试';
            break;

          case '21201004':
            msg = '您已领取过该权益啦';
            break;

          default:
            msg = result.errMsg;
            break;
        }

        showToast(msg);
      })["catch"](function (err) {
        hideLoading();
      });
    } else {
      toLogin();
    }
  });
}

function getSignalBarHeight(callback) {
  var height = 0;
  var urlQuerySignalBarHeight = Iron.utils.UtilCommon.urlQuery('signalBarHeight');

  if (urlQuerySignalBarHeight) {
    callback(urlQuerySignalBarHeight);
  } else {
    Iron.bridge.appGetSignalBarHeight(callback);
  }
}

function refreshStatus() {
  queryRedeemCodeStatusByUser(function (statusList) {
    redeemStatusList = statusList;
    redeemStatusList.forEach(function (redeemStatus, index) {
      if (redeemStatus === 0) {
        redeemElList[index].setAttribute('src', redeemElList[index].getAttribute('src').replace(/status.*[.]png$/, 'status0.png'));
      } else if (redeemStatus === 1) {
        redeemElList[index].setAttribute('src', redeemElList[index].getAttribute('src').replace(/status.*[.]png$/, 'status1.png'));
      } else if (redeemStatus === 2) {
        redeemElList[index].setAttribute('src', redeemElList[index].getAttribute('src').replace(/status.*[.]png$/, 'status2.png'));
      }
    });
  });
}

Iron.ready(function () {
  Iron.bridge.airportLoading();
  getSignalBarHeight(function (height) {
    height = parseFloat(height);
    headerEl.style.paddingTop = height + 'px';
  });
  refreshStatus();

  if (Iron.utils.UtilDevice.isWechat()) {// wx.updateAppMessageShareData({
    //     title: '', // 分享标题
    //     desc: '', // 分享描述
    //     link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: '', // 分享图标
    // });
    // wx.updateTimelineShareData({
    //     title: '', // 分享标题
    //     link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: '', // 分享图标
    // });
  } else {
    headerEl.style.display = 'flex';
  }
});
