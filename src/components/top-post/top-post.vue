<template>
  <div class="top-post" @click="$router.push('/post/' + recommend.id)">
    <div class="info">
      <div class="left">
        <img src="./tittle@2x.png" alt="">
        <p>{{ recommend.title }}</p>
      </div>
      <img :src="imgs[0]" alt="">
    </div>
    <div class="data-num">
      <p class="circle" @click.stop="$router.push('/circle/' + recommend.group.id)"><span>#</span>{{ recommend.group && recommend.group.title }}</p>
      <div style="flex: 1"></div>
      <p class="icon-num">
        <i class="iconfont icon-pinglun"></i>
        <span>{{ recommend.comment_count }}</span>
      </p>
      <p :class="['icon-num', recommend.liked ? 'active' : '']" @click.stop="like">
        <i class="iconfont icon-zan"></i>
        <span>{{ recommend.like_count }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { post } from '../../common/js/http'

export default {
  name: 'top-post',
  props: {
    recommend: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapState(['userInfo']),
    imgs() {
      if (this.unlocked || this.recommend.type === 3) {
        return this.recommend.image_url ? this.recommend.image_url.split(',') : []
      }
      return this.recommend.blur_image_url ? this.recommend.blur_image_url.split(',') : []
    },
    unlocked() {
      return this.recommend.unlocked || this.recommend.unlock_price === 0 || this.recommend.user.id === this.userInfo.id
    }
  },
  methods: {
    like() {
      post('/webapi/Moment/likeMoment', {
        momentid: this.recommend.id
      })
        .then(({ data: { data } }) => {
          this.$emit('likeTop', {
            data
          })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.top-post
  margin 0 30px
  padding 30px 40px 25px 40px
  background #fff
  border-radius 10px
  box-shadow 1px 2px 21px 0px rgba(139, 59, 255, 0.14)
  margin-bottom 65px
  .info
    display flex
    justify-content space-between
    margin-bottom 29px
    &>img
      min-width 227px
      width 227px
      height 133px
      border-radius 10px
      object-fit cover
      object-position center center
    .left
      &>img
        margin-bottom 39px
        width 119px
        height 29px
      &>p
        font-size 30px
        color #343434
        line-height 38px
        ellipse-l(2)
  .data-num
    display flex
    .circle
      padding 0 12px
      height 44px
      line-height 44px
      border-radius 22px
      background #E6D5FF
      font-size 24px
      color #AC74FF
      &>span
        margin-right 9px
        display inline-block
        width 28px
        height 28px
        line-height 28px
        vertical-align middle
        text-align center
        border-radius 50%
        background #AC74FF
        color #fff
        font-size 24px
    .icon-num
      margin-left 30px
      display flex
      align-items center
      font-size 24px
      color #343434
      &.active
        color $theme-color
      &>i
        font-weight 500
        margin-right 13px
        font-size 34px
</style>
