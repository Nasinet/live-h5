<template>
  <div class="post-item border-bottom-1px" @click="goDetail">
    <div class="user">
      <i v-if="type==='detail'" @click.stop="$router.back()" class="iconfont icon-back"></i>
      <img :src="post.user.avatar || $store.state.defaultAvatar" alt="">
      <div class="info">
        <h6>{{ post.user.nick_name }}</h6>
        <div class="level">
          <img :src="levelImg" alt="">
          <div :class="['sex', post.user.profile.gender === 1 && 'man']">
            <i :class="{iconfont: true, 'icon-nv': post.user.profile.gender === 0, 'icon-nan': post.user.profile.gender === 1}"></i>
            <span>{{ post.user.profile.age }}</span>
          </div>
        </div>
      </div>
    </div>

    <h4 :class="type === 'item' ? 'ignore' : ''">{{ post.title }}</h4>

    <div class="imgs" v-if="post.type === 2 && unlock">
      <img @click.stop="previewImg(item)" v-for="(item, index) in imgs" :key="index" :src="item" alt="">
    </div>

    <div class="imgs" v-if="post.type === 2 && !unlock">
      <div @click.stop="unlockDy" v-for="(item, index) in blurImgs" :key="item" :style="{backgroundImage: `url(${item})`}" class="img">
        <template v-if="index === 0">
          <img src="./nofufei2@2x.png" alt="">
          <p>{{ post.unlock_price }}金币</p>
        </template>
      </div>
    </div>

    <div @click.stop="createPlayer" v-if="post.type === 3" :id="'video_wrap' + index + column" :style="{backgroundImage: `url(${imgs[0]})`}" class="video-wrap">
      <i class="iconfont icon-play_fill" v-if="unlock"></i>
      <template v-else>
        <img src="./nofufei2@2x.png" alt="">
        <p>{{ post.unlock_price }}金币</p>
      </template>
      <div class="num">
        <span>{{ post.watch_count }}人观看</span>
        <span v-if="false">{{ post.create_time }}</span>
      </div>
    </div>

