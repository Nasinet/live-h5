<template>
  <div class="register">
    <div class="back">
      <i @click="$router.back()" class="iconfont icon-back"></i>
    </div>
    <h4>{{ type === 1 ? '忘记密码' : '手机号注册' }}</h4>
    <div class="phone">
      <label>+86 <van-icon name="arrow-down" :size="10" color="#C9C9C9" /></label>
      <input type="text" v-model="phone" placeholder="请输入11位手机号">
    </div>
    <div class="code">
      <input type="text" v-model="code" placeholder="请输入验证码">
      <div class="btn" @click="sendCode">{{ countText }}</div>
    </div>
    <input type="password" v-model="password" placeholder="请输入新密码">

    <div @click="submit" class="submit">完成</div>
  </div>
</template>

<script>
import { countDown } from '../../common/js/mixins'
import { post } from '../../common/js/http'

export default {
  mixins: [countDown],
  name: 'register',
  data() {
    return {
      phone: '',
      code: '',
      password: '',
      type: 1
    }
  },
  created() {
    this.type = Number(this.$route.query.type)
  },
  methods: {
    submit() {
      if (this.type === 1) {
        this.editPassword()
      } else {
        this.register()
      }
    },
    sendCode() {
      if (this.timer) return
      if (!this.phone) {
        this.$toast.fail('请输入正确的手机号')
        return
      }
      post('/webapi/user/sendCode', {
        mobile: this.phone
      })
        .then(() => {
          this.countDown()
        })
    },
    editPassword() {
      let msg = ''
      if (!this.phone) msg = '请输入正确的手机号'
      if (!this.code && !msg) msg = '请输入验证码'
      if (!this.password && !msg) msg = '请输入新密码'
      if (msg) {
        this.$toast.fail(msg)
        return
      }
      post('/api/user/changePwd', {
        mobile: this.phone,
        pwd: this.password,
        smscode: this.code
      })
        .then(({ data }) => {
          this.$router.replace('/login')
        })
    },
    register() {
      let msg = ''
      if (!this.phone) msg = '请输入正确的手机号'
      if (!this.code && !msg) msg = '请输入验证码'
      if (!this.password && !msg) msg = '请输入密码'
      if (msg) {
        this.$toast.fail(msg)
        return
      }
      post('/user/regist', {
        account: this.phone,
        pwd: this.password,
        smscode: this.code
      })
        .then(({ data }) => {
          this.$router.replace('/login')
        })
    }
  }
}
</script>

<style scoped lang="stylus">

  @import "../../common/style/variable.styl"
  .register
    .back
      height 80px
      display flex
      align-items center
      padding-left 30px
      &>i
        font-size 33px
    &>h4
      margin-top 60px
      margin-bottom 70px
      margin-left 79px
      font-weight bold
      font-size 36px
      color #000
    .phone
      margin 0 66px
      margin-bottom 36px
      height 80px
      display flex
      align-items center
      border-bottom 1px solid #F4F4F4
      &>label
        width 120px
        text-align center
        font-size 34px
        color #000
      &>input
        padding-left 43px
        flex 1
        font-size 34px
    .code
      margin 0 66px
      margin-bottom 36px
      height 80px
      display flex
      align-items center
      border-bottom 1px solid #F4F4F4
      &>input
        flex 1
        font-size 34px
      .btn
        width 152px
        height 55px
        border-radius 55px
        line-height 55px
        text-align center
        background $theme-color
        font-size 24px
        color #FFFFFF
    &>input
      display block
      margin 0 66px
      margin-bottom 36px
      height 80px
      border-bottom 1px solid #F4F4F4
      font-size 34px
    .submit
      margin 0 30px
      margin-top 130px
      height 100px
      line-height 100px
      border-radius 50px
      background $theme-color
      text-align center
      font-size 32px
      color #fff
    .tips
      margin-top 33px
      text-align center
      font-size 27px
      color #878787
</style>
