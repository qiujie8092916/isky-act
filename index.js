var loadingContainerEl = document.getElementById('loadingContainer');
var loadingEl = document.getElementById('loading');
var loginEl = document.getElementsByClassName('register')[0];
var headerEl = document.getElementById('header');
var toastEl = document.getElementById('toast');
var toastMsgEl = document.getElementById('toastMsg');
var redeemElList = [document.getElementById('redeem1'), document.getElementById('redeem2')];
var redeemStatusList = [1,1];

function isJSONString(str) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str);
            return !!(typeof obj == 'object' && obj);
        } catch (e) {
            return false;
        }
    }
}

function getHeader(callback){
    if(Iron.utils.UtilDevice.isApp()){
        Iron.bridge.appGetHeader(header=>{
            callback(header);
        });
    }else{
        let headerJSONString = decodeURIComponent(Iron.utils.UtilCommon.urlQuery('header'));
        if(isJSONString(headerJSONString)){
            callback(JSON.parse(headerJSONString));
        }else{
            callback();
            console.error("header from urlQuery is not a json string");
        }
    }
}

function showToast(msg){
    if(Iron.utils.UtilDevice.isApp()){
        Iron.bridge.appToast(msg);
    }else{
        toastMsgEl.innerText = msg;
        toastEl.style.display = 'block';
        setTimeout(function(){
            toastEl.style.display = 'none';
            toastMsgEl.innerText = '';
        },1200);
    }
}

var animation = bodymovin.loadAnimation({
    container: loadingEl,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './loading.json'
});

function showLoading(){
    loadingContainerEl.style.display = 'flex';
}

function hideLoading(){
    loadingContainerEl.style.display = 'none';
}

function back(){
    if(Iron.utils.UtilDevice.isApp()){
        Iron.bridge.appViewBack();
    }
    else if(Iron.utils.UtilDevice.isWxMini()){
        wx.miniProgram.navigateBack();
    }
}

function share(){
    if(Iron.utils.UtilDevice.isApp()){
        Iron.bridge.appOpenPage('share',{
            // paramsReqList:[],
            // sharePageCategory:"",
            // sharePageImage:images[0],
            // sharePageType:"wxApp",
        });
    }
}

function toLogin(){
    getHeader(({token})=>{
        if(token){
            console.error('to login disabled');
        }else{
            if(Iron.utils.UtilDevice.isApp()){
                Iron.bridge.appOpenPage('login');
            }
            else if(Iron.utils.UtilDevice.isWxMini()){
                wx.miniProgram.navigateTo({
                    url:'/pages/wxLogin/wxLogin',
                });
            }
        }
    });
}

function toSunrise(){
    if(Iron.utils.UtilDevice.isApp()){
        Iron.bridge.appOpenPage('sunrise');
    }
    else if(Iron.utils.UtilDevice.isWxMini()){
        wx.miniProgram.navigateTo({
            url:'/pages/index/dutyFree/dutyFree',
        });
    }
}

function toCouponCenter(){
    if(Iron.utils.UtilDevice.isApp()){
        Iron.bridge.appOpenPage('couponList');
    }
    else if(Iron.utils.UtilDevice.isWxMini()){
        wx.miniProgram.navigateTo({
            url:'/pages/index/coupon/coupon',
        });
    }
}

function toVipRoomDetail(productId){
    if(Iron.utils.UtilDevice.isApp()){
        Iron.bridge.appOpenWebView('https://webapp.iskytrip.com/vipRoomDetail?productId='+productId);
    }
    else if(Iron.utils.UtilDevice.isWxMini()){
        wx.miniProgram.navigateTo({
            url:'/pages/vip/vipRoomDetail/vipRoomDetail?productId='+productId,
        });
    }
}

function queryRedeemCodeStatusByUser (callback){  //callback([]) 0：不可领取；1：可领取；2：已领取
    getHeader(header=>{
        const defaultCallbackData = [1,1];
        if(header.token){
            class QueryRedeemCodeStatusByUser extends Iron.base.BaseModel{
                constructor(props = {}) {
                    super();
                    this.apiModule = 'marketactivities';
                    this.url = '/redeem/queryRedeemCodeStatusByUser';
                    this.headers = header;
                    this.useProd = true;
                }
            }
            let promise1 = new QueryRedeemCodeStatusByUser();
            let promise2 = new QueryRedeemCodeStatusByUser()
            promise1.setParams({codeType:1});
            promise2.setParams({codeType:2});
            Promise.all([promise1,promise2].map(promise=>promise.execute())).then(resultList=>{
                callback(resultList.map(result=>result.resultData[0].allowStatus));
            }).catch(err=>{
                callback(defaultCallbackData);
            })
        }else{
            callback(defaultCallbackData);
        }
    })
}

function gainRedeemCodeByUser(type){	//1锦江	2猫眼
    if(type === 1 && redeemStatusList[0] !== 1){
        return;
    }
    if(type === 2 && redeemStatusList[1] !== 1){
        return;
    }
    getHeader(header=>{
        if(header.token){
            class GainRedeemCodeByUser extends Iron.base.BaseModel{
                constructor(props = {}) {
                    super();
                    this.apiModule = 'marketactivities';
                    this.url = '/redeem/gainRedeemCodeByUser';
                    this.headers = header;
                    this.useProd = true;
                }
            }
            let gainRedeemCodeByUser = new GainRedeemCodeByUser();
            gainRedeemCodeByUser.setParams({
                codeType:type,
            });
            showLoading();
            gainRedeemCodeByUser.execute().then(result=>{
                let msg;
                hideLoading();
                switch(result.resultCode){
                    case '0':{
                        msg = '领取成功，请注意查收短信'
                        refreshStatus();
                    };break;
                    case '21201001':msg = '您已领取过该权益啦';break;
                    case '21201002':msg = '哇哦，权益已被抢光啦';break;
                    case '21201003':msg = '领取失败，请重试';break;
                    case '21201004':msg = '您已领取过该权益啦';break;
                    default: msg = result.errMsg;break;
                }
                showToast(msg);
            }).catch(err=>{
                hideLoading();
            })
        }else{
            toLogin();
        }
    });
}

function getSignalBarHeight(callback){
    let height = 0;
    const urlQuerySignalBarHeight = Iron.utils.UtilCommon.urlQuery('signalBarHeight');
    if(urlQuerySignalBarHeight){
        callback(urlQuerySignalBarHeight);
    }else{
        Iron.bridge.appGetSignalBarHeight(callback);
    }
}
function refreshStatus(){
    queryRedeemCodeStatusByUser(statusList=>{
        redeemStatusList = statusList;
        redeemStatusList.forEach((redeemStatus,index)=>{
            if(redeemStatus === 0){
                redeemElList[index].setAttribute('src',redeemElList[index].getAttribute('src').replace(/status.*[.]png$/,'status0.png'));
            }
            else if(redeemStatus === 1){
                redeemElList[index].setAttribute('src',redeemElList[index].getAttribute('src').replace(/status.*[.]png$/,'status1.png'));
            }
            else if(redeemStatus === 2){
                redeemElList[index].setAttribute('src',redeemElList[index].getAttribute('src').replace(/status.*[.]png$/,'status2.png'));
            }
        });
    });
}

Iron.ready(function(){
    Iron.bridge.airportLoading();
    getSignalBarHeight(height=>{
        height = parseFloat(height);
        headerEl.style.paddingTop = height + 'px';
    });
    refreshStatus();
    if(Iron.utils.UtilDevice.isWechat()){
        // wx.updateAppMessageShareData({
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
    }else{
        headerEl.style.display = 'flex';
    }
});
