<template>
  <div class="jo-index" v-show="showHtml">
    <div class="header">
      <div>
        <div class="head-portrait">
          <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_portrait.png" alt="">
        </div>
        <div class="header-main">
          <h4>当前机器号：<span>{{machine_no}}</span></h4>
          <div class="game game-coins">
            <i class="iconfont icon-jinbi"></i>
            <span>游戏币:</span><span class="coins-num">{{user.coins}}</span>
          </div>
          <div class="game game-quan" v-show="user.game_ticket>0">
            <i class="iconfont icon-quan"></i>
            <span>免费券:</span><span class="coins-num">{{user.game_ticket}}</span>
          </div>
          <div class="kefu">
            <a id="support" href="tel:0755-32904117" @click="support">
              <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_kefu.png" alt="">
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div>
        <div class="activitys" v-if="coupons.length>0 && imgscurrent.length>0">
          <div v-for="(item,index) in coupons" v-if="item.coupon != void 0">
            <img v-if="item.coupon.status == 0" :src="imgscurrent[index].img_receive" alt=""
                 @click="consumer(index,item.coupon.id,item.coupon.type,item.coin_price.type)"/>
            <img v-else-if="item.coupon.status == 1" :src="imgscurrent[index].img_use" alt=""
                 @click="useCoupons(index,item.coupon.id,item.coin_price.coin_price_id,item.coupon.type,item.coin_price.coin_num,item.coin_price.type)"/>
            <img v-else="" :src="imgscurrent[index].img_already_use" @click="useInfinite(item.coin_price.type)" alt="">

            <!--免费-->
            <span v-if="item.coupon.type == 2 && item.coin_price.type == 0" class="quan_game_num">{{item.coin_price.coin_num/info.coin_num}}次</span>
            <span v-if="item.coupon.type != 2 && item.coin_price.type == 0" class="quan_game_num">优惠</span>
            <span v-if="item.coin_price.type == 1" class="quan_game_num">无限</span>
            <!--免费-->
            <!--打折前的价格-->
            <span style="pointer-events: none;" v-if="item.coupon.type != 2" class="cost-price">{{item.coin_price.coin_price}}元</span>
            <!--打折后的价格-->
            <span style="pointer-events: none;" v-if="item.coin_price.type == 0 && item.coupon.type==1" class="put-tip">{{(item.coin_price.coin_price - item.coupon.reduce).toFixed(1)}}元</span>
            <span style="pointer-events: none;" v-if="item.coin_price.type == 0 && item.coupon.type==0 " class="put-tip">{{(item.coin_price.coin_price*item.coupon.reduce/100).toFixed(1)}}元</span>
            <!--中间的提示-->
            <p class="infinity-tip" style="pointer-events: none;">
              <span v-if="item.coin_price.type == 1 && item.coupon.type==1">{{(item.coin_price.coin_price - item.coupon.reduce).toFixed(1)}}元</span><span v-if="item.coin_price.type == 1 && item.coupon.type==0">{{(item.coin_price.coin_price*item.coupon.reduce/100).toFixed(1)}}元</span><span>{{item.coupon.title}}</span>
            </p>
            <img v-if="item.coupon.status == 2" class="used" src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/used.png" alt="">
          </div>
        </div>
        <div class="center">
          <h3 @click="handleScanQRCode" id="change_device">扫码更换机器<i class="iconfont icon-go"></i></h3>
          <button class="startgame" :class="{'hasclick':start_desc == '投币中'}" id="coin-operated"
                  @click="handleStartingDevice">{{start_desc ? start_desc : '投币启动'}}
          </button>
          <div class="game-num norecharge" v-if="user.coins<=0 && user.game_ticket<=0">您还没有游戏币，请先充值<span></span></div>
          <div class="game-num" v-else>
            <i id="coin_reduce" class="iconfont icon-jianhao" @click="handlerGameNum('-')" :class="{
                     'active': gameNum === 1
                 }"></i>
            <div>
              <h3>{{gameNum * info.coin_num}}币</h3>
              <p>可玩{{gameNum}}次游戏</p>
            </div>
            <i id="coin_add" class="iconfont icon-jiahao" @click="handlerGameNum('+')" :class="{
                     'active': ((gameNum + 1) * info.coin_num) > (user.coins+user.game_ticket*info.coin_num)
                 }"></i>
          </div>
          <img v-if="start_desc=='投币中'" class="tbz" src="../assets/imgs/tbz.gif" alt="">
          <img v-show="is_lamp_after && start_desc=='投币启动'" class="tbz" src="../assets/imgs/btcg.gif" alt="">
          <div class="tip">
            <p v-show="user.coins<=0 && user.game_ticket<=0">充值后点击“投币启动”按钮开始游戏</p>
            <p v-show="is_lamp_after && start_desc=='投币启动'">投币成功，<span>“摇动游戏杆”</span>即可开始游戏</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <joPay @alertTip="changeTip"></joPay>
    </div>
    <div class="bg" v-show="bgShow">
      <div class="bg-center" v-if="contentShow == 'free'">
        <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_after.png" alt="" style="width: 100%;margin: 0.62rem 0 0 0">
        <button class="btnTip bg-center-btn1" @click="useCoupons(0,coupons[0].coupon.id,coupons[0].coin_price.coin_price_id,coupons[0].coupon.type,coupons[0].coin_price.coin_num,coupons[0].coin_price.type)"></button>
        <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close" @click="closeBg">
      </div>

      <div class="bg-center1" style="padding: 0 0.24rem;" v-if="contentShow == 'infinityTip'">
        <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/infinity-after.png" alt="" style="width: 100%;margin: 0.62rem 0 0 0">
        <button class="btnTip bg-center-btn3" @click="useCoupons(1,currentCoupon.coupon.id,currentCoupon.coin_price.coin_price_id,currentCoupon.coupon.type,currentCoupon.coin_price.coin_num,currentCoupon.coin_price.type)"></button>
        <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close" @click="closeBg">
        <span v-if="currentCoupon.coin_price.type == 1" class="cost-price-bg">{{currentCoupon.coin_price.coin_price}}</span>
        <span style="pointer-events: none;" class="infinity-tip-bg" v-if="currentCoupon.coin_price.type == 1 && currentCoupon.coupon.type==1">{{(currentCoupon.coin_price.coin_price - currentCoupon.coupon.reduce).toFixed(1)}}元无限抓</span>
        <span style="pointer-events: none;" class="infinity-tip-bg" v-if="currentCoupon.coin_price.type == 1 && currentCoupon.coupon.type==0">{{(currentCoupon.coin_price.coin_price*currentCoupon.coupon.reduce/100).toFixed(1)}}元无限抓</span>
      </div>

      <div class="bg-center2"  v-if="contentShow == 'infinity'">
        <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/infinity.png" alt="" style="width: 100%;margin: 0.34rem 0 0 0">
        <button class="btnTip bg-center-btn2" @click="closeBg"></button>
      </div>
      <div style="padding: 0 0.24rem;" class="bg-center3" v-if="contentShow == 'newUser'">
        <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/newUser.png" alt="" style="width: 100%;margin: 0.62rem 0 0 0">
        <button class="btnTip bg-center-btn4" @click="useCoupons(0,currentCoupon.coupon.id,currentCoupon.coin_price.coin_price_id,currentCoupon.coupon.type,currentCoupon.coin_price.coin_num,currentCoupon.coin_price.type)"></button>
        <img src="http://res.catchme.com.cn/imgs-2017-12-29-20-42/icon_close.png" alt="" class="close" @click="closeBg">
        <span class="cost-price-bg">{{currentCoupon.coin_price.coin_price}}元</span>
        <span v-if="currentCoupon.coin_price.type == 0 && currentCoupon.coupon.type==1" class="put-tip-bg">{{(currentCoupon.coin_price.coin_price - currentCoupon.coupon.reduce).toFixed(1)}}元</span>
        <span v-if="currentCoupon.coin_price.type == 0 && currentCoupon.coupon.type==0 " class="put-tip-bg">{{(currentCoupon.coin_price.coin_price*currentCoupon.coupon.reduce/100).toFixed(1)}}元</span>
        <span v-if="currentCoupon.coupon.type != 2 && currentCoupon.coin_price.type != 1" class="newUser-tip-bg">{{currentCoupon.coupon.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import CONFIG from '../config'
  import {mapState} from 'vuex'
  import joPay from './wxpay'
  import {MessageBox} from 'mint-ui'

  export default {
    data() {
      return {
        start_desc: '投币启动',
        gameNum: 1,
        is_start: false,
        is_lamp_after: false,
        is_recharge: false,
        loading_art: '加载更多~',
        load: false,
        max_page: false,
        maskShow: false,
        isShow: '',
        showHtml: false,
        bgShow:false,
        contentShow:'',
        currentCoupon:{},
        imgs: {
          free: {
            img_receive: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_free_un1.png',
            img_use: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_free1.png',
            img_already_use:'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_free_used1.png'
          },
          infinity: {
            img_receive: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_201.png',
            img_use: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_201_use1.png',
            img_already_use: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_card_20_used1.png'
          },
          newUser:{
            img_receive: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_new_un1.png',
            img_use: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_new_use1.png',
            img_already_use: 'http://res.catchme.com.cn/imgs-2017-12-29-20-42/quan_new_used1.png'
          }
        },
        imgscurrent:[]
      }
    },
    created() {
      this.Indicator.open()
    },
    computed: mapState({
      user: state => state.user.user,
      consume: state => state.user.consume,
      machine_no: state => state.user.machine_no,
      info: state => state.user.info,
      coupons: state => state.user.coupons
    }),
    components: {
      joPay
    },
    mounted() {
      this.$store.dispatch('judgeMachine')
      this.$store.dispatch('getCoupons').then((res)=>{
        for(var i=0;i<res.length;i++){
            if(res[i].coin_price.type ==1){
              this.imgscurrent.push(this.imgs.infinity);
            }else {
              switch (res[i].coupon.style) {
                case 1:  this.imgscurrent.push(this.imgs.newUser);break;
                case 2: this.imgscurrent.push(this.imgs.free);break;
                case 3: this.imgscurrent.push(this.imgs.infinity);break;
                default:this.imgscurrent.push(this.imgs.newUser);break;
              }
            }
          }
      })
      this.$store.dispatch('getUser')
        .then(() => {
          this.Indicator.close()
          this.showHtml = true
        })
    },
    methods: {
      changeTip(){
        this.bgShow = true;
        this.contentShow = 'infinity';
        this.is_lamp_after = true
        setTimeout(() => {
          this.is_lamp_after = false
        }, 60000)
      },
      closeBg(){
        this.bgShow = false;
      },
      //领取优惠券
      consumer(index, coupon_id,coupon_type,type) {
        this.$store.dispatch('consumer', {coupon_id: coupon_id}).then(() => {
          if(coupon_type == 2){
            this.bgShow = true;
            this.contentShow = 'free';
          }else if(type==1){
            this.bgShow = true;
            this.contentShow = 'infinityTip';
          }else {
            this.bgShow = true;
            this.contentShow = 'newUser';
          }
          this.currentCoupon = this.coupons[index];
          this.coupons[index].coupon.status = 1;
        })
      },
      useCoupons(index, coupon_id, coin_price_id, coupon_type, coin, type) {
        if (coupon_type == 2) {
          this.$store.dispatch('getFreeCoin', {coin_price_id: coin_price_id, coupon_id: coupon_id}).then((data) => {
            this.$store.commit('setCoins', coin)
            this.bgShow = false;
            this.$store.dispatch('getCoupons')
          });
        } else {
          var self = this;
          if (CONFIG.isAlipay) {
            this.$store.dispatch('getPayAlipay', {coin_price_id: coin_price_id, coupon_id: coupon_id}).then((data) => {
              AlipayJSBridge.call("tradePay", {
                tradeNO: data.data.trade_no
              }, function (result) {
                if (result.resultCode == '9000') {
                  if (type != 1) {
                    self.$store.commit('setCoins', coin)
                  } else {
                    //type为1是无限模式
                    self.$store.dispatch('InfiniteGame').then(() => {
                      self.bgShow = true;
                      self.contentShow = 'infinity';
                      self.is_lamp_after = true
                      setTimeout(() => {
                        self.is_lamp_after = false
                      }, 60000)
                    });
                  }
                  self.$store.dispatch('getCoupons')
                }
              });
            })
          } else if (CONFIG.isWx) {
            this.$store.dispatch('getPayJssdk', {coin_price_id: coin_price_id, coupon_id: coupon_id})
              .then((data) => {
                if (data.status_code === 200) {
                  const d = data.data
                  wx.chooseWXPay({
                    timestamp: d.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: d.nonceStr, // 支付签名随机串，不长于 32 位
                    package: d.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                    signType: d.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: d.paySign, // 支付签名
                    success: function (res) {
                      if (type != 1) {
                        self.$store.commit('setCoins', coin);
                        self.bgShow = false;
                      } else {
                        self.$store.dispatch('InfiniteGame').then(()=>{
                          self.bgShow = true;
                          self.contentShow = 'infinity';
                          self.is_lamp_after = true
                          setTimeout(() => {
                            self.is_lamp_after = false
                          }, 60000)
                        });
                      }
                      self.$store.dispatch('getCoupons')
                    }
                  })
                }
              })
          }
        }
      },
      useInfinite(type) {
        if (type == 1 && this.user.coin_infinite > 0) {
          this.$store.dispatch('InfiniteGame');
        }
      },
      handlerGameNum(x) {
        if (x === '-') {
          if (this.gameNum === 1) return false;
          this.gameNum--;
          _hmt.push(['_trackEvent', '减币', '点击', '', '']);
        } else {
          if (((this.gameNum + 1) * this.info.coin_num) > (this.user.coins + this.info.coin_num * this.user.game_ticket)) {
            if (this.user.coins < this.info.coin_num) this.openRecharge('recharge')
            return false
          }
          this.gameNum++;
          _hmt.push(['_trackEvent', '加币', '点击', '', '']);
        }
      },
      //投币，开始游戏
      handleStartingDevice() {
        if (this.info.online == 0) {
          MessageBox.alert('设备离线请扫码更换机器', '提示').then(() => {
            this.handleScanQRCode();
          });
          return
        }
        if (this.is_start) {
          return
        } else {
          this.is_start = true
          this.is_lamp_after = false
          this.start_desc = '投币中'
          if (this.user.game_ticket + this.user.coins < this.info.coin_num) {
            this.start_desc = '';
            this.is_start = false
            MessageBox.alert('余额不足，请充值', '提示').then(() => {
            });
            return false
          }
          //添加百度统计
          _hmt.push(['_trackEvent', '主按钮投币', '点击', '投币-游戏次数-' + this.gameNum, '']);
          this.$store.dispatch('startingDevice', this.gameNum * this.info.coin_num)
            .then(() => {
              this.is_lamp_after = true
              this.is_start = false
              this.start_desc = '投币启动'
              this.gameNum = 1;
              this.isHasHistory = true;
              setTimeout(() => {
                this.is_lamp_after = false
              }, 12000 * this.gameNum)
            })
            .catch(() => {
              this.is_start = false
              this.start_desc = '投币启动'
            })
        }
      },
      handleScanQRCode() {
        _hmt.push(['_trackEvent', '扫码更换机器', '点击', '', '']);//添加百度统计
        if (CONFIG.isAlipay) {
          ap.scan(function (res) {
            window.location.href = res.code
          })
        } else {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              window.location.href = result
            },
            error: function () {
              alert('扫码失败')
            }
          })
        }
      },
      support() {
        _hmt.push(['_trackEvent', '客服', '点击', '', '']);
      },
    }
  }
