<template>
  <div class="money-rank" :style="{ background: background }">
    <scroll clickable ref="scroll">
      <h4 class="title">贡献榜</h4>
      <div v-for="(item, index) in list" :key="item.id" class="user-item">
        <img class="index" v-if="index < 3" :src="vipIcon[index]" alt="" />
        <span v-else>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</span>
        <img
          class="avatar"
          :src="item.user.avatar || $store.state.defaultAvatar"
          alt=""
        />
        <img
          class="vip"
          v-if="item.user.vip_level && item.isVip"
          src=""
          alt=""
        />
        <img class="level" :src="levelIcon[item.user.user_level]" alt="" />
        <p class="name ellipse-one">{{ item.user.nick_name }}</p>
        <p class="gole">{{ item.gold }}</p>
      </div>
    </scroll>
  </div>
</template>

<script>
import { post } from '../../common/js/http'
import Scroll from '../../components/scroll/scroll'
import levelIcon from '../../common/js/level-icon'

export default {
  name: 'money-rank',
  components: {
    Scroll
  },
  props: {
    anchorid: {
      type: Number,
      default: 0
    },
    background: {
      type: String,
      default: '#F4F7FF'
    }
  },
  data() {
    return {
      list: [],
      levelIcon,
      vipIcon: [
        require('./vip1@2x.png'),
        require('./vip2@2x.png'),
        require('./vip3@2x.png')
      ],
      medals: [
        require('../../components/message/youxia@2x.png'),
        require('../../components/message/qishi@2x.png'),
        require('../../components/message/gongjue@2x.png'),
        require('../../components/message/king@2x.png')
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      post('/webapi/intimacy/getTotalIntimacyRank', {
        anchorid: this.anchorid,
        hideLoading: true
      }).then(({ data: { data } }) => {
        data.forEach(item => {
          item.user.isVip = new Date(item.user.vip_date).getTime() > Date.now()
          item.gold =
            item.intimacy < 1000
              ? item.intimacy
              : (item.intimacy / 10000).toFixed(1) + '万'
        })
        this.list = data
        this.$nextTick(() => {
          this.$refs.scroll.refresh()
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.money-rank
  height 100%
  .title
    padding-top 39px
    text-align center
    font-size 32px
    color #000000
  .user-item
    display flex
    padding 0 30px
    align-items center
    margin-top 43px
    .index
      margin-right 24px
      width 60px
      height 69px
    &>span
      margin-right 24px
      width 60px
      text-align center
      font-weight bold
      font-size 32px
      color #9F9F9F
    .avatar
      margin-right 15px
      width 71px
      height 71px
      border-radius 50%
    .vip
      width 45px
      margin-right 15px
    .level
      width 42px
      height 26px
      margin-right 14px
    .name
      flex 1
      font-size 28px
      color #505050
    .gold
      font-weight bold
      font-size 26px
      color #000000
</style>
