<template>
  <div class="rank">
    <h1><i @click="$router.back()" class="iconfont icon-back"></i>{{ $route.params.type === '1' ? '热门榜单' : '付费精选' }}</h1>
    <scroll ref="scroll" @scrollToEnd="scrollToEnd" class="scroll" clickable :is-finished="isFinished">
      <ul class="tabs">
        <li @click="changeTab(0)" :class="{active: active === 0}">日榜</li>
        <li @click="changeTab(1)" :class="{active: active === 1}">周榜</li>
        <li @click="changeTab(2)" :class="{active: active === 2}">月榜</li>
      </ul>
      <post-item v-for="item in list" :key="item.id" :post="item"/>
    </scroll>
  </div>
</template>

<script>
import PostItem from '../../components/post-item/post-item'
import Scroll from '../../components/scroll/scroll'
import { post } from '../../common/js/http'

export default {
  name: 'rank',
  data() {
    return {
      list: [],
      active: 0,
      isFinished: true,
      page: 1
    }
  },
  components: {
    PostItem,
    Scroll
  },
  created() {
    this.getList()
  },
  methods: {
    changeTab(tab) {
      if (this.tab === tab) return
      this.active = tab
      this.page = 1
      this.list.length = 0
      this.list = []
      this.isFinished = true
      this.getList()
    },
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.page++
      this.getList()
    },
    getList() {
      const url = this.$route.params.type === '2' ? '/api/Moment/getPaidRankList' : '/api/Moment/getHotRankList'
      post(url, {
        page: this.page,
        size: 10,
        type: this.active,
        hideLoading: this.page > 1
      })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 10
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
            this.loading = false
          })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.rank
  height 100%
  .scroll
    height calc(100% - 94px)
  h1
    margin-bottom 30px
    padding-top 30px
    font-size 34px
    color #070707
    text-align center
    position relative
    .iconfont
      position absolute
      left 30px
      font-size 33px
  .tabs
    display flex
    align-items center
    justify-content space-between
    box-sizing border-box
    margin 0 151px
    margin-top 15px
    margin-bottom 53px
    padding 0 26px
    height 63px
    border-radius 32px
    background #F6EFFF
    font-size 28px
    color #4E4E4E
    &>li
      width 92px
      height 42px
      line-height 42px
      background transparent
      text-align center
      border-radius 21px
      &.active
        font-weight bold
        background $theme-color
        color #fff
</style>