</script>

<style scoped>

  .infinity-tip-bg{
    position: absolute;
    font-size: 0.5rem;
    color: #fff;
    left: 3rem;
    top:5.2rem;
  }
  .newUser-tip-bg{
    position: absolute;
    font-size: 0.5rem;
    color: #fff;
    left: 3rem;
    top:5.2rem;
  }
  .cost-price-bg{
    position: absolute;
    left: 4.8rem;
    top:4.4rem;
    color: #fff;
    font-size: 0.5rem;
    text-decoration: line-through;
  }
  .put-tip-bg{
    position: absolute;
    left: 3rem;
    top:4.4rem;
    color: #fff;
    font-size: 0.5rem;
  }
  .bg{
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  .bg-center{
    padding: 0 0.4rem;
  }
  .close{
    width: 0.82rem;
    height: 0.82rem;
    margin: 0.4rem 0 0 0;
  }
  .btnTip{
    width:5rem;
    height: 1.04rem;
    border: none;
    outline: none;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .bg-center-btn1{
    background: url('http://res.catchme.com.cn/imgs-2017-12-29-20-42/press_useit.png') no-repeat;
    background-size:100% 100%;
    top: 7.2rem;
  }
  .bg-center-btn3{
    background: url('http://res.catchme.com.cn/imgs-2017-12-29-20-42/press_useit.png') no-repeat;
    background-size:100% 100%;
    top: 8.1rem;
  }
  .bg-center-btn4{
    background: url('http://res.catchme.com.cn/imgs-2017-12-29-20-42/press_useit.png') no-repeat;
    background-size:100% 100%;
    top: 8.1rem;
  }
  .bg-center-btn2{
    background: url('http://res.catchme.com.cn/imgs-2017-12-29-20-42/press_know.png') no-repeat;
    background-size:100% 100%;
    top: 10rem;
  }

  .jo-index {
    position: relative;
    width: 100%;
    height: 100%;
    /*padding: 0 0.22rem;*/
    background: url("http://res.catchme.com.cn/imgs-2017-12-29-20-42/bg.png");
    background-size: 100% 100%;
    overflow: auto;
  }

  * {
    box-sizing: border-box;
  }

  .header {
    width: 100%;
    height: 12%;
    min-height: 1.4rem;
    /*background: red;*/
    position: relative;
  }

  .header > div {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 0 0 0.22rem;
  }

  .header .head-portrait {
    width: 1.12rem;
    height: 1.12rem;
    background: #feccbc;
    border-radius: 50%;
    position: relative;
  }

  .header .head-portrait img {
    width: 80%;
    max-height: 80%;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
  }

  .header .header-main {
    width: 100%;
    padding: 0 0.22rem 0 1.22rem;
    position: absolute;
    left: 0;
    top: 0;
  }

  .header .header-main h4 {
    font-size: 0.24rem;
    color: #ffe7e0;
    line-height: 0.44rem;
    /*margin: 0.04rem 0 0 0;*/
    text-indent: 0.15rem;
  }

  .header .header-main .game {
    height: 0.62rem;
    padding: 0 0.24rem 0 0.14rem;
    line-height: 0.64rem;
    border-radius: 0.31rem;
    background: #ffe7e0;
    float: left;
  }

  .header .header-main .game i {
    font-size: 0.4rem;
    color: #fe5f5b;
    font-weight: 500;
    text-align: center;
  }

  .header .header-main .game span {
    font-size: 0.28rem;
    color: #fe5f5b;
    display: inline-block;
    vertical-align: top;
  }

  .header .header-main .game span.coins-num {
    font-size: 0.36rem;
    color: #fe5f5b;
    font-weight: 600;
    margin: 0 0 0 0.1rem;
  }

  .header .header-main .game-quan {
    margin: 0 0 0 0.2rem;
  }

  .header .header-main .kefu {
    width: 0.62rem;
    height: 0.62rem;
    background: #ffe7e0;
    border-radius: 50%;
    float: right;
    position: relative;
  }

  .header .header-main .kefu a {
    display: block;
    width: 100%;
    height: 100%;
  }

  .header .header-main .kefu img {
    width: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin: 0 0.22rem 0 0;
  }

  .main {
    width: 100%;
    height: 60%;
    min-height: 7rem;
    /*height: calc(100% - 4.98rem);*/
    position: relative;
  }

  .main .activitys {
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  .main > div {
    width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 0.22rem;
  }

  .main .activitys img {
    width: 3.42rem;
    max-height: 1.78rem;
    display: block;
    float: left;
  }
  .main .activitys .used {
    width: 1.81rem;
    position: absolute;
    right: -0.4rem;
    top:0.6rem;
    z-index: 3;
  }
  .main .activitys .infinity-tip{
    color: #fff;
    position: absolute;
    left: 1.24rem;
    top: 0.7rem;
    font-size: 0.34rem;
    line-height: 0.34rem;
  }
  .main .activitys .put-tip{
    color: #fff;
    position: absolute;
    left: 1.24rem;
    top: 0.26rem;
    font-size: 0.34rem;
    line-height: 0.34rem;
  }
  .main .activitys .cost-price{
    color: #fff;
    text-decoration: line-through;
    font-size: 0.34rem;
    line-height: 0.34rem;
    position: absolute;
    /*right: 0.3rem;*/
    right: 0.12rem;
    top:0.26rem;
  }
  .main .activitys .quan_game_num{
    position: absolute;
    left: 0.37rem;
    top:0.68rem;
    width: 0.5rem;
    text-align: center;
    color: #fff;
  }
  .main .activitys > div:first-of-type {
    float: left !important;
  }

  .main .activitys > div {
    float: left;
    position: relative;
    overflow: hidden;
  }

  .main .activitys > div:last-of-type {
    float: right;
  }

  .main .center {
    width: 100%;
    /*height: 5rem;*/
    background: #fff;
    margin: 0.32rem 0 0 0;
    padding: 0.28rem 0.2rem 0 0.2rem;
    border-radius: 10px;
    position: relative;
  }

  .main .center .tbz {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .main .center h3 {
    font-size: 0.32rem;
    color: #fd643b;
    line-height: 0.32rem;
    margin: 0 0 0.1rem 0;
  }

  .main .center .startgame {
    width: 3.06rem;
    height: 3.06rem;
    background: url("http://res.catchme.com.cn/imgs-2017-12-29-20-42/press_begin.png");
    background-size: 100% 100%;
    border: none;
    outline: none;
    font-size: 0.5rem;
    color: #fff;
    display: block;
    margin: 0 auto;
    position: relative;
    z-index: 6;
  }

  .main .center .hasclick {
    background: url("http://res.catchme.com.cn/imgs-2017-12-29-20-42/press_ing.png");
    background-size: 100% 100%;
  }

  .main .center .game-num {
    width: 4.18rem;
    height: 0.93rem;
    border: 1px solid #ff784e;
    border-radius: 0.18rem;
    font-size: 0.24rem;
    line-height: 0.91rem;
    margin: -0.63rem auto 0 auto;
    background: #fff;
    color: #7e7e7e;
    text-align: center;
    position: relative;
    z-index: 6;
  }

  .main .center .game-num.norecharge {
    border: 1px solid #afafaf;
  }

  .main .center .game-num i.active {
    color: #c8c8c8;
  }

  .main .center .game-num i {
    /*width: 0.81rem;*/
    width: 20%;
    float: left;
    font-size: 0.5rem;
    color: #ff784e;
    text-align: center;
    height: 0.67rem;
    line-height: 0.67rem;
    border-right: 1px solid #ff784e;
    margin: 0.1rem 0;
  }

  .main .center .game-num i:last-of-type {
    border-right: none;
    border-left: 1px solid #ff784e;
  }

  .main .center .game-num > div {
    /*width: calc(100% - 1.62rem);*/
    width: 60%;
    float: left;
    text-align: center;
  }

  .main .center .game-num > div h3 {
    font-size: 0.42rem;
    color: #ff784e;
    font-weight: 600;
    line-height: 0.42rem;
    margin: 0.06rem 0 0.08rem 0;
  }

  .main .center .game-num > div p {
    font-size: 0.24rem;
    color: #7e7e7e;
    line-height: 0.24rem;
  }

  .main .center .tip {
    height: 0.84rem;
  }

  .main .center .tip > p {
    font-size: 0.24rem;
    color: #7e7e7e;
    line-height: 0.64rem;
    text-align: center;
  }

  .main .center .tip > p > span {
    font-weight: 600;
    color: black;
  }

  .footer {
    width: 100%;
    /*height: 3.4rem;*/
    /*height: 28%;*/
    height: 28%;
    min-height: 3.3rem;
    position: relative;
    /*padding: 0.36rem 0.22rem 0 0.22rem;*/
    overflow: hidden;
  }
</style>
