<template>
  <div class="layer" @click="$emit('close')">
    <div class="user-float" @click.stop>
      <img
        v-if="user.vip_level && user.isVip"
        :src="medalBg[user.vip_level - 1]"
        alt=""
        class="bg"
      />
      <!-- <img
        @click="report"
        src="./jubao@2x.png"
        alt=""
        v-if="!showSet"
        class="report-link"
      /> -->
      <img
        @click="$emit('set', user)"
        src="./set@2x.png"
        v-else
        alt=""
        class="report-link"
      />
      <img @click="$emit('close')" class="close" src="./close@2x.png" alt="" />
      <img :src="user.avatar || defaultAvatar" alt="" class="avatar" />
      <p class="name">{{ user.nick_name }}</p>
      <div class="level">
        <img :src="levelIcon[user.user_level]" alt="" />
        <div :class="['age', user.profile.gender === 0 ? 'man' : '']">
          <img :src="user.profile.gender === 0 ? girlIcon : boyIcon" alt="" />{{
            user.profile.age
          }}
        </div>
      </div>
      <p class="fans">粉丝：{{ user.fans_count }}</p>
      <!-- <a url="/pages/vip/vip" class="get-vip"
        >了解贵族特权 <img src="./ic_next@2x.png" alt=""
      /></a> -->
      <div class="btns">
        <div @click.prevent="focus" class="btn">
          {{ user.isattent ? '已关注' : '关注' }}
        </div>
        <i />
        <a :url="'/pages/user-home/user-home?id=' + user.id" class="btn"
          >主页</a
        >
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import levelIcon from '../../common/js/level-icon'
import { post } from '../../common/js/http'
import { mapState } from 'vuex'

export default {
  name: 'message-user-float',
  props: {
    uid: {
      type: Number,
      default: 0
    },
    showSet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      medalBg: [
        require('./top_youxia@2x.png'),
        require('./top_qishi@2x.png'),
        require('./top_gongjue@2x.png'),
        require('./top_gongjue@2x.png')
      ],
      girlIcon: require('./girl@2x.png'),
      boyIcon: require('./boy@2x.png'),
      user: {
        profile: {}
      },
      levelIcon
    }
  },
  mounted() {
    setTimeout(() => {
      this.getUser()
    }, 100)
  },
  beforeDestroy() {
    this.$off('close')
  },
  computed: {
    ...mapState(['defaultAvatar'])
  },
  methods: {
    report() {
      this.$router.push({
        path: '/pages/report-select/report-select',
        query: {
          id: this.user.id,
          type: 'anchor'
        }
      })
    },
    hideThis() {
      this.$emit('close')
    },
    async getUser() {
      try {
        const {
          data: { data }
        } = await post('/webapi/user/getUserBasicInfo', { id: this.uid }, true)
        data.isVip =
          data.vip_level && data.vip_date
            ? new Date(data.vip_date.replace(/\-/g, '/')).getTime() > Date.now()
            : false
        this.user = data
      } catch (e) {}
    },
    focus() {
      post('/webapi/Anchor/attentAnchor', {
        anchorid: this.user.id,
        type: !this.user.isattent
      }).then(({ data: { data } }) => {
        this.$set(this.user, 'isattent', !this.user.isattent)
        this.$set(this.user, 'fans_count', data.fans_count)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @keyframes scaleIn
    0%
      transform scale(0.5)
      opacity 0
    100%
      transform scale(1)
      opacity 1
  .layer
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    background rgba(0,0,0,0.4)
    z-index 100
.user-float
  padding-top 66px
  width 581px
  border-radius 20px
  border 1px solid #AFAFAF
  background #ffffff
  text-align center
  animation scaleIn 0.3s ease-in-out
  position relative
  z-index 101
  .bg
    width 600px
    height 212px
    position absolute
    top -49px
    left -10px
    z-index 1
  .report-link
    position absolute
    left 21px
    top 6px
    padding 20px
    width 31px
    height 31px
    z-index 2
    cursor pointer
  .close
    position absolute
    right 21px
    top 6px
    padding 20px
    width 21px
    height 21px
    color #3D3D3D
    font-weight bold
    cursor pointer
    z-index 2
  .avatar
    width 122px
    height 122px
    border-radius 50%
    margin-bottom 27px
    z-index 3
    position relative
  .name
    margin-bottom 20px
    font-size 30px
    color #000000
  .level
    display flex
    justify-content center
    &>img
      margin-right 13px
      width 42px
      height 26px
    .age
      margin-bottom 36px
      padding 0 4px
      height 26px
      line-height 26px
      font-size 16px
      color #fff
      text-align center
      background #FF9CE4
      border-radius 3px
      &.man
        background #6FCAFF
      &>img
        margin-right 4px
        width 13px
        height 13px
        vertical-align middle
  .fans
    margin-bottom 42px
    font-size 26px
    color #A8A8A8
  .get-vip
    font-size 24px
    color #D8A63A
    &>img
      padding-left 10px
      width 11px
      height 16px
  .btns
    display flex
    align-items center
    margin-top 28px
    height 78px
    line-height 78px
    border-top 1px solid #F4F4F4
    .btn
      flex 1
      text-align center
      font-size 28px
      color #666666
    &>i
      width 1px
      height 30px
      background #F4F4F4
</style>
