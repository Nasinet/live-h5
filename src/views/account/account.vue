<template>
  <div class="account" style="padding-top: 48px;">
    <back-header title="管理提现账户" />
    <div class="input">
      <label>支付宝姓名</label>
      <input v-model="alipay_name" type="text" placeholder="请输入支付宝姓名">
    </div>
    <div class="input">
      <label>支付宝账号</label>
      <input type="text" v-model="alipay_account" placeholder="请输入支付宝账号">
    </div>
    <div class="input">
      <label>手机号</label>
      <input type="text" v-model="phone" placeholder="请输入手机号">
    </div>
    <div class="input">
      <label>验证码</label>
      <input type="text" v-model="code" placeholder="请输入手机验证码">
      <div class="btn" @click="sendCode">{{ countText }}</div>
    </div>

    <div class="submit" @click="submit">立即修改账户</div>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import { post } from '../../common/js/http'
import { countDown } from '../../common/js/mixins'

export default {
  name: 'account',
  mixins: [countDown],
  components: {
    BackHeader
  },
  data() {
    return {
      phone: '',
      alipay_account: '',
      alipay_name: '',
      code: ''
    }
  },
  methods: {
    sendCode() {
      if (this.timer) return
      if (!this.phone) {
        this.$toast.fail('请输入正确的手机号')
        return
      }
      post('/api/user/sendCode', {
        mobile: this.phone
      })
        .then(() => {
          this.countDown()
        })
    },
    submit() {
      if (!this.alipay_name) {
        this.$toast.fail('请输入支付宝姓名')
        return
      }
      if (!this.alipay_account) {
        this.$toast.fail('请输入支付宝账户')
        return
      }
      if (!this.phone) {
        this.$toast.fail('请输入手机号')
        return
      }
      if (!this.code) {
        this.$toast.fail('请输入验证码')
        return
      }
      post('/api/withdraw/editCashAccount', {
        alipay_account: this.alipay_account,
        alipay_name: this.alipay_name,
        smscode: this.code
      })
        .then(() => {
          this.$router.back()
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.account
  width 100%
  min-height 100%
  position relative
  box-sizing border-box
  padding-left 30px
  .input
    display flex
    padding-right 30px
    justify-content space-between
    height 117px
    align-items center
    border-bottom 1px solid #F4F4F4
    &>label
      font-size 30px
      color #666666
    &>input
      flex 1
      height 117px
      line-height 117px
      text-align right
      font-size 30px
    .btn
      margin-left 43px
      width 152px
      height 55px
      line-height 55px
      text-align center
      border-radius 23px
      font-size 24px
      color #FFFFFF
      background $theme-color
  .submit
    position absolute
    bottom 96px
    left 50%
    transform translateX(-50%)
    width 625px
    height 100px
    line-height 100px
    border-radius 50px
    background $theme-color
    text-align center
    font-size 32px
    color #FEFFFF
</style>
