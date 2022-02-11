<template>
  <div class="wallet" style="padding-top: 44px;">
    <back-header title="我的钱包">
      <router-link class="withdraw" to="/withdraw">提现记录</router-link>
    </back-header>
    <div class="head">
      <div class="diamond">
        <p>累计钻石</p>
        <span>{{ userInfo.diamond_total }}</span>
      </div>
      <i></i>
      <div class="diamond">
        <p>可提取钻石数</p>
        <span>{{ userInfo.diamond }}</span>
      </div>
    </div>
    <div class="input">
      <label>提现金额</label>
      <input v-model.number="diamond" type="number" placeholder="请输入要提取的钻石数">
    </div>
    <div class="input" style="border: none;">
      <label>可到账金额</label>
      <span>¥{{ rateMoney }}</span>
    </div>
    <h4>我的提现账户 <router-link to="/my/account">管理账户</router-link></h4>
    <router-link v-if="!userInfo.is_anchor" to="/my/verify" class="verify">
      <p>您还未进行实名认证</p>
      <span>立即完成<van-icon name="arrow" /></span>
    </router-link>
    <template v-else>
      <p class="account" style="margin-top: 28px"><span>支付宝账户：</span>{{ account.alipay_account }}</p>
      <p class="account"><span>支付宝姓名：</span>{{ account.alipay_name }}</p>
    </template>
    <div class="divider">
      <van-divider style="color: #333;">提现规则</van-divider>
    </div>
    <div class="tips">
      1.提现须绑定手机号和支付宝，且必须实名认证，因用户个人原
      因误填提现账户信息导致的后果，“钠斯官方”不承担任何责任<br>
      2.申请提现一般会在24小时内发放至账户，如遇周末或节假日会
      顺延至工作日发放。<br>
      3.提现比例可能会发生变动，以最新规则为准。<br>
      4.最终解释权归“钠斯官方”所有。
    </div>
    <div class="btn" @click="withdraw">立即提现</div>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import { mapState } from 'vuex'
import { post } from '../../common/js/http'

export default {
  name: 'wallet',
  components: {
    BackHeader
  },
  data() {
    return {
      diamond: '',
      account: {}
    }
  },
  computed: {
    ...mapState(['userInfo', 'appConfig']),
    rateMoney() {
      return (Number(this.diamond) / this.appConfig.exchange_rate).toFixed(2)
    }
  },
  created() {
    this.getAccount()
  },
  methods: {
    withdraw() {
      if (this.rateMoney < this.appConfig.withdraw_min) {
        this.$toast.fail(`提现金额不能小于${this.appConfig.withdraw_min}`)
        return
      }
      if (!this.account) {
        this.$toast.fail('请先完成实名认证')
        return
      }
      post('/webapi/withdraw/withdraw', {
        cash: this.rateMoney,
        diamond: this.diamond,
        alipay_account: this.account.alipay_account,
        alipay_name: this.account.alipay_name
      })
    },
    getAccount() {
      post('/webapi/withdraw/getAccount')
        .then(({ data: { data } }) => {
          this.account = data
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.wallet
  width 100%
  .withdraw
    display inline-block
    padding-right 30px
    font-size 30px
    color #070707
  .head
    margin 0 30px
    margin-top 30px
    height 259px
    background $theme-color
    display flex
    align-items center
    .diamond
      flex 1
      text-align center
      &>p
        margin-bottom 25px
        font-size 30px
        color #FFFFFF
      &>span
        font-size 40px
        font-weight bold
        color #FFFFFF
    &>i
      width 1px
      height 117px
      background #FFFFFF
  .input
    margin 0 30px
    display flex
    height 129px
    align-items center
    border-bottom 1px solid #E1E1E1
    &>label
      margin-right 31px
      font-size 32px
      color #333333
    &>input
      height 40px
      line-height 40px
      font-size 30px
    &>span
      font-weight bold
      font-size 32px
      color #18D5D9
  &>h4
    display flex
    align-items center
    justify-content space-between
    padding 0 30px
    padding-top 59px
    border-top 15px solid #F4F4F4
    font-size 32px
    color #333333
    &>a
      width 138px
      height 48px
      line-height 48px
      border-radius 24px
      border 1px solid $theme-color
      text-align center
      font-size 30px
      color $theme-color
  .verify
    margin 0 30px
    margin-top 65px
    display flex
    justify-content space-between
    font-size 30px
    &>p
      color #333
    &>span
      color #A2A2A2
  .account
    margin 0 30px
    margin-bottom 37px
    font-size 30px
    color #000
    &>span
      color #9C9C9C
  .divider
    margin 0 135px
    margin-top 72px
    margin-bottom 32px
  .tips
    margin 0 30px
    margin-bottom 82px
    line-height 35px
    font-size 24px
    color #B1B1B1
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
</style>
