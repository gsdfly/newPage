import CONFIG from '../config'
import api from './../api/index'

const state = {
  user: {
    avatar: '',
    coins: 0,
    nick_name: '',
    open_id: '',
    player_id: '',
    coin_infinite:false
  },
  coin: [],
  consume: {
    data: [],
    meta: {
      pagination: {}
    }
  },
  info: {
    coin_num: 0
  },
  machine_no: '',
  coupons:[]
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setCoins(state, coin) {
    state.user.coins = state.user.coins + coin
  },
  setCoinList(state, coin) {
    state.coin = coin
  },
  setConsume(state, consume) {
    state.consume = consume
  },
  setMachineNo(state) {
    if (CONFIG.machine_no) {
      state.machine_no = CONFIG.machine_no
    }
  },
  setInfo(state, info) {
    state.info = info
  },
  setInfinite(state,flag){
    state.user.coin_infinite = flag;
  },
  setCoupons(state,coupons){
    state.coupons = coupons
  }
}

const actions = {
  getUser({commit}) {
    return new Promise((success, error) => {
      api.getUser({token:CONFIG.token}).then((data) => {
          commit('setUser', data.data)
          success(data)
      })
    })
  },
  getCoinList({commit}) {
    return new Promise((success, error) => {
      api.getCoinList({
        machine_no: state.machine_no,
        token:CONFIG.token
      }).then((data) => {
          commit('setCoinList', data.data);
          success();
    })})
  },
  getConsume({commit}, page) {
    return new Promise((success, error) => {
      api.getConsume({
        page_index: page.page_index,
        page_size: page.page_size,
        token:CONFIG.token
      }).then((data) => {
          commit('setConsume', data)
          const p = data
          success(p)
      })
    })
  },
  getPayJssdk(ctx,ids) {
    return new Promise((success, error) => {
      if(ids.coupon_id){
        api.getPayJssdk({
          coin_price_id: ids.coin_price_id,
          coupon_id:ids.coupon_id,
          machine_no: ctx.state.machine_no,
          token:CONFIG.token
        }).then((data) => {
          success(data)
        })
      }else {
        api.getPayJssdk({
          coin_price_id: ids.coin_price_id,
          machine_no: ctx.state.machine_no,
          token:CONFIG.token
        }).then((data) => {
          success(data)
        })
      }

    })
  },
  getPayAlipay(ctx,ids){
    return new Promise((success,error)=> {
      if(ids.coupon_id){
        api.getPayAlipay({
          coin_price_id: ids.coin_price_id,
          coupon_id:ids.coupon_id,
          machine_no: ctx.state.machine_no,
          token: CONFIG.token
        }).then((data) => {
          success(data)
        })
      }else {
        api.getPayAlipay({
          coin_price_id: ids.coin_price_id,
          machine_no: ctx.state.machine_no,
          token: CONFIG.token
        }).then((data) => {
          success(data)
        })
      }
    })
  },
  getPayTpp(ctx, id) {
    return new Promise((success, error) => {
      api.getPayTpp({
        coin_price_id: id,
        machine_no: ctx.state.machine_no,
        token:CONFIG.token
      }).then((data) => {
        success(data)
      })
    })
  },
  judgeMachine(ctx) {
    return new Promise((success, error) => {
      api.judgeMachine({
        machine_no: ctx.state.machine_no,
        token:CONFIG.token
      }).then((data) => {
          ctx.commit('setInfo', data.data)
          success(data.data)
      })
    })
  },
  getFreeCoin(ctx, ids) {
    return new Promise((success, error) => {
      if(ids.coupon_id){
        api.getFreeCoin({
            coin_price_id:ids.coin_price_id,
            machine_no:ctx.state.machine_no,
            coupon_id:ids.coupon_id,
            token:CONFIG.token
          }
        ).then((data) => {
          success(data)
        })
      }else {
        api.getFreeCoin({
            coin_price_id:ids.coin_price_id,
            machine_no:ctx.state.machine_no,
            token:CONFIG.token
          }
        ).then((data) => {
          success(data)
        })
      }
    })
  },
  startingDevice(ctx, num) {
    return new Promise((success, error) => {
      api.startingDevice({
        coin_num: num,
        machine_no: CONFIG.machine_no,
        token:CONFIG.token
      }).then((data) => {
        if (data.status_code == 200) {
          var s = ctx.state.user
          s.coins = data.data.coin_total
          s.game_ticket = data.data.game_ticket
          ctx.commit('setUser', s)
          success()
        } else {
          error()
        }
      }).catch((err)=>{
        error(err);
      })
    })
  },
  InfiniteGame(ctx){
    return new Promise((success,error)=>{
      api.InfiniteGame({machine_no:ctx.state.machine_no,token:CONFIG.token}).then((data)=>{
        if (data.status_code == 200) {
          ctx.commit('setInfinite',0);
          success();
        }else {
          ctx.commit('setInfinite',1);
        }
      }).catch((err)=>{
        ctx.commit('setInfinite',1);
        error(err);
      })
    })
  },
  //获取优惠券列表
  getCoupons:function (ctx) {
    return new Promise((success,err)=>{
      api.getCoupons({machine_no:ctx.state.machine_no,token:CONFIG.token}).then((data)=>{
        //对优惠券进行过滤
        var res = data.data;
        var couponsList = [];
        for(var i=0;i<res.length;i++){
          if(res[i].coupon){
            if(res[i].coupon.type == 2 ){
              couponsList.push(res[i]);
            }else if(res[i].coupon.type == 1 && ((res[i].coin_price.coin_price - res[i].coupon.reduce) >0) ){
              couponsList.push(res[i]);
            }else if(res[i].coupon.type == 0 && ((res[i].coin_price.coin_price*res[i].coupon.reduce/100) >0)){
              couponsList.push(res[i]);
            }
          }

        }
        ctx.commit('setCoupons',couponsList)
        success(couponsList)
      })
    })
  },
  //领取优惠券
  consumer:function (ctx,ids) {
    return new Promise((success,error) => {
      api.consumer({coupon_ids:[ids.coupon_id],token:CONFIG.token}).then((data)=>{
        if (data.status_code == 200) {
          success(data)
        }else {
          error(data)
        }
      }).catch((err)=>{
        error(err)
      })
    })
  },
  //使用优惠券
  useCoupons:function (id) {
    return new Promise(() => {
      api.useCoupons({id:id,token:CONFIG.token}).then((data) => {
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
