<template>
  <div class="sys-msg" style="padding-top: 44px;">
    <back-header title="系统消息" />
    <scroll clickable ref="scroll" :is-finished="isFinished" @scrollToEnd="scrollToEnd">
      <div class="msg-item" @click="goOut(item)" v-for="item in list" :key="item.id">
        <p class="date">{{ item.create_time }}</p>
        <div class="box">
          <img v-if="item.image_url" :src="item.image_url" alt="">
          <h6>{{ item.title }}</h6>
          <p class="content">{{ item.content }}</p>
          <span v-if="item.link">查看详情<van-icon name="arrow" /></span>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import Scroll from '../../components/scroll/scroll'
import { post } from '../../common/js/http'

export default {
  name: 'msg',
  components: {
    BackHeader,
    Scroll
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
      this.getList(true)
    },
    goOut(item) {
      if (item.link) {
        window.location.href = item.link
      }
    },
    getList() {
      post('/api/Message/getSystemMsg', {
        page: this.page,
        size: 20,
        lastid: this.list.length ? this.list[this.list.length - 1].id : 0,
        hideLoading: this.page > 1
      })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 20
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
.sys-msg
  height 100%
  box-sizing border-box
  .msg-item
    margin 0 30px
    .date
      padding-top 58px
      padding-bottom 22px
      font-size 24px
      color #989898
      text-align center
    .box
      background #fff
      box-shadow 0px 0px 14px 4px rgba(0, 0, 0, 0.06)
      &>img
        width 100%
        height 254px
        object-fit cover
      &>h6
        padding 37px 30px 20px 30px
        font-size 28px
        color #333333
      .content
        padding 0 30px
        padding-bottom 22px
        line-height 36px
        font-size 24px
        color #666
      &>span
        height 60px
        display flex
        align-items center
        padding-left 30px
        border-top 1px solid #ECECEC
        font-size 24px
        color #333333
</style>
