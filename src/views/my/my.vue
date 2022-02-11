<template>
  <div class="my">
    <scroll class="scroll" ref="scroll" clickable :list="links">
      <router-link to="/my/msg" v-if="userInfo.id" class="msg">
        <img src="./message@2x.png" alt="">
      </router-link>
      <div class="msg" v-else></div>
      <div class="user-info" v-if="userInfo.id">
        <img :src="userInfo.avatar || $store.state.defaultAvatar" alt="">
        <div class="desc">
          <h4>{{ userInfo.nick_name }} <img class="level" :src="levelIcon[userInfo.user_level]" alt=""> <img @click="$router.push('/my/info')" class="edit" src="./ic_bianji@2x.png" alt=""></h4>
          <p>ID：{{ userInfo.id }}</p>
        </div>
      </div>

      <router-link v-else class="login" to="/login">登录/注册</router-link>

      <div class="data-num">
        <div class="num">
          <p>{{ userInfo.attent_count }}</p>
          <span>关注</span>
        </div>
        <div class="num">
          <p>{{ userInfo.attent_count }}</p>
          <span>粉丝</span>
        </div>
        <div class="num">
          <p>{{ userInfo.visitor_count }}</p>
          <span>访客</span>
        </div>
        <div style="flex: 1;"></div>
        <img v-if="userInfo.id" @click="$router.push('/my/recharge')" src="./button_chongzhi@2x.png" alt="">
      </div>

<!--      <div class="vip">-->
<!--        <div class="link" @click="$download()">-->
<!--          <p>开通贵族</p>-->
<!--          <span>查看详情 <i class="iconfont icon-right"></i></span>-->
<!--        </div>-->
<!--        <div class="imgs">-->
<!--          <img src="./yaoqing@2x.png" alt="" @click="$download()">-->
<!--          <img src="./fuli@2x.png" alt="" @click="$download()">-->
<!--        </div>-->
<!--      </div>-->

      <div @click="goIn(item)" class="link-item" v-for="item in links" :key="item.to" v-show="!item.hide">
        <img :src="item.icon" alt="">
        <p>{{ item.title }}</p>
        <i class="iconfont icon-right"></i>
      </div>
      <div style="height: 40px;"></div>
    </scroll>
    <tab-bar/>
  </div>
</template>

<script>
import TabBar from '../../components/tab-bar/tab-bar'
import Scroll from '../../components/scroll/scroll'
import { mapState, mapActions } from 'vuex'
import levelIcon from '../../common/js/level-icon'

export default {
  name: 'my',
  components: {
    TabBar,
    Scroll
  },
  data() {
    return {
      levelIcon
    }
  },
  created() {
    this.getUserInfo()
  },
  computed: {
    ...mapState(['userInfo']),
    links() {
      return [
        { to: '/my/wallet', icon: require('./ic_qianbao@2x.png'), title: '我的钱包' },
        { to: '/vip', icon: require('./ic_huiyuan@2x.png'), title: '贵族中心' },
        // { to: '/personal', icon: require('./shop@2x.png'), title: '直播小店' },
        { to: '/my/dynamic', icon: require('./moment@2x.png'), title: '我的动态' },
        { to: '/my/collection', icon: require('./clllection@2x.png'), title: '我的收藏' },
        { to: '/my/rank', icon: require('./ic_qinmibang@2x.png'), title: '亲密榜', hide: !this.userInfo.is_anchor },
        { to: '/my/verify', icon: require('./ic_become@2x.png'), title: '认证主播', hide: this.userInfo.is_anchor },
        { to: '/my/income', icon: require('./income@2x.png'), title: '收益记录' },
        { to: '/guild', icon: require('./ic_gonghui@2x.png'), title: '主播公会', hide: !this.userInfo.is_anchor },
        { to: '/cooperation', icon: require('./ic_hezuo@2x.png'), title: '商务合作' },
        { to: '/setup', icon: require('./ic_shezhi@2x.png'), title: '退出登录' }
      ]
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    goIn(item) {
      if (!this.userInfo.id) {
        this.$router.push('/login')
        return
      }
      if (item.to === '/setup') {
        localStorage.clear()
        window.location.href = '/login'
        return
      }
      // if (item.to !== '/cooperation') {
      //   this.$download()
      //   return
      // }
      this.$router.push(item.to)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.my
  height 100%
  overflow hidden
  .scroll
    height calc(100% - 98px)
    .login
      display block
      width 215px
      height 64px
      line-height 64px
      margin 0 auto
      margin-bottom 77px
      border-radius 32px
      border 1px solid $theme-color
      text-align center
      font-size 32px
      color $theme-color
    .msg
      padding-right 24px
      height 80px
      display flex
      align-items center
      justify-content flex-end
      &>img
        width 54px
        height 54px
    .user-info
      padding 0 30px
      display flex
      align-items center
      &>img
        margin-right 23px
        width 106px
        height 106px
        border-radius 50%
      .desc
        &>h4
          margin-bottom 18px
          display flex
          align-items center
          font-size 34px
          color #000000
          .level
            margin-left 14px
            margin-right 26px
            width 42px
            height 26px
          .edit
            width 31px
            height 31px
        &>p
          font-size 26px
          color #9B9B9B
    .data-num
      display flex
      margin-top 37px
      margin-bottom 53px
      align-items center
      padding-left 34px
      padding-right 25px
      .num
        margin-right 70px
        text-align center
        &>p
          margin-bottom 23px
          font-weight bold
          font-size 30px
          color #010101
        &>span
          font-size 26px
          color #898989
      &>img
        width 152px
        height 71px
    .vip
      margin 0 15px
      height 312px
      background url(./bg_guizu@2x.png) center center no-repeat
      background-size contain
      .link
        display flex
        align-items center
        justify-content space-between
        padding 37px 57px 79px 52px
        &>p
          font-weight bold
          font-size 26px
          color #896B42
        &>span
          line-height 24px
          font-size 24px
          color #896B42
          &>i
            font-size 20px
      .imgs
        display flex
        padding 0 38px
        justify-content space-between
        &>img
          width 307px
          height 129px
    .link-item
      display flex
      margin-top 40px
      align-items center
      padding-left 21px
      padding-right 31px
      &>img
        margin-right 20px
        width 54px
        height 54px
      &>p
        flex 1
        font-size 28px
        color #000000
      &>i
        font-size 22px
        color #AEAEAE
</style>
