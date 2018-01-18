<template>
  <div class="recharge-lists clearfix">
    <div v-for="v in coin" :data-id="v.coin_price_id"
         @click="handlePay(v.coin_price_id, v.coin_num,v.status,v.coin_price,v.type)" :class="{'active':v.status==0,'infinity':v.type==1}">
      <div class="recharge-item-t" ><span :class="{'twoCoin':v.coin_num==2}"></span><i v-if="v.type==1">无限币</i><i v-else>{{v.coin_num}}币</i></div>
      <div class="recharge-item-b">{{v.coin_price}}元<span v-if="v.sale_state == 1 && v.original_price">({{v.original_price}}元)</span></div>
      <div class="recharge-hot hot-limit" v-if="v.coin_buy_state==1 && v.status != 0">限购{{v.coin_buy_num}}次</div>
      <div class="recharge-hot hot-top" v-if="v.remarks != null && v.remarks != '' && v.status != 0">{{v.remarks}}</div>
      <div class="recharge-has" v-show="v.status==0">领取过啦</div>
    </div>
  </div>
</template>

<script>
  import {instance} from '../config/common'
  import {mapState} from 'vuex'
  import CONFIG from '../config'
  import {SetCookie} from '../util'

  export default {
    data() {
      return {
        isActive: false,
      }
    },
    computed: mapState({
      user: state => state.user.user,
      coin: state => state.user.coin,
      machine_no: state => state.user.machine_no
    }),
    mounted() {
      this.getCoinList()
    },
    methods: {
      getCoinList() {
        this.$store.dispatch('getCoinList')
      },
      handlePay(id, coin, status, price,type) {
        let self = this
        //status为0不可购买
        if(status === 0){
          return false;
        }
        if (price == '0.00') {
          //免费请求
          this.$store.dispatch('getFreeCoin',{coin_price_id:id}).then((data) => {
            if(data.status_code == 200){
              this.$store.dispatch('getCoinList').then(() => {
                this.$store.dispatch('getUser');
              });
            }
          });
        } else if(type==1 && this.user.coin_infinite > 0){
          this.$store.dispatch('InfiniteGame').then(()=>{
            self.$emit('alertTip');
          });
        }else  {
          if (CONFIG.isAlipay || CONFIG.isTpp) {
            this.$store.dispatch('getPayAlipay',{coin_price_id:id}).then((data)=>{
              AlipayJSBridge.call("tradePay", {
                tradeNO: data.data.trade_no
              }, function(result) {
                if(result.resultCode=='9000'){
                  if(type !=1){
                    self.$store.commit('setCoins', coin)
                    self.getCoinList()
                  }else {
                    self.$store.dispatch('InfiniteGame').then(()=>{
                      self.$emit('alertTip');
                    });
                  }
                }
              });
            })
          } else if (CONFIG.isWx) {
            this.$store.dispatch('getPayJssdk', {coin_price_id:id})
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
                      if(type !=1){
                        self.$store.commit('setCoins', coin)
                      }else {
                        self.$store.dispatch('InfiniteGame').then(()=>{
                          self.$emit('alertTip');
                        });
                      }
                      self.getCoinList()
                    }
                  })
                }
              })
          }
        }
      }
    }
    }
</script>

<style>
  .recharge-lists{
    width: 100%;
    position: absolute;
    left: 0;
    /*bottom: 0.22rem;*/
    bottom: 0;
    padding: 0 0.22rem;
  }
  .recharge-lists > div {
    margin: 0 0 0.22rem 0;
    font-size: 0.36rem;
    float: right;
    width: 3.42rem;
    /*height: 1.28rem;*/
    height: 37.87%;
    border: 1px solid #fd643b;
    border-radius: 0.15rem;
    color: #494949;
    position: relative;
  }
  .recharge-lists .active {
    color: #666;
    border: 1px solid #999;
  }
  .recharge-lists .active .recharge-item-t{
    color: #666;
  }
  .recharge-lists .active .recharge-item-t span{
    background: url("./../assets/imgs/icon_recharge_2bi.png") no-repeat;
    background-size: 100% 100%;
  }
  .recharge-lists .infinity .recharge-item-t span{
    background: url("./../assets/imgs/icon_charge_nbi.png") no-repeat;
    background-size: 100% 100%;
  }
  .recharge-lists .active .recharge-item-b{
    color: #fff;
    background: #999;
  }
  .recharge-lists .active .recharge-item-b span{
    color: #fff;
  }
  .recharge-lists > div:nth-child(odd) {
    float: left;
  }
  .recharge-item-b{
    height: 0.61rem;
    line-height: 0.61rem;
    font-size: 0.32rem;
    background: #fb643b;
    color: #fff;
    border-radius: 0 0 0.15rem 0.15rem;
    text-align: center;
  }
  .recharge-item-b span{
    font-size: 0.24rem;
    text-decoration: line-through;
    margin: 0 0 0 0.1rem;
  }
  .recharge-item-t{
    height: 0.68rem;
    font-size: 0.36rem;
    color: #494949;
    line-height: 0.68rem;
    text-align: center;
    background: #fff;
    border-radius: 0.15rem 0.15rem 0 0;
  }
  .recharge-item-t span{
    width: 0.39rem;
    height: 0.42rem;
    display: inline-block;
    background: url("./../assets/imgs/icon_recharge_bi.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 0.1rem 0 0;
    vertical-align: middle;
  }
  .recharge-item-t span.twoCoin{
    width: 0.32rem;
    height: 0.38rem;
    background: url("./../assets/imgs/icon_recharge_2bi.png") no-repeat;
    background-size: 100% 100%;
  }
  .hot-limit{
    width: 1.3rem;
  }
  .recharge-hot{
    height: 0.44rem;
    line-height: 0.44rem;
    position: absolute;
    left: -0.06rem;
    top:-0.08rem;
    color: #fff;
    background: url("./../assets/imgs/image_limite.png") no-repeat;
    background-size: 100% 100%;
    font-size: 0.2rem;
    text-align: center;
  }
  .recharge-has{
    width: 1.3rem;
    height: 0.44rem;
    position: absolute;
    left: -0.06rem;
    top:-0.08rem;
    color: #fff;
    background: url("./../assets/imgs/bg_used.png") no-repeat;
    background-size: 100% 100%;
    font-size: 0.2rem;
    line-height: 0.44rem;
    z-index: 3;
    text-align: center;
  }
  .hot-top{
    padding: 0 0.26rem 0 0.1rem;
    min-width: 1.3rem;
    z-index: 2;
  }
</style>
