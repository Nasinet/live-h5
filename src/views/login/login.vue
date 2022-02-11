<template>
  <div class="login">
    <img src="./logo@2x.png" class="logo" alt="">
    <div class="phone">
      <img src="./phone@2x.png" alt="">
      <input type="text" v-model="phone" placeholder="请输入11位手机号">
    </div>
    <div class="phone">
      <img src="./code@2x.png" alt="">
      <input v-model="password" type="password" placeholder="请输入密码">
    </div>
    <p class="tips" @click="$router.push('/forget?type=1')">忘记密码？</p>

    <div @click="login" class="submit">{{ type === 0 ? '登录' : '下一步' }}</div>
    <div @click="register" class="submit register">注册</div>
  </div>
</template>

<script>
import { post } from '../../common/js/http'
import { setItem } from '../../common/js/storage'

export default {
  name: 'login',
  data() {
    return {
      type: 0,
      phone: '',
      password: '',
      canBack: false
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.canBack = !!from.name && from.name !== 'forget'
    })
  },
  methods: {
    register() {
      this.$router.push('/forget?type=2')
    },
    login() {
      if (!this.phone) {
        this.$toast.fail('请输入手机号')
        return
      }
      if (!this.password) {
        this.$toast.fail('请输入密码')
        return
      }
      post('/webapi/user/login', {
        account: this.phone,
        pwd: this.password
      })
        .then(({ data: { data } }) => {
          setItem('token', data.token)
          setItem('uid', data.id)
          if (this.canBack) {
            this.$router.back()
          } else {
            this.$router.replace('/')
          }
          setTimeout(() => {
            window.location.reload()
          }, 100)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.login
  height 100%
  background url(./bg@2x.png) center center no-repeat
  background-size cover
  .logo
    display block
    width 163px
    height 202px
    padding-top 200px
    margin 0 auto
    margin-bottom 134px
  .phone
    padding 0 39px
    margin 0 85px
    margin-bottom 43px
    height 82px
    display flex
    align-items center
    border-radius 41px
    background rgba(255, 255, 255, 0.18)
    &>img
      width 32px
      height 32px
    &>input
      padding-left 15px
      flex 1
      font-size 26px
      color #fff
  .submit
    margin 0 85px
    height 82px
    line-height 82px
    border-radius 41px
    background $theme-color
    text-align center
    font-size 32px
    color #fff
    &.register
      margin-top 49px
      background #fff
      color $theme-color
  .tips
    margin-bottom 80px
    margin-top 22px
    padding 0 99px
    text-align right
    font-size 24px
    color #D8D8D8
</style>
