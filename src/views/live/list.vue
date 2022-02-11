<template>
  <scroll ref="scroll" clickable :is-finished="isFinished" @scrollToEnd="scrollToEnd">
    <div @touchmove.stop v-if="type===0">
      <div :class="['swiper-container' + type, 'loop']">
        <div class="swiper-wrapper">
          <a :href="item.jump_url" class="swiper-slide" :style="{backgroundImage: `url(${item.image_url})`}" v-for="item in adList" :key="item.id">
          </a>
        </div>
      </div>
    </div>

    <div class="space" v-else></div>
    <div class="list">
      <live-item class="live-link" v-for="live in list" :key="live.id" :live="live" />
    </div>
  </scroll>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
import LiveItem from '../../components/live-item/live-item'
import { post } from '../../common/js/http'

export default {
  name: 'list',
  components: {
    Scroll,
    LiveItem
  },
  props: {
    type: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    active: {
      type: Number,
      default: 0
    },
    adList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      list: [],
      isInit: false,
      page: 1,
      isFinished: true
    }
  },
  created() {
    if (this.active === this.index && !this.list.length && !this.isInit) {
      this.isInit = true
      this.getList()
    }
  },
  mounted() {
    if (this.adList.length) {
      this.$nextTick(() => {
        this.createSwiper()
      })
    }
  },
  methods: {
    createSwiper() {
      this.swiper = new window.Swiper('.swiper-container' + this.type, {
        slidesPerView: 'auto',
        centeredSlides: true,
        loop: true,
        spaceBetween: 10,
        grabCursor: true,
        preventClicksPropagation: false
      })
    },
    getList(hideLoading = false) {
      post(this.type === 0 ? '/live/getHotLives' : '/live/getLivesByCategory', {
        page: this.page,
        categoryid: this.type,
        size: 20,
        hideLoading
      })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 20
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
            this.loading = false
          })
        })
    },
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.page++
      this.getList(true)
    },
    activated() {
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  watch: {
    active(newVal) {
      if (newVal === this.index && !this.list.length && !this.isInit) {
        this.isInit = true
        this.getList()
      }
    },
    adList(newVal) {
      if (newVal.length) {
        this.$nextTick(() => {
          this.createSwiper()
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.list
  display flex
  flex-wrap wrap
  padding 0 9px
  @media only screen and (min-width: 768px)
    padding 0
    justify-content flex-start
    .live-link
      margin-left 1%
      width 32%
  @media only screen and (max-width: 767px)
    justify-content space-between
    .live-link
      width 360px
.space
  height 23px
.loop
  width 100%
  height 173px
  margin-top 33px
  margin-bottom 23px
  ::v-deep
    .swiper-slide
      width 609px
      display block
      background-repeat no-repeat
      background-size cover
      background-position center center
      // transform scale(0.83)
      transition all 0.3s
      border-radius 20px
      overflow hidden
    .swiper-slide-active
      transform scale(1)
</style>
