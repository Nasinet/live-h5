<template>
  <div class="live-item" @click.stop="goDetail" :style="{backgroundImage: `url(${live.thumb})`}">
    <div class="bottom">
      <h6><img :src="anchorLevel[live.anchor.anchor_level]" alt="">{{ live.title }}</h6>
      <div class="desc">
        <p>{{ live.anchor.nick_name }}</p>
        <span>
          <van-icon name="fire-o" size="0.26rem" color="#FFFFFF" />
          {{ hot }}
        </span>
      </div>
    </div>
    <p :class="['room-type', typeClass[live.room_type]]">{{ roomType[live.room_type] }}</p>
  </div>
</template>

<script>
import { anchorLevel } from '../../common/js/level-icon'
import CryptoJS from 'crypto-js'

export default {
  name: 'live-item',
  props: {
    live: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      anchorLevel,
      roomType: ['普通房间', '私密房间', '付费房间'],
      typeClass: ['orange', 'blue', 'purple']
    }
  },
  computed: {
    hot() {
      if (this.live.hot >= 10000) {
        return (this.live.hot / 10000).toFixed(1) + 'w'
      }
      return this.live.hot
    }
  },
  methods: {
    goDetail() {
      if (this.live.room_type === 2) {
        this.$confirm({
          title: '提示',
          message: '当前房间为付费房间，请前往APP观看'
        })
          .then(() => {
            this.$download()
          })
        return
      }
      if (this.live.room_type !== 0) {
        const confirm = this.$buyConfirm({
          props: {
            type: 'password'
          },
          methods: {
            confirm: (password) => {
              if (CryptoJS.MD5(password).toString() === this.live.password) {
                this.$router.push('/live/' + this.live.anchorid)
                confirm.hide()
              } else {
                this.$toast.fail('密码错误')
              }
            }
          }
        })
        return
      }
      this.$router.push('/live/' + this.live.anchorid)
    }
  }
}
</script>

<style scoped lang="stylus">
.live-item
  width 360px
  height 360px
  border-radius 20px
  overflow hidden
  background-size cover
  background-position center center
  background-repeat no-repeat
  position relative
  margin-bottom 9px
  z-index 10000
  .bottom
    position absolute
    left 0
    bottom 0
    padding 0 17px
    width 100%
    box-sizing border-box
    height 227px
    padding-top 134px
    background linear-gradient(transparent,rgba(0,0,0,.4))
    color #fff
    &>h6
      margin-bottom 15px
      display flex
      align-items center
      font-size 24px
      &>img
        margin-right 11px
        width 42px
        height 26px
    .desc
      display flex
      justify-content space-between
      align-items center
      &>p
        width 184px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        font-size 26px
        font-weight bold
      &>span
        font-size 24px
  .room-type
    display block
    padding 0
    position absolute
    right 16px
    top 16px
    width 110px
    height 36px
    line-height 36px
    border-radius 6px
    font-size 22px
    color #fff
    text-align center
    &.orange
      background linear-gradient(-85deg,rgba(255,204,47,1),rgba(255,169,58,1))
    &.blue
      background linear-gradient(-85deg,rgba(47,218,255,1),rgba(47,145,255,1))
    &.purple
      background linear-gradient(-85deg,rgba(246,96,255,1),rgba(191,39,255,1))
</style>
