<template>
  <div class="watch-history" style="padding-top: 44px;">
    <back-header title="足迹" />
    <scroll ref="scroll" clickable :is-finished="isFinished" @scrollToEnd="scrollToEnd">
      <div style="height: 20px;"></div>
      <post-item v-for="item in list" :key="item.id" :post="item" />
    </scroll>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import Scroll from '../../components/scroll/scroll'
import { post } from '../../common/js/http'
import PostItem from '../../components/post-item/post-item'

export default {
  name: 'watch-history',
  components: {
    BackHeader,
    Scroll,
    PostItem
  },
  data() {
    return {
      list: [],
      page: 1,
      isFinished: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.page++
      this.getList()
    },
    getList() {
      post('/api/Moment/getUserWatchLog', {
        page: this.page,
        size: 10,
        hideLoading: this.page > 1
      })
        .then(({ data: { data } }) => {
          data = Array.isArray(data) ? data : []
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
.watch-history
  box-sizing border-box
  height 100%
</style>
