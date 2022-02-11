<template>
  <div class="home">
    <div class="header">
      <div class="tab">
        <van-tabs v-model="active" @click="changeTab" :line-width="13" animated color="#66F6EF">
          <van-tab v-for="tab in tabs" :key="tab.name" :title="tab.title" :name="tab.name"/>
        </van-tabs>
      </div>
      <img class="send" v-if="!showSelect" @click="showSelect=true" src="./ic_send@2x.png" alt="">
    </div>
    <div class="swiper-container home-swipe">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(cate, idx) in tabs" :key="idx">
          <home-list :active="active" ref="homeList" :type="cate.name" />
        </div>
      </div>
    </div>

    <tab-bar/>
    <post-select v-if="showSelect" @close="showSelect=false" />
  </div>
</template>

<script>
import TabBar from '../../components/tab-bar/tab-bar'
import PostSelect from '../../components/post-select/post-select'
import HomeList from './home-list'

export default {
  name: 'home',
  data() {
    return {
      active: 5,
      tabs: [
        { title: '关注', name: 4 },
        { title: '热门', name: 5 }
      ],
      list: [],
      showSelect: false,
      loading: false,
      recommend: null,
      page: 1,
      isFinished: true
    }
  },
  activated() {
    if (this.$refs.homeList) {
      this.$refs.homeList.forEach(item => {
        item.activated()
      })
    }
  },
  mounted() {
    this.createSwiper()
  },
  methods: {
    createSwiper() {
      this.swiper = new window.Swiper('.home-swipe', {
        loop: false,
        threshold: 10,
        initialSlide: 1,
        preventClicksPropagation: false,
        on: {
          slideChangeTransitionStart: () => {
            if (this.swiper) {
              const index = this.swiper.activeIndex
              this.active = this.tabs[index].name
            }
          }
        }
      })
    },
    changeTab(item, index, e) {
      this.active = item
      this.swiper.slideTo(item === 5 ? 1 : 0)
    }
  },
  components: {
    TabBar,
    PostSelect,
    HomeList
  }
}
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "../../common/style/variable.styl"
  .home
    box-sizing border-box
    height 100%
    padding-bottom 98px
    .header
      display flex
      align-items center
      justify-content space-between
      padding-bottom 28px
      .tab
        margin-left 20px
        width 200px
        ::v-deep
          .van-tab--active
            transition all 0.2s
            font-size 40px
            font-weight bold
      .send
        margin-right 31px
        width 43px
        height 43px
  .tab-wrap
    padding-bottom 30px
    margin-top 27px
    display flex
    align-items center
    border-bottom 10px solid #F7F7F7
    .scroll
      flex 1
      height 50px
      overflow scroll
      border-right 4px solid #EFEFEF
      &::-webkit-scrollbar
        display none
    .tab
      height 42px
      display flex
      align-items center
      transition all 0.3s
      font-size 30px
      color #000000
      &>li
        flex 1
        text-align center
        white-space nowrap
        transition all 0.1s
        &.active
          font-size 40px
          color $theme-color
          font-weight bold
    .iconfont
      margin-left 22px
      font-size 34px
      color #000
  .home-swipe
    height calc(100% - 1.17333rem - 28px)
    z-index 1 !important
</style>
