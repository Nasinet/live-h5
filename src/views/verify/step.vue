<template>
  <div class="step">
    <back-header title="申请成为主播" class="s-header" />
    <div class="progress">
      <div :class="{circle: true, big: true}"></div>
      <div :class="{circle: true, big: step >= 2}"></div>
      <div :class="{circle: true, big: step >= 3}"></div>
      <i></i>
    </div>
    <div class="text">
      <span>绑定手机</span>
      <span>实名认证</span>
      <span>填写个人资料</span>
    </div>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'

export default {
  name: 'step',
  components: {
    BackHeader
  },
  props: {
    step: {
      type: Number,
      default: 1
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.step
  background $theme-color
  overflow hidden
  .s-header
    margin-bottom 52px
    position static
    background transparent
    ::v-deep
      .back-btn
        color #fff
      &>h4
        color #fff
  .progress
    margin 0 90px
    position relative
    display flex
    justify-content space-between
    align-items center
    margin-bottom 22px
    .circle
      width 18px
      height 18px
      border-radius 9px
      background #C1FEFF
      &.big
        width 33px
        height 33px
        border-radius 50%
        box-sizing border-box
        background $theme-color
        border 11px solid #fff
        position relative
        z-index 3
    &>i
      z-index 1
      position absolute
      left 30px
      right 9px
      height 1px
      top 50%
      transform translateY(-50%)
      background #C1FEFF
  .text
    margin-bottom 54px
    padding-left 60px
    padding-right 32px
    display flex
    justify-content space-between
    font-size 24px
    color #FFFFFF
</style>
