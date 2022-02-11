<template>
  <div class="collection" style="padding-top: 44px;">
    <back-header title="收藏动态" />
    <scroll ref="scroll" clickable :is-finished="isFinished" @scrollToEnd="scrollToEnd">
      <div style="height: 30px;"></div>
      <post-item v-for="item in list" :key="item.id" :post="item" />
    </scroll>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import Scroll from '../../components/scroll/scroll'
import PostItem from '../../components/post-item/post-item'
import { post } from '../../common/js/http'

export default {
  name: 'collection',
  components: {
    BackHeader,
    Scroll,
    PostItem
  },
  data() {
    return {
      page: 1,
      list: [],
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
      this.getList(true)
    },
    getList() {
      post('/api/Moment/getCollection', { page: this.page, size: 10, hideLoading: this.page > 1 })
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
.collection
  height 100%
  box-sizing border-box
</style>
