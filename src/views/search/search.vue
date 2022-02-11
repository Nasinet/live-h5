<template>
  <div class="search">
    <div class="search-bar">
      <form @submit.prevent="search" class="input">
        <img src="./ic_search@2x.png" alt="">
        <input @blur="inputBlur" ref="input" v-model="keyword" placeholder="请输入关键字" type="search">
        <img src="./ic_delete@2x.png" @click="keyword = ''" alt="">
      </form>
      <p @click="$router.back()">取消</p>
    </div>
    <img class="no-data" v-if="!live.length && !anchor.length && !bbs.length" src="./bg@2x.png" alt="">
    <van-tabs @change="changTab" color="#AC74FF" :line-width="13" v-else v-model="active">
      <van-tab title="主播">
        <scroll ref="scroll" :is-finished="tabs[0].isFinished" @scrollToEnd="scrollToEnd" clickable class="scroll border-top-1px">
          <anchor-item @focus="focus" v-for="(item, index) in anchor" :index="index" :key="item.id" :anchor="item" />
        </scroll>
      </van-tab>
      <van-tab title="直播">
        <scroll :is-finished="tabs[1].isFinished" ref="scroll" @scrollToEnd="scrollToEnd" clickable class="scroll border-top-1px">
          <div class="live-list">
            <live-item v-for="item in live" :key="item.id" :live="item" />
          </div>
        </scroll>
      </van-tab>
      <van-tab title="动态">
        <scroll :is-finished="tabs[2].isFinished" ref="scroll" @scrollToEnd="scrollToEnd" clickable class="scroll border-top-1px">
          <div style="height: 25px;"></div>
          <post-item v-for="item in bbs" :key="item.id" :post="item" />
        </scroll>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { post } from '../../common/js/http'
import Scroll from '../../components/scroll/scroll'
import LiveItem from '../../components/live-item/live-item'
import AnchorItem from './anchor-item'
import PostItem from '../../components/post-item/post-item'
import { blurInput } from '../../common/js/mixins'

export default {
  name: 'search',
  mixins: [blurInput],
  components: {
    Scroll,
    LiveItem,
    AnchorItem,
    PostItem
  },
  data() {
    return {
      live: [],
      anchor: [],
      bbs: [],
      active: 0,
      tabs: {
        0: {
          page: 1,
          isFinished: true
        },
        1: {
          page: 1,
          isFinished: true
        },
        2: {
          page: 1,
          isFinished: true
        }
      },
      page: 1,
      keyword: '',
      isFinished: true
    }
  },
  methods: {
    focus({ index, isattent }) {
      this.$set(this.anchor, index, {
        ...this.anchor[index],
        isattent
      })
    },
    search() {
      if (!this.keyword) {
        this.$toast.fail('请输入关键字')
        return
      }
      this.live = []
      this.anchor = []
      this.bbs = []
      for (const key in this.tabs) {
        this.tabs[key].page = 1
        this.tabs[key].isFinished = true
      }
      this.searchAnchor()
      this.searchLive()
      this.searchBbs()
    },
    getList() {
      switch (this.active) {
        case 0:
          this.searchAnchor()
          break
        case 1:
          this.searchLive()
          break
        default:
          this.searchBbs()
          break
      }
    },
    changTab() {
      this.page = 1
      this.isFinished = true
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
        this.loading = false
      })
    },
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.tabs[this.active].page++
      this.getList()
    },
    searchLive() {
      post('/api/live/search', {
        keyword: this.keyword,
        page: this.tabs[1].page,
        size: 10,
        hideLoading: this.tabs[1].page > 1
      })
        .then(({ data: { data } }) => {
          this.live = this.live.concat(data)
          this.tabs[1].isFinished = data.length < 10
          this.$refs.input.blur()
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
            this.loading = false
          })
        })
    },
    searchAnchor() {
      post('/api/Anchor/search', {
        keyword: this.keyword,
        page: this.tabs[0].page,
        size: 10,
        hideLoading: this.tabs[0].page > 1
      })
        .then(({ data: { data } }) => {
          this.anchor = this.anchor.concat(data)
          this.tabs[0].isFinished = data.length < 10
          this.$refs.input.blur()
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
            this.loading = false
          })
        })
    },
    searchBbs() {
      post('/api/Moment/search', {
        keyword: this.keyword,
        page: this.tabs[2].page,
        size: 10,
        hideLoading: this.tabs[2].page > 1
      })
        .then(({ data: { data } }) => {
          this.bbs = this.bbs.concat(data)
          this.tabs[2].isFinished = data.length < 10
          this.$refs.input.blur()
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
.search
  height 100%
  background #FFF
  .search-bar
    padding 0 30px
    display flex
    height 100px
    align-items center
    justify-content space-between
    &>p
      margin-left 24px
      font-size 28px
      color #000000
    .input
      flex 1
      display flex
      align-items center
      padding 0 25px
      height 64px
      line-height 64px
      border-radius 32px
      background #EDEDED
      &>input
        padding-left 15px
        flex 1
      &>img
        width 28px
        height 28px
  .no-data
    display block
    width 422px
    height 440px
    margin 0 auto
    margin-top 208px
  ::v-deep
    .van-tabs
      height calc(100% - 100px)
    .van-tabs__content
      height calc(100% - 1.17333rem)
      .van-tab__pane
        height 100%
  .scroll
    .live-list
      padding 0 10px
      padding-top 35px
      display flex
      justify-content space-between
      flex-wrap wrap
</style>
