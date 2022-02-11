<template>
  <div class="user-dynamic" style="padding-top: 44px;">
    <back-header title="我的动态" />
    <ul class="tabs">
      <li @click="changeTab(0)" :class="{active: active === 0}">已通过</li>
      <li @click="changeTab(1)" :class="{active: active === 1}">待审核</li>
      <li @click="changeTab(2)" :class="{active: active === 2}">未通过</li>
    </ul>
    <div class="swiper-container live-swipe">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div style="height: 20px"></div>
          <list :active="active" :type="0"/>
        </div>
        <div class="swiper-slide">
          <div style="height: 20px"></div>
          <list :active="active" :type="1"/>
        </div>
        <div class="swiper-slide">
          <div style="height: 20px"></div>
          <list :active="active" :type="2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from './list'
import BackHeader from '../../components/back-header/back-header'

export default {
  name: 'user-dynamic',
  components: {
    List,
    BackHeader
  },
  data() {
    return {
      active: 0
    }
  },
  mounted() {
    this.createSwiper()
  },
  methods: {
    changeTab(tab) {
      if (this.active === tab) return
      this.active = tab
      this.swiper.slideTo(tab)
    },
    createSwiper() {
      this.swiper = new window.Swiper('.live-swipe', {
        loop: false,
        on: {
          slideChangeTransitionStart: () => {
            this.active = this.swiper.activeIndex
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.user-dynamic
  width 100%
  height 100vh
  .tabs
    height 80px
    display flex
    border-bottom 1px solid #F5F5F5
    &>li
      flex 1
      line-height 73px
      font-size 26px
      color #000000
      text-align center
      &:after
        content ' '
        display block
        width 22px
        margin 0 auto
        height 7px
        border-radius 4px
        background transparent
      &.active
        &:after
          background $theme-color
  .live-swipe
    height calc(100% - 80px)
</style>
