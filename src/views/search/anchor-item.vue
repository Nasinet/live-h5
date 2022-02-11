<template>
  <div class="anchor-item" @click="$router.push('/live/' + anchor.id)">
    <img :src="anchor.avatar || $store.state.defaultAvatar" alt="">
    <div class="info">
      <h6>
        <span>{{ anchor.nick_name }}</span>
        <img :src="anchorLevel[anchor.anchor_level]" alt="">
        <user-gender :age="anchor.profile.age" :gender="anchor.profile.gender" />
      </h6>
      <p>{{ anchor.profile.signature }}</p>
    </div>
    <div @click.stop="focus" class="focus">{{ anchor.isattent ? '已关注' : '+关注' }}</div>
  </div>
</template>

<script>
import UserGender from '../../components/user-gender/user-gender'
import { anchorLevel } from '../../common/js/level-icon'
import { post } from '../../common/js/http'

export default {
  name: 'anchor-item',
  components: {
    UserGender
  },
  props: {
    anchor: {
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
      anchorLevel
    }
  },
  methods: {
    focus() {
      post('/webapi/Anchor/attentAnchor', {
        anchorid: this.anchor.id,
        type: !this.anchor.isattent
      })
        .then(() => {
          this.$emit('focus', { isattent: !this.anchor.isattent, index: this.index })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.anchor-item
  padding 0 30px
  display flex
  align-items center
  margin-top 52px
  &>img
    width 85px
    height 85px
    margin-right 17px
    border-radius 50%
  .info
    flex 1
    &>p
      font-size 26px
      color #7F7F7F
    &>h6
      display flex
      align-items center
      margin-bottom 16px
      &>span
        max-width 360px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        font-size 30px
        color #000000
      &>img
        width 42px
        height 26px
        margin-left 13px
        margin-right 7px
  .focus
    width 115px
    height 46px
    border-radius 23px
    line-height 46px
    border 1px solid $theme-color
    color $theme-color
    font-size 24px
    text-align center
</style>
