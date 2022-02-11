<template>
  <div class="tab-bar">
    <router-link to="/" exact-active-class="active">
      <img src="./zhibo@3x.png" alt="">
      <img src="./zhibo_pre@3x.png" alt="">
      <p>直播</p>
    </router-link>
    <router-link to="/dynamic" active-class="active">
      <img src="./dongtai@3x.png" alt="">
      <img src="./dongtai_pre@3x.png" alt="">
      <p>动态</p>
    </router-link>
    <router-link to="/my" active-class="active">
      <img src="./wode@3x.png" alt="">
      <img src="./wode_pre@3x.png" alt="">
      <p>我的</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'tab-bar'
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.tab-bar
  width 100%
  position fixed
  left 0
  bottom 0
  height 98px
  display flex
  align-items center
  border-top 1px solid #F4F4F4
  background #fff
  z-index 99
  &>a
    flex 1
    text-align center
    &>img
      width 48px
      height 48px
      &:nth-child(1)
        display inline
      &:nth-child(2)
        display none
    &>p
      font-size 24px
      color #525252
    &.active
      &>img
        &:nth-child(1)
          display none
        &:nth-child(2)
          display inline
</style>
