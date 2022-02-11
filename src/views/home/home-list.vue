<template>
  <div class="home-list">
    <scroll ref="scroll" class="scroll" clickable @scrollToEnd="scrollToEnd" :is-finished="isFinished">
<!--      <top-post @likeTop="likeTop" :recommend="recommend" v-if="recommend && active === 5" />-->
      <post-item :active="active.toString()" :column="type.toString()" @liked="liked" @changeDyItem="changeDyItem" v-for="(item, index) in list" :key="index" :post="item" :index="index"/>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
// import HotLink from './hot-link'
// import TopPost from '../../components/top-post/top-post'
import PostItem from '../../components/post-item/post-item'
import { post } from '../../common/js/http'

export default {
  name: 'home-list',
  components: {
    Scroll,
    PostItem
  },
  props: {
    active: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      recommend: null,
      list: [],
      page: 1,
      isFinished: true,
      isInit: false
    }
  },
  created() {
    if (this.active === this.type && !this.list.length && !this.isInit) {
      switch (this.type) {
        case 5:
          this.getRec()
          break
        case 4:
          this.getFocusList()
          break
        default:
          this.getList()
          break
      }
    }
  },
  methods: {
    activated() {
      this.refreshScroll()
    },
    refreshScroll() {
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
        this.loading = false
      })
    },
    liked({ data, index }) {
      this.$set(this.list, index, {
        ...this.list[index],
        liked: true,
        ...data
      })
    },
    likeTop({ data }) {
      this.$set(this.recommend, 'liked', true)
      this.$set(this.recommend, 'like_count', data.like_count)
    },
    changeDyItem({ index, item }) {
      this.$set(this.list, index, item)
    },
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.page++
      if (this.active === 5) {
        this.getRec()
        return
      }
      if (this.active === 4) {
        this.getFocusList()
        return
      }
      this.getList()
    },
    getRec() {
      post('/webapi/Moment/getHotList', {
        page: this.page,
        size: 10,
        hideLoading: this.page > 1
      })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 10
          this.refreshScroll()
          this.isInit = true
        })
    },
    getList() {
      post('/Moment/getList', {
        page: this.page,
        size: 10,
        hideLoading: this.page > 1,
        type: this.active
      })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 10
          this.refreshScroll()
          this.isInit = true
        })
    },
    getFocusList() {
      post('/Moment/getAttentList', {
        page: this.page,
        size: 10,
        hideLoading: this.page > 1
      })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 10
          this.refreshScroll()
          this.isInit = true
        })
    }
  },
  watch: {
    active(newVal) {
      if (newVal === this.type && !this.list.length && !this.isInit) {
        switch (this.type) {
          case 5:
            this.getRec()
            break
          case 4:
            this.getFocusList()
            break
          default:
            this.getList()
            break
        }
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.home-list
  height 100%
</style>
