<template>
  <div class="recharge">
    <div class="head">
      <h4>
        <van-icon @click="$router.back()" class="back" name="arrow-left" color="#fff" />
        <span>充值</span>
      </h4>
      <p>{{ userInfo.gold }}</p>
      <span>我的金币</span>
    </div>
    <h6>请选择充值金额</h6>
    <div class="gold-list">
      <div @click="active=item" :class="{item: true, active: active.id === item.id}" v-for="item in list" :key="item.id">
        <h6>{{ item.gold }}金币</h6>
        <p>¥{{ item.price }}</p>
      </div>
    </div>
    <p class="tips">
      注：通过充值获得的金币不可提现；充值成功后，到账可能会有
      一定的延迟，请您耐心等待
    </p>
    <div class="btn" @click="showPaySelect=true">立即充值</div>
    <van-popup v-model="showPaySelect" position="bottom" :style="{ height: '5.2rem' }">
      <div class="pay">
        <img src="./wechat@2x.png" alt="">
        <span>微信支付</span>
        <div style="flex: 1"></div>
        <van-icon name="arrow" />
      </div>
      <div class="pay">
        <img src="./alipay@2x.png" alt="">
        <span>微信支付</span>
        <div style="flex: 1"></div>
        <van-icon name="arrow" />
      </div>
      <div class="cancel" @click="showPaySelect=false">取消</div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { post } from '../../common/js/http'

export default {
  name: 'recharge',
  data() {
    return {
      list: [],
      active: {},
      showPaySelect: false
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    getList() {
      post('/api/recharge/getPriceList')
        .then(({ data: { data } }) => {
          this.active = data[0]
          this.list = data
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.recharge
  width 100%
  .head
    height 340px
    background url(./chongzhi_bg@2x.png) center center no-repeat
    background-size cover
    text-align center
    &>h4
      position relative
      height 80px
      line-height 80px
      text-align center
      font-size 36px
      color #FFFFFF
      .back
        position absolute
        left 30px
        top 20px
        font-size 33px
    &>p
      margin-top 76px
      margin-bottom 21px
      color #fff
      font-size 60px
      font-weight bold
    &>span
      font-size 26px
      color #FFFFFF
  &>h6
    margin-top 41px
    margin-bottom 33px
    padding 0 30px
    color #333333
    font-size 28px
  .gold-list
    margin 0 30px
    display flex
    flex-wrap wrap
    .item
      margin-right 36px
      margin-bottom 26px
      width 206px
      text-align center
      box-sizing border-box
      border 1px solid #E5E5E5
      &:nth-child(3n + 0)
        margin-right 0
      &.active
        border none
        background url(./jinbi_pre@2x.png) center center no-repeat
        background-size cover
        &>h6
          color #fff
          border-bottom none
        &>p
          color #fff
      &>h6
        border-bottom 1px solid #E5E5E5
        line-height 75px
        font-size 32px
        color #000000
      &>p
        line-height 42px
        font-size 24px
        color #9F9F9F
  .tips
    margin 0 30px
    margin-top 212px
    line-height 36px
    font-size 24px
    color #9F9F9F
  .btn
    margin 0 62px
    margin-bottom 63px
    margin-top 47px
    height 100px
    line-height 100px
    border-radius 50px
    background $theme-color
    font-size 32px
    color #FEFFFF
    text-align center
  .pay
    display flex
    height 150px
    align-items center
    margin 0 30px
    &>img
      width 53px
      height 53px
      margin-right 24px
    &>span
      font-size 32px
      color #000000
  .cancel
    height 86px
    line-height 86px
    border-top 1px solid #E9E9E9
    text-align center
    font-size 32px
    color #000000
</style>
