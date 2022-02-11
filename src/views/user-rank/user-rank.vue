<template>
  <div class="user-rank">
    <scroll clickable class="scroll" ref="scroll">
      <div class="head">
        <i @click="$router.back()" class="iconfont icon-back"></i>
        <ul class="top-tab">
          <li @click="changeHead(0)" :class="{active: headActive === 0}">富豪榜</li>
          <li @click="changeHead(1)" :class="{active: headActive === 1}">明星榜</li>
        </ul>
        <ul class="tabs">
          <li @click="changeTimeHead(0)" :class="{active: rankActive === 0}">日榜</li>
          <li @click="changeTimeHead(1)" :class="{active: rankActive === 1}">周榜</li>
          <li @click="changeTimeHead(2)" :class="{active: rankActive === 2}">月榜</li>
          <li @click="changeTimeHead(3)" :class="{active: rankActive === 3}">总榜</li>
        </ul>
      </div>

      <div class="bigRank" v-if="bigRank.length">
        <div class="big-item" v-for="item in bigRank" :key="item.user.id">
          <div class="avatar">
            <img :src="item.user.avatar" alt="">
          </div>
          <p>{{ item.user.nick_name }}</p>
          <div class="icon" v-if="item.user.id">
            <img v-if="headActive === 0" :src="levelIcon[item.user.user_level]" alt="">
            <img v-else :src="anchorLevel[item.user.anchor_level]" alt="">
            <user-gender :age="item.user.profile.age" :gender="item.user.profile.gender" />
          </div>
          <div class="gold" v-if="item.user.id">{{ headActive === 0 ? item.consume : item.income }}金币</div>
        </div>
      </div>

      <div v-for="(item, index) in list.slice(3, 10)" :key="item.user.id" class="user-item">
        <span class="index" :style="{color: '#B3B3B3'}">{{ index + 4 > 9 ? index + 4 : '0' + (index + 4) }}</span>
        <img :src="item.user.avatar" alt="" class="avatar">
        <div class="info">
          <h4>{{ item.user.nick_name }}
            <img v-if="headActive===0" :src="levelIcon[item.user.user_level]" alt="">
            <img v-if="headActive===1" :src="anchorLevel[item.user.anchor_level]" alt="">
            <user-gender :gender="item.user.profile.gender" :age="item.user.profile.age" />
          </h4>
          <p class="gold">{{ headActive === 0 ? item.consume : item.income }}金币</p>
        </div>
        <div class="focus" @click="focus(item, index + 3)">{{ item.user.isattent ? '已关注' : '关注' }}</div>
      </div>
      <div style="height: 30px"></div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
import levelIcon, { anchorLevel } from '../../common/js/level-icon'
import UserGender from '../../components/user-gender/user-gender'
import { post } from '../../common/js/http'

const defaultUser = {
  id: null,
  user: {
    nick_name: '虚位以待',
    avatar: require('./moren@2x.png')
  }
}

export default {
  name: 'user-rank',
  components: {
    Scroll,
    UserGender
  },
  data() {
    return {
      headActive: 0,
      rankActive: 0,
      list: [],
      indexColor: ['#FFD52A', '#BEDAE7', '#FDB880'],
      levelIcon,
      anchorLevel
    }
  },
  computed: {
    bigRank() {
      return [this.list[1] || defaultUser, this.list[0] || defaultUser, this.list[2] || defaultUser]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeHead(head) {
      if (head === this.headActive) return
      this.headActive = head
      this.getList()
    },
    changeTimeHead(tab) {
      if (tab === this.rankActive) return
      this.rankActive = tab
      this.getList()
    },
    getList() {
      const url = this.headActive === 1 ? '/webapi/Rank/getAnchorRankList' : '/webapi/Rank/getUserRankList'
      post(url, {
        type: this.headActive
      })
        .then(({ data: { data } }) => {
          data.forEach(item => {
            if (item.anchor) {
              item.user = item.anchor
            }
          })
          this.list = data
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
            this.loading = false
          })
        })
    },
    focus(item, index) {
      post('/webapi/Anchor/attentAnchor', { anchorid: item.user.id, type: !item.user.isattent })
        .then(() => {
          const copy = { ...item }
          copy.user.isattent = !item.user.isattent
          this.$set(this.list, index, {
            ...item,
            isattent: !item.isattent
          })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.user-rank
  height 100%
  .head
    box-sizing border-box
    padding-top 30px
    position relative
    overflow hidden
    background url(./bg_top@2x.png) top 0 center no-repeat
    background-size 100% 221px
    .iconfont
      position absolute
      left 30px
      font-size 33px
      color #fff
    .top-tab
      margin 0 217px
      display flex
      justify-content space-between
      &>li
        font-size 34px
        color #fff
        &.active
          &:after
            background #fff
        &:after
          content ' '
          display block
          width 26px
          margin 0 auto
          margin-top 20px
          height 7px
          border-radius 7px
          background transparent
  .tabs
    margin 0 75px
    margin-top 40px
    height 63px
    padding 0 26px
    margin-bottom 23px
    display flex
    align-items center
    justify-content space-between
    border-radius 32px
    font-size 28px
    color #fff
    &>li
      width 92px
      height 42px
      line-height 42px
      background transparent
      text-align center
      border-radius 21px
      &.active
        border 1px solid #FFFFFF
        font-weight bold
        color #fff
  .user-item
    margin-top 50px
    padding 0 30px
    display flex
    align-items center
    .index
      margin-right 27px
      font-size 36px
      font-weight bold
    .avatar
      margin-right 21px
      width 80px
      height 80px
      border-radius 50%
    .info
      flex 1
      &>h4
        display flex
        align-items center
        font-size 30px
        color #000000
        &>img
          width 42px
          height 26px
          margin 0 12px
      &>p
        margin-top 14px
        font-size 24px
        color #5B5B5B
    .focus
      width 113px
      height 50px
      line-height 50px
      border-radius 25px
      box-shadow 1px 4px 10px 0px rgba(172, 116, 255, 0.29)
      font-size 28px
      color #AC74FF
      text-align center
      .active
        color #D9BFFF
  .bigRank
    height 552px
    display flex
    overflow hidden
    background url(./bg@2x.png) top 0 center no-repeat
    background-size 100% 100%
    .big-item
      flex 1
      &:nth-child(1)
        margin-top 61px
        .avatar
          background url(./no1@2x.png) center center no-repeat
          background-size 100% 100%
      &:nth-child(2)
        margin-top 39px
        .avatar
          background url(./no2@2x.png) center center no-repeat
          background-size 100% 100%
      &:nth-child(3)
        margin-top 97px
        .avatar
          background url(./no3@2x.png) center center no-repeat
          background-size 100% 100%
      .avatar
        width 119px
        margin 0 auto
        height 125px
        overflow hidden
        &>img
          margin-top 22px
          margin-left 14px
          width 102px
          height 102px
          border-radius 50%
      &>p
        width 98%
        margin-top 16px
        margin-bottom 11px
        text-align center
        color #FFFFFF
        font-size 30px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      .icon
        margin-bottom 13px
        display flex
        justify-content center
        &>img
          margin-right 13px
          width 42px
          height 26px
      .gold
        text-align center
        font-size 24px
        color #FFFD2D
</style>
