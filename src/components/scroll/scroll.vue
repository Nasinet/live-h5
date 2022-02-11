<template>
  <div
    ref="scroll"
    class="scroll"
    :style="{ overflow: hidden ? 'hidden' : 'visible', ...cStyle }"
  >
    <div style="overflow: hidden">
      <slot />
      <div class="loading" v-if="!isFinished">
        <van-loading type="spinner" size="16px" color="#9B9B9D" />
        <span>加载中...</span>
      </div>
    </div>
    <div v-if="isPulling" class="pull-loading">
      <van-loading type="spinner" size="20px" color="#9B9B9D" />
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import Pulldown from '@better-scroll/pull-down'

BScroll.use(Pulldown)

export default {
  name: 'scroll',
  props: {
    isFinished: {
      type: Boolean,
      default: true
    },
    clickable: {
      type: Boolean,
      default: false
    },
    probeType: {
      type: Number,
      default: 3
    },
    pullDownRefresh: {
      type: Object,
      default() {
        return null
      }
    },
    hidden: {
      type: Boolean,
      default: true
    },
    cStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isPulling: false
    }
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.scroll, {
      click: this.clickable,
      probeType: this.probeType,
      pullDownRefresh: this.pullDownRefresh ? this.pullDownRefresh : false,
      bounceTime: 350,
      swipeBounceTime: 300,
      swipeTime: 1000,
      useTransition: false
    })

    this.scroll.on('scrollEnd', () => {
      if (this.isFinished) return
      if (this.scroll.y <= this.scroll.maxScrollY + 50) {
        this.$emit('scrollToEnd')
      }
    })

    this.scroll.on('scroll', pos => {
      this.$emit('scroll', pos)
    })

    if (this.pullDownRefresh) {
      this.scroll.on('pullingDown', () => {
        if (this.isPulling) return
        this.isPulling = true
        this.$emit('pullingDown')
      })
    }
  },
  beforeDestroy() {
    this.scroll.destroy()
  },
  methods: {
    refresh() {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = setTimeout(() => {
        this.scroll && this.scroll.refresh()
      }, 200)
    },
    closeRefresh() {
      this.isPulling = false
      this.scroll.finishPullDown()
    },
    scrollTo(poi) {
      this.scroll.scrollTo(...poi)
    },
    scrollEnd() {
      this.scroll && this.scroll.refresh()
      this.$nextTick(() => {
        this.scroll.scrollTo(0, this.scroll.maxScrollY)
      })
    }
  },
  watch: {
    list() {
      this.refresh()
    }
  }
}
</script>

<style scoped lang="stylus">
.scroll
  height 100%
  width 100%
  position relative
  touch-action pan-y
  .loading
    display flex
    align-items center
    justify-content center
    height 80px
    &>span
      margin-left 10px
      font-size 24px
      color #9B9B9D
  .pull-loading
    position absolute
    width 100%
    height 60px
    line-height 60px
    top 20px
    text-align center
    z-index -1
</style>
