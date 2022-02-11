<template>
  <div class="circle">
    <h1 class="head border-bottom-1px">圈子</h1>
    <scroll clickable ref="scroll">
      <div @touchmove.stop>
        <div class="live-swipe">
          <div class="swiper-wrapper">
            <a :href="item.jump_url" class="swiper-slide" :style="{backgroundImage: `url(${item.image_url})`}" v-for="item in ads" :key="item.id">
            </a>
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>

      <circle-item @focus="focus" v-for="(item, index) in list" :index="index" :key="item.id" :item="item" />
    </scroll>
    <tab-bar/>
  </div>
</template>

<script>
import TabBar from '../../components/tab-bar/tab-bar'
import { post } from '../../common/js/http'
import Scroll from '../../components/scroll/scroll'
import CircleItem from './circle-item'

export default {
  name: 'group',
  components: {
    TabBar,
    Scroll,
    CircleItem
  },
  data() {
    return {
      ads: [],
      list: []
    }
  },
  created() {
    this.getList()
    this.getAd()
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.scroll && this.$refs.scroll.refresh()
    })
  },
  methods: {
    createSwiper() {
      this.swiper = new window.Swiper('.live-swipe', {
        loop: true,
        preventClicksPropagation: false,
        pagination: {
          el: '.swiper-pagination'
        }
      })
    },
    getAd() {
      post('/Ads/getHomeScrollAd')
        .then(({ data: { data } }) => {
          this.ads = data
          this.$nextTick(() => {
            this.createSwiper()
          })
        })
    },
    getList() {
      post('/api/group/getGroupPageList')
        .then(({ data: { data } }) => {
          this.list = data
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        })
    },
    focus(index) {
      this.$set(this.list, index, {
        ...this.list[index],
        isFollowed: !this.list[index].isFollowed
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.circle
  height 100%
  .head
    height 80px
    line-height 80px
    font-size 34px
    color #070707
    font-weight bold
    text-align center
  .scroll
    height calc(100% - 80px - 98px)
  .live-swipe
    margin 0 30px
    margin-top 22px
    height 248px
    border-radius 10px
    overflow hidden
    position relative
    ::v-deep
      .swiper-pagination-bullet-active
        background #fff
    .swiper-slide
      display block
      width 100%
      height 100%
      background-size cover
      background-position center center
      background-repeat no-repeat
</style>
