<template>
  <div class="money-rank">
    <scroll-view class="scroll" scroll-y>
      <h4 class="title">贡献榜</h4>
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="user-item"
        @click.stop="changeFloatUser(item)"
      >
        <img class="index" v-if="index < 3" :src="vipIcon[index]" alt="" />
        <span v-else>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</span>
        <img class="avatar" :src="item.user.avatar || defaultAvatar" alt="" />
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
    </scroll-view>
  </div>
</template>

<script>
import { post } from '../../common/js/http'
import levelIcon from '../../common/js/level-icon'
import { mapState } from 'vuex'

export default {
  name: 'MoneyRank',
  props: {
    anchorid: {
      type: Number,
      default: 0
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
  computed: {
    ...mapState(['defaultAvatar'])
  },
  methods: {
    changeFloatUser(item) {
      this.$emit('changeFloatUser', item.user.id)
    },
    getList() {
      post(
        '/webapi/intimacy/getTotalIntimacyRank',
        {
          anchorid: this.anchorid
        },
        true
      ).then(({ data: { data } }) => {
        data.forEach(item => {
          item.user.isVip = new Date(item.user.vip_date).getTime() > Date.now()
          item.gold =
            item.intimacy < 1000
              ? item.intimacy
              : (item.intimacy / 10000).toFixed(1) + '万'
        })
        this.list = data
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.money-rank
  height 100%
  .scroll
    height 100%
  .title
    padding-top 39rpx
    text-align center
    font-size 32rpx
    color #000000
  .user-item
    display flex
    padding 0 30rpx
    align-items center
    margin-top 43rpx
    .index
      margin-right 24rpx
      width 60rpx
      height 69rpx
    &>span
      margin-right 24rpx
      width 60rpx
      text-align center
      font-weight bold
      font-size 32rpx
      color #9F9F9F
    .avatar
      margin-right 15rpx
      width 71rpx
      height 71rpx
      border-radius 50%
    .vip
      width 45rpx
      margin-right 15rpx
    .level
      width 42rpx
      height 26rpx
      margin-right 14rpx
    .name
      flex 1
      font-size 28rpx
      color #505050
    .gold
      font-weight bold
      font-size 26rpx
      color #000000
</style>
