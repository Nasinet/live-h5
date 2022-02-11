<template>
  <div class="honey-rank">
    <ul>
      <li @click="$router.back()"><van-icon class="back-icon" name="arrow-left" size="0.44rem" color="#4A4A4A" /></li>
      <li @click="changeTab(0)" :class="{tab: true, active: active === 0}">亲密总榜</li>
      <li @click="changeTab(1)" :class="{tab: true, active: active === 1}">亲密周榜</li>
    </ul>
    <div class="rank-item" v-for="(item, index) in list" :key="item.id">
      <img v-if="index < 3" class="index" :src="indexIcon[index]" alt="">
      <span v-else class="index-text">NO.{{ index + 1 }}</span>
      <img :src="item.user.avatar || defaultAvatar" alt="" class="avatar">
      <div class="info">
        <div class="top">
          <span>{{ item.user.nick_name }}</span>
          <img v-if="item.user.vip_level" :src="medals[item.user.vip_level - 1]" alt="" class="vip">
          <img class="user-level" :src="levelIcon[item.user.user_level]" alt="">
          <usergender :gender="item.user.profile.gender" :age="item.user.profile.age" />
        </div>
        <div class="bottom">
          <img src="./ic_heart@2x.png" alt="">
          <span>{{ item.intimacy }}</span>
        </div>
      </div>
    </div>
    <div style="height: 40px;"></div>
  </div>
</template>

<script>
import { post } from '../../common/js/http'
import { mapState, mapActions } from 'vuex'
import levelIcon from '../../common/js/level-icon'
import Usergender from '../../components/user-gender/user-gender'

export default {
  name: 'honey-rank',
  components: {
    Usergender
  },
  data() {
    return {
      active: 0,
      list: [],
      levelIcon,
      indexIcon: [require('./vip1@2x.png'), require('./vip2@2x.png'), require('./vip3@2x.png')],
      medals: [require('../../components/message/youxia@2x.png'), require('../../components/message/qishi@2x.png'), require('../../components/message/gongjue@2x.png'), require('../../components/message/king@2x.png')]
    }
  },
  created() {
    if (!this.userInfo.id) {
      this.getUserInfo()
        .then(() => {
          if (this.userInfo.is_anchor) {
            this.getList()
          }
        })
    } else {
      if (this.userInfo.is_anchor) {
        this.getList()
      }
    }
  },
  computed: {
    ...mapState(['userInfo', 'defaultAvatar'])
  },
  methods: {
    ...mapActions(['getUserInfo']),
    changeTab(tab) {
      if (tab === this.active) return
      this.active = tab
      if (this.userInfo.is_anchor) {
        this.getList()
      }
    },
    getList() {
      const url = this.active === 0 ? '/api/Intimacy/getTotalIntimacyRank' : '/api/Intimacy/getWeekIntimacyRank'
      post(url, { anchorid: this.userInfo.id })
        .then(({ data: { data } }) => {
          this.list = data
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.honey-rank
  width 100%
  &>ul
    display flex
    height 88px
    align-items center
    &>li
      height 88px
      line-height 88px
      .back-icon
        padding-left 30px
        margin-top 28px
        margin-right 41px
        vertical-align top
        font-weight bold
      &.tab
        margin-right 30px
        font-size 28px
        color #000000
        position relative
        transition all 0.2s
        &:after
          content ' '
          position absolute
          left 50%
          bottom 0
          transform translateX(-50%)
          display block
          width 26px
          height 7px
          border-radius 7px
          background transparent
        &.active
          font-size 40px
          font-weight bold
          &:after
            background $theme-color
  .rank-item
    padding-top 43px
    display flex
    align-items center
    padding-left 28px
    .index
      margin-right 34px
      width 65px
      height 75px
    .index-text
      width 97px
      font-size 28px
      color #3A3A3A
    .avatar
      margin-right 17px
      width 85px
      height 85px
      border-radius 50%
    .info
      flex 1
      .top
        margin-bottom 18px
        display flex
        align-items center
        &>span
          font-size 30px
          color #000000
        .user-level
          margin-left 13px
          margin-right 7px
          width 45px
        .vip
          width 45px
          margin-left 17px
      .bottom
        display flex
        align-items center
        &>img
          margin-right 11px
          width 25px
          height 21px
        &>span
          font-size 24px
          color #7F7F7F
</style>
