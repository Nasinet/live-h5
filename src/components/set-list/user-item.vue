<template>
  <div class="rank-item">
    <img class="avatar" :src="item.avatar || defaultAvatar" alt="" />
    <img
      v-if="item.vip_level && item.isVip"
      class="model"
      :src="medals[item.vip_level - 1]"
      alt=""
    />
    <!--    <img class="model" :src="medals[1]" alt="">-->
    <!--    <level-icon :level="item.user_level" height="16px" width="25px" />-->
    <img class="user-level" :src="levelIcon[item.user_level]" alt="" />
    <img src="./fangguan@2x.png" v-if="type === 0" class="mgr" alt="" />
    <p @click.stop="$emit('showFloatUser', item)" class="name right">
      {{ item.nick_name }}
    </p>
    <div class="btn" @click="cancel(type)">
      {{ type === 0 ? '取消房管' : '取消禁言' }}
    </div>
  </div>
</template>

<script>
import levelIcon from '../../common/js/level-icon'
import { post } from '../../common/js/http'
import { mapState } from 'vuex'

export default {
  name: 'rank-item',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 0
    },
    gold: {
      type: Number,
      default: 0
    },
    anchorid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      medals: [
        require('../message/youxia@2x.png'),
        require('../message/qishi@2x.png'),
        require('../message/gongjue@2x.png'),
        require('../message/king@2x.png')
      ],
      levelIcon
    }
  },
  computed: {
    ...mapState(['defaultAvatar'])
  },
  methods: {
    cancel(type) {
      if (type === 0) {
        post('/webapi/live/setRoomMgr', { mgrid: this.item.id, type: 0 }).then(
          () => {
            this.$emit('cancel', this.index)
          }
        )
      } else {
        post('/webapi/live/banUser', {
          userid: this.item.id,
          type: 0,
          anchorid: this.anchorid
        }).then(() => {
          this.$emit('cancel', this.index)
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "../../common/style/variable.styl"
.rank-item
  margin 0 30px
  height 125px
  display flex
  align-items center
  &.bg
    background #F9F9FF
  &>span
    margin-right 10px
    font-size 12px
    color #D5D5D5
  .avatar
    width 83px
    height 83px
    margin-right 23px
    border-radius 50%
  .name
    font-size 30px
    color #000
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    &.right
      flex 1
      cursor pointer
  .model
    width 45px
    height 47px
    margin-right 15px
  .user-level
    margin-right 14px
    width 42px
    height 26px
  .mgr
    width 56px
    height 26px
    margin-right 10px
  .gold
    font-size 12px
    color #FEC838
    &>span
      color #000000
  .btn
    padding 0 14px
    height 46px
    line-height 46px
    border-radius 23px
    border 1px solid $theme-color
    background #fff
    color $theme-color
    cursor pointer
    font-size 22px
    &.active
      color #BDB0EF
</style>
