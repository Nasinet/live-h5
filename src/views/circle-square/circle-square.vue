<template>
  <div class="circle-square">
    <div class="head" style="height: 40px;line-height: 40px;">
      <i @click="$router.back()" class="iconfont icon-back"></i>
    </div>
    <div class="bg-top" ref="bgTop"></div>
    <div class="bg-layer" :style="{'border-top-right-radius': '10px', 'border-top-left-radius': '10px', top: bgHeight - 10 + 'px'}" ref="scrollBg"></div>
    <scroll ref="scroll"
            :c-style="{top: bgHeight - 10 + 'px', height: 'auto'}"
            :is-finished="isFinished"
            :hidden="false"
            @scrollToEnd="scrollToEnd"
            @scroll="scroll"
            clickable
            class="scroll">
      <div class="circle">
        <div class="info">
          <img :src="circle.img_url || $store.state.defaultAvatar" alt="">
          <div class="desc">
            <h6 class="ellipse-one">{{ circle.title }}</h6>
            <p class="ellipse-one">{{ circle.sub_title }}</p>
          </div>
          <div @click="focus" class="btn">{{ circle.isFollowed ? '已关注' : '关注' }}</div>
        </div>
        <div class="data-num">
          <p>{{ circle.follow_count }} <span>关注</span></p>
          <p>{{ circle.moment_count }} <span>帖子</span></p>
        </div>
        <div class="report">
          <img src="./gonggao@2x.png" alt="">
          <p class="ellipse-one">{{ circle.notice }}</p>
        </div>
      </div>
      <post-item v-for="(item, index) in list" @liked="liked" :index="index" :key="item.id" :post="item" />
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
import PostItem from '../../components/post-item/post-item'
import { post } from '../../common/js/http'

export default {
  name: 'circle-square',
  components: {
    Scroll,
    PostItem
  },
  data() {
    return {
      bgHeight: 0,
      circle: {
        isFollowed: false
      },
      list: [],
      page: 1,
      isFinished: true
    }
  },
  mounted() {
    this.bgHeight = this.$refs.bgTop.clientHeight
  },
  created() {
    this.getList()
    this.getCircle()
  },
  methods: {
    scroll(poi) {
      const top = this.bgHeight + poi.y - 10
      if (top <= 40) {
        this.$refs.scrollBg.style.top = 40 + 'px'
        this.$refs.bgTop.style.zIndex = 30
        this.$refs.bgTop.style.height = 40 + 'px'
      } else {
        this.$refs.scrollBg.style.top = top + 'px'
        this.$refs.bgTop.style.zIndex = 0
        this.$refs.bgTop.style.height = this.bgHeight + 'px'
        if (poi.y > 0) {
          this.$refs.bgTop.style.height = this.bgHeight + poi.y + 'px'
        }
      }
    },
    getCircle() {
      post('/webapi/group/getGroupInfo', { groupid: this.$route.params.id })
        .then(({ data: { data } }) => {
          this.circle = data
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        })
    },
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.page++
      this.getList()
    },
    getList() {
      post('/webapi/group/getGroupMoment', {
        groupid: this.$route.params.id,
        type: 0,
        page: this.page,
        size: 10,
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
    },
    focus() {
      post('/webapi/group/attentGroup', {
        groupid: this.$route.params.id,
        type: !this.circle.isFollowed
      })
        .then(() => {
          this.circle.isFollowed = !this.circle.isFollowed
        })
    },
    liked({ data, index }) {
      this.$set(this.list, index, {
        ...this.list[index],
        liked: true,
        ...data
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.circle-square
  height 100%
  position relative
  overflow hidden
  background url(./bg@2x.png) top 0 center no-repeat
  background-size 100%
  .head
    width 100%
    box-sizing border-box
    position absolute
    top 0
    padding-left 30px
    z-index 40
    &>i
      font-size 33px
      color #fff
  .bg-top
    position relative
    height 300px
    background url(./bg@2x.png) center center no-repeat
    background-size cover
  .bg-layer
    position absolute
    left 0
    width 100%
    height 100%
    background #fff
  .scroll
    height auto
    position absolute
    bottom 0
    border-top-left-radius 20px
    border-top-right-radius 20px
    .circle
      margin-bottom 40px
      padding 31px 30px 47px 30px
      border-bottom 10px solid #F7F7F7
      .info
        display flex
        align-items center
        &>img
          width 81px
          height 81px
          border-radius 50%
        .desc
          margin-left 26px
          flex 1
          &>h6
            width 95%
            margin-bottom 20px
            font-weight bold
            font-size 28px
            color #000000
          &>p
            width 95%
            font-size 24px
            color #868686
        .btn
          width 111px
          height 53px
          line-height 53px
          font-size 26px
          color #FFFFFF
          text-align center
          border-radius 27px
          background linear-gradient(61deg, #DA81FF, #AC74FF)
      .data-num
        display flex
        margin-top 52px
        margin-bottom 47px
        &>p
          font-size 28px
          color #AEAEAE
          &:first-child
            margin-right 73px
          &>span
            font-size 22px
            color #C5C5C5
      .report
        display flex
        align-items center
        &>img
          margin-right 21px
          width 101px
          height 36px
        &>p
          flex 1
          font-size 24px
          color #343434
</style>
