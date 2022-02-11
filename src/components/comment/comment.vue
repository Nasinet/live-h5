<template>
  <div class="comment border-bottom-1px" @click="$download()">
    <img :src="comment.user.avatar || $store.state.defaultAvatar" alt="">
    <div class="info">
      <h6>{{ comment.user.nick_name }} <img :src="levelIcon[comment.user.user_level]" alt=""> <user-gender :gender="comment.user.profile.gender" :age="comment.user.profile.age" /></h6>
      <p>{{ comment.content }}</p>
      <div class="data-num">
        <span>{{ comment.create_time }}</span>
        <p class="count" v-if="comment.reply_count">{{ comment.reply_count }}条回复</p>
        <div style="flex: 1"></div>
        <p class="icon-num">
          <i class="iconfont icon-pinglun"></i>
        </p>
        <p :class="['icon-num', comment.liked ? 'active' : '']" @click.stop="like">
          <i class="iconfont icon-zan"></i>
          <span>{{ comment.like_count }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import levelIcon from '../../common/js/level-icon'
import UserGender from '../user-gender/user-gender'
import { post } from '../../common/js/http'

export default {
  name: 'comment',
  components: {
    UserGender
  },
  props: {
    comment: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      levelIcon
    }
  },
  methods: {
    like() {
      post('/webapi/Moment/likeComment', {
        commentid: this.comment.id
      })
        .then(({ data: { data } }) => {
          this.$emit('liked', {
            data,
            index: this.index
          })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.comment
  display flex
  padding-bottom 25px
  margin-bottom 25px
  &>img
    width 80px
    height 80px
    border-radius 50%
    margin-right 20px
  .info
    flex 1
    &>h6
      margin-top 25px
      margin-bottom 27px
      display flex
      align-items center
      font-size 28px
      color #666666
      &>img
        margin-left 15px
        margin-right 7px
        width 42px
        height 26px
    &>p
      margin-bottom 32px
      font-size 30px
      color #000000
    .data-num
      display flex
      align-items center
      &>span
        font-size 24px
        color #B4B4B4
      .count
        margin-left 26px
        padding 0 17px
        height 38px
        line-height 38px
        border-radius 19px
        font-size 24px
        color #AC74FF
        background #E6D6FF
    .icon-num
      margin-right 30px
      display flex
      align-items center
      font-size 24px
      color #343434
      &.active
        color $theme-color
      &>i
        font-weight 500
        margin-right 13px
        vertical-align bottom
        font-size 34px
</style>
