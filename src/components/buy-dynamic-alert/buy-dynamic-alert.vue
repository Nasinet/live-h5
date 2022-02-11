<template>
  <div class="lock-alert" @click.stop="hide">
    <div class="box" @click.stop v-if="type==='pay'">
      <van-icon @click="hide" class="close" name="cross" color="#C3C3C3" :size="14" />
      <img :src="post.user.avatar" alt="">
      <p>解锁{{ post.user.nick_name }}的私密动态</p>
      <div class="btn" @click="confirm">观看此动态需要{{ post.unlock_price }}金币</div>
    </div>
    <div v-if="type==='password'" class="box password" @click.stop>
      <van-icon @click="hide" class="close" name="cross" color="#C3C3C3" :size="14" />
      <h6>私密房间</h6>
      <input v-model="password" type="password" placeholder="请输入房间密码">
      <div class="btn" @click="confirm(password)">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'buy-dynamic-alert',
  props: {
    post: {
      type: Object,
      default() { return {} }
    },
    type: {
      type: String,
      default: 'pay'
    }
  },
  data() {
    return {
      password: ''
    }
  },
  methods: {
    hide() {
      document.body.removeChild(this.$el)
      this.$destroy()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
  .lock-alert
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    z-index 100
    background rgba(0,0,0,0.5)
    .box
      width 483px
      position relative
      border-radius 11px
      background #fff
      text-align center
      &>img
        width 116px
        height 116px
        padding-top 40px
        padding-bottom 42px
        border-radius 50%
      &>p
        padding 0 49px
        margin-bottom 69px
        font-size 26px
        color #333333
      .btn
        margin 0 49px
        margin-bottom 53px
        height 66px
        line-height 66px
        border-radius 33px
        background $theme-color
        color #fff
        font-size 30px
      .close
        position absolute
        right 32px
        top 38px
        font-weight bold
      &.password
        .close
          top 29px
        &>h6
          font-size 30px
          color #343434
          line-height 94px
          text-align center
        &>input
          display block
          width 414px
          height 98px
          box-sizing border-box
          padding-left 14px
          background #F4F4F4
          margin 0 auto
          margin-bottom 50px
          font-size 28px
        .btn
          margin 0 142px
          margin-bottom 51px
</style>
