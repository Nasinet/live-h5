<template>
  <scroll clickable ref="scroll" :is-finished="isFinished" @scrollToEnd="scrollToEnd">
    <post-item v-for="(item, index) in list" :key="item.id" :post="item" :index="index" :column="type" />
  </scroll>
</template>

<script>
import { post } from '../../common/js/http'
import PostItem from '../../components/post-item/post-item'
import Scroll from '../../components/scroll/scroll'

const status = [1, 0, 2]

export default {
  name: 'list',
  components: {
    PostItem,
    Scroll
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
      page: 1,
      list: [],
      isFinished: true
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    scrollToEnd() {
      if (this.loading || this.isFinished) return
      this.loading = true
      this.page++
      this.getList()
    },
    getList() {
      post('/api/User/myMoment', {
        page: this.page,
        size: 5,
        status: status[this.type]
      }, this.page > 1)
        .then(({ data: { data } }) => {
          this.list = this.page === 1 ? data : this.list.concat(data)
          this.isFinished = data.length < 5
          this.$nextTick(() => {
            setTimeout(() => {
              this.$refs.scroll.refresh()
              this.loading = false
            }, 200)
          })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.list-scroll
  width 100%
  height 100%
</style>