<!--    <div class="short-article" v-if="post.type === 1">-->
<!--&lt;!&ndash;      <div class="block">&ndash;&gt;-->
<!--&lt;!&ndash;        <span>短文</span>&ndash;&gt;-->
<!--&lt;!&ndash;        <p>{{ post.title }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--      <p :class="['content', type === 'item' ? 'ignore' : '']" v-html="title"></p>-->
<!--    </div>-->

    <div class="time"><p class="circle" @click.stop="$router.push('/circle/' + post.group.id)" v-if="post.group"><span>#</span>{{ post.group.title }}</p> <span>{{ post.create_time }}</span></div>
    <div class="data-num" v-if="type==='item'">
      <p :class="['icon-num', post.liked ? 'active' : '']" @click.stop="like">
        <i class="iconfont icon-zan"></i>
        <span>{{ post.like_count }}</span>
      </p>
      <p class="icon-num">
        <i class="iconfont icon-pinglun"></i>
        <span>{{ post.comment_count }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import levelIcon from '../../common/js/level-icon'
import { mapState, mapMutations } from 'vuex'
import { post } from '../../common/js/http'

export default {
  name: 'post-item',
  props: {
    post: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: 'item'
    },
    index: {
      type: Number,
      default: 0
    },
    column: {
      type: String,
      default: ''
    },
    active: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showAlert: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'currentVideo']),
    title() {
      return this.post.title.replace(/[\r\n]/g, '<br>')
    },
    levelImg() {
      return levelIcon[this.post.user.user_level]
    },
    imgs() {
      return this.post.image_url ? this.post.image_url.split(',') : []
    },
    blurImgs() {
      return this.post.blur_image_url ? this.post.blur_image_url.split(',') : []
    },
    unlock() {
      return this.post.unlocked || this.post.unlock_price === 0 || this.post.user.id === this.userInfo.id
    }
  },
  beforeDestroy() {
    if (this.player) this.player.destroy()
  },
  methods: {
    ...mapMutations(['changeVideo']),
    goDetail() {
      if (this.type === 'item') {
        this.$router.push('/post/' + this.post.id)
      }
    },
    previewImg(img) {
      this.$previewImg({
        props: {
          img
        }
      })
    },
    createPlayer() {
      if (!this.unlock) {
        this.unlockDy()
        return
      }
      if (this.player) return
      this.player = new this.$DPlayer({
        container: document.getElementById('video_wrap' + this.index + this.column),
        video: {
          url: this.post.video_url,
          pic: this.post.cover
        },
        autoplay: true
        // volume: 0.5,
        // loop: true
      })

      this.player.on('play', () => {
        this.changeVideo('video_wrap' + this.index + this.column)
      })
    },
    unlockDy() {
      const confirm = this.$buyConfirm({
        props: {
          post: this.post
        },
        methods: {
          confirm: () => {
            post('/Moment/unlockMoment', { momentid: this.post.id })
              .then(() => {
                const copy = { ...this.post }
                copy.unlocked = true
                this.$emit('changeDyItem', {
                  index: this.index,
                  item: copy
                })
                confirm.hide()
                this.$nextTick(() => {
                  if (this.post.type === 3) {
                    this.createPlayer()
                  }
                })
              })
              .catch(() => {
                confirm.hide()
              })
          }
        }
      })
    },
    like() {
      post('/webapi/Moment/likeMoment', {
        momentid: this.post.id
      })
        .then(({ data: { data } }) => {
          this.$emit('liked', {
            data,
            index: this.index
          })
        })
    }
  },
  watch: {
    currentVideo(newVal) {
      if (newVal !== 'video_wrap' + this.index + this.column) {
        this.player && this.player.pause()
      }
    },
    active(newVal) {
      if (newVal !== this.column) {
        this.player && this.player.pause()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.post-item
  padding 0 30px
  padding-bottom 30px
  margin-bottom 35px
  .user
    display flex
    align-items center
    .iconfont
      margin-right 33px
      font-size 33px
    &>img
      margin-right 20px
      width 80px
      height 80px
      border-radius 50%
    .info
      &>h6
        margin-bottom 10px
        font-size 30px
        color #343434
      .level
        display flex
        &>img
          width 42px
          height 26px
        .sex
          margin-left 7px
          border-radius 3px
          width 42px
          height 26px
          line-height 26px
          text-align center
          font-size 16px
          color #FFFFFF
          background #FF9CE4
          &.man
            background #70CAFF
          &>i
            margin-right 0 !important
            font-size 16px
            color #fff
  &>h4
    margin-top 33px
    margin-bottom 30px
    line-height 36px
    font-size 30px
    color #343434
    &.ignore
      ellipse-l(5)
  .imgs
    display flex
    flex-wrap wrap
    &>img
      margin-right 9px
      margin-bottom 9px
      width 224px
      height 224px
      object-fit cover
      &:nth-child(3n+0)
        margin-right 0
    .img
      margin-right 9px
      margin-bottom 9px
      width 224px
      height 224px
      background-size cover
      background-repeat no-repeat
      background-position center center
      position relative
      display flex
      align-items center
      justify-content center
      &>img
        width 96px
        height 96px
      &>p
        position absolute
        right 10px
        top 10px
        padding 0 13px
        font-size 22px
        color #FFFFFF
        height 36px
        line-height 36px
        border-radius 18px
        background $theme-color
      &:nth-child(3n+0)
        margin-right 0
  .video-wrap
    height 402px
    background-repeat no-repeat
    background-size cover
    background-position center center
    position relative
    &>i
      position absolute
      left 50%
      top 50%
      transform translate3d(-50%, -50%, 0)
      font-size 66px
      color rgba(255,255,255,0.6)
    &>img
      width 96px
      height 96px
      position absolute
      left 50%
      top 50%
      transform translate3d(-50%, -50%, 0)
    &>p
      position absolute
      right 21px
      top 21px
      padding 0 13px
      font-size 22px
      color #FFFFFF
      height 36px
      line-height 36px
      border-radius 18px
      background $theme-color
    .num
      position absolute
      left 0
      bottom 0
      width 100%
      box-sizing border-box
      padding 0 18px
      padding-bottom 20px
      display flex
      justify-content space-between
      font-size 22px
      color #FFFFFF
  .short-article
    margin-top 33px
    .block
      display block
      margin-bottom 36px
      height 99px
      line-height 99px
      padding-left 100px
      border-radius 10px
      background #F4F4F4
      position relative
      overflow hidden
      &>span
        position absolute
        height 46px
        line-height 46px
        width 86px
        left 0
        top 0
        text-align center
        font-size 26px
        color #FEFEFE
        background linear-gradient(86deg, #AC74FF, #BD90FF)
        border-bottom-right-radius 40px
      &>p
        font-size 30px
        color #343434
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
    &>p
      line-height 36px
      font-size 26px
      color #343434
      &.ignore
        ellipse-l(5)
  .circle
    display inline-block
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
  .time
    display flex
    justify-content space-between
    align-items center
    margin-top 33px
    margin-bottom 27px
    font-size 24px
    color #B9B9B9
  .data-num
    display flex
    .icon-num
      margin-right 30px
      display flex
      align-items center
      font-size 24px
      color #343434
      &.active
        color #ff7623
      &>i
        font-weight 500
        margin-right 13px
        font-size 34px
</style>
