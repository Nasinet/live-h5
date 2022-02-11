<template>
  <div class="vip">
    <back-header class="vip-header" title="贵族中心" color="#fff" />
    <ul class="tab">
      <li @click="changeTab(0)" :class="{active: active === 0}">游侠</li>
      <li @click="changeTab(1)" :class="{active: active === 1}">骑士</li>
      <li @click="changeTab(2)" :class="{active: active === 2}">公爵</li>
      <li @click="changeTab(3)" :class="{active: active === 3}">国王</li>
    </ul>
    <template v-if="active===0">
      <img src="./youxia/youxia@2x.png" alt="" class="medal">
      <p class="date" v-if="vipText">{{ vipText }}</p>
      <ul class="privilege">
        <li>
          <img src="./youxia/texiao@2x.png" alt="">
          <h6>开通特效</h6>
          <p>全频道广播</p>
        </li>
        <li>
          <img src="./youxia/mingpian@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>尊贵身份象征</p>
        </li>
        <li>
          <img src="./youxia/lianmai@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>与主播零距离<br>亲密互动</p>
        </li>
        <li>
          <img src="./youxia/gift@2x.png" alt="">
          <h6>贵族礼物</h6>
          <p>贵族专属礼物</p>
        </li>
        <li>
          <img src="./youxia/xunzhang@2x.png" alt="">
          <h6>贵族勋章</h6>
          <p>贵族专属勋章</p>
        </li>
        <li>
          <img src="./youxia/jinyan@2x.png" alt="">
          <h6>进场欢迎</h6>
          <p>进场信息提示</p>
        </li>
        <li>
          <img src="./youxia/dongtai@2x.png" alt="">
          <h6>私密动态</h6>
          <p>免费查看私密<br>动态</p>
        </li>
        <li>
          <img src="./youxia/changliao@2x.png" alt="">
          <h6>无限畅聊</h6>
          <p>与主播无限畅聊</p>
        </li>
        <li>
          <img src="./youxia/jinyan@2x.png" alt="">
          <h6>防禁言</h6>
          <p>无法被房管禁言</p>
        </li>
      </ul>
    </template>
    <template v-if="active===1">
      <img src="./qishi/qishi@2x.png" alt="" class="medal">
      <p class="date" v-if="vipText">{{ vipText }}</p>
      <ul class="privilege">
        <li>
          <img src="./qishi/texiao@2x.png" alt="">
          <h6>开通特效</h6>
          <p>全频道广播</p>
        </li>
        <li>
          <img src="./qishi/mingpian@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>尊贵身份象征</p>
        </li>
        <li>
          <img src="./qishi/lianmai@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>与主播零距离<br>亲密互动</p>
        </li>
        <li>
          <img src="./qishi/gift@2x.png" alt="">
          <h6>贵族礼物</h6>
          <p>贵族专属礼物</p>
        </li>
        <li>
          <img src="./qishi/xunzhang@2x.png" alt="">
          <h6>贵族勋章</h6>
          <p>贵族专属勋章</p>
        </li>
        <li>
          <img src="./qishi/huanying@2x.png" alt="">
          <h6>进场欢迎</h6>
          <p>进场信息提示</p>
        </li>
        <li>
          <img src="./qishi/dongtai@2x.png" alt="">
          <h6>私密动态</h6>
          <p>免费查看私密<br>动态</p>
        </li>
        <li>
          <img src="./qishi/changliao@2x.png" alt="">
          <h6>无限畅聊</h6>
          <p>与主播无限畅聊</p>
        </li>
        <li>
          <img src="./qishi/jinyan@2x.png" alt="">
          <h6>防禁言</h6>
          <p>无法被房管禁言</p>
        </li>
      </ul>
    </template>
    <template v-if="active===2">
      <img src="./gongjue/gongjue@2x.png" alt="" class="medal">
      <p class="date" v-if="vipText">{{ vipText }}</p>
      <ul class="privilege">
        <li>
          <img src="./gongjue/texiao@2x.png" alt="">
          <h6>开通特效</h6>
          <p>全频道广播</p>
        </li>
        <li>
          <img src="./gongjue/mingpian@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>尊贵身份象征</p>
        </li>
        <li>
          <img src="./gongjue/lianmai@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>与主播零距离<br>亲密互动</p>
        </li>
        <li>
          <img src="./gongjue/gift@2x.png" alt="">
          <h6>贵族礼物</h6>
          <p>贵族专属礼物</p>
        </li>
        <li>
          <img src="./gongjue/xunzhang@2x.png" alt="">
          <h6>贵族勋章</h6>
          <p>贵族专属勋章</p>
        </li>
        <li>
          <img src="./gongjue/huanying@2x.png" alt="">
          <h6>进场欢迎</h6>
          <p>进场信息提示</p>
        </li>
        <li>
          <img src="./gongjue/dongtai@2x.png" alt="">
          <h6>私密动态</h6>
          <p>免费查看私密<br>动态</p>
        </li>
        <li>
          <img src="./gongjue/changliao@2x.png" alt="">
          <h6>无限畅聊</h6>
          <p>与主播无限畅聊</p>
        </li>
        <li>
          <img src="./gongjue/jinyan@2x.png" alt="">
          <h6>防禁言</h6>
          <p>无法被房管禁言</p>
        </li>
      </ul>
    </template>
    <template v-if="active===3">
      <img src="./king/king@2x.png" alt="" class="medal">
      <p class="date">{{ vipText }}</p>
      <ul class="privilege">
        <li>
          <img src="./king/texiao@2x.png" alt="">
          <h6>开通特效</h6>
          <p>全频道广播</p>
        </li>
        <li>
          <img src="./king/mingpian@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>尊贵身份象征</p>
        </li>
        <li>
          <img src="./king/lianmai@2x.png" alt="">
          <h6>贵族名片</h6>
          <p>与主播零距离<br>亲密互动</p>
        </li>
        <li>
          <img src="./king/gift@2x.png" alt="">
          <h6>贵族礼物</h6>
          <p>贵族专属礼物</p>
        </li>
        <li>
          <img src="./king/xunzhang@2x.png" alt="">
          <h6>贵族勋章</h6>
          <p>贵族专属勋章</p>
        </li>
        <li>
          <img src="./king/huanying@2x.png" alt="">
          <h6>进场欢迎</h6>
          <p>进场信息提示</p>
        </li>
        <li>
          <img src="./king/dongtai@2x.png" alt="">
          <h6>私密动态</h6>
          <p>免费查看私密<br>动态</p>
        </li>
        <li>
          <img src="./king/changliao@2x.png" alt="">
          <h6>无限畅聊</h6>
          <p>与主播无限畅聊</p>
        </li>
        <li>
          <img src="./king/jinyan@2x.png" alt="">
          <h6>防禁言</h6>
          <p>无法被房管禁言</p>
        </li>
      </ul>
    </template>
    <div class="pay" v-if="userInfo.vip_level <= active + 1">
      <div class="desc">
        <p>赠送 <span>{{ prices[active].gold }}</span> 金币</p>
        <p><span>{{ prices[active].price }}</span>元/<span>30</span>天</p>
      </div>
      <img v-if="!vipText" src="./youxia/button@2x.png" alt="">
      <img v-else src="./gongjue/button_next@2x.png" alt="">
    </div>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import { post } from '../../common/js/http'
import { mapState } from 'vuex'

export default {
  name: 'vip',
  components: {
    BackHeader
  },
  data() {
    return {
      active: 0,
      prices: []
    }
  },
  created() {
    this.active = this.userInfo.vip_level > 0 ? this.userInfo.vip_level - 1 : 0
    this.getPrice()
  },
  computed: {
    ...mapState(['userInfo']),
    vipText() {
      if (this.userInfo.vip_level && new Date(this.userInfo.vip_date).getTime() > Date.now()) {
        if (this.userInfo.vip_level === this.active + 1) {
          return `${this.userInfo.vip_date}到期`
        }
      }
      return ''
    }
  },
  methods: {
    changeTab(tab) {
      if (tab === this.active) return
      this.active = tab
    },
    getPrice() {
      post('/webapi/vip/getVipPriceList')
        .then(({ data: { data } }) => {
          this.prices = data
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.vip
  width 100%
  min-height 100%
  box-sizing border-box
  background url(./youxia/bg@2x.png) center center no-repeat
  background-size cover
  .vip-header
    position relative
    background transparent
  .tab
    display flex
    &>li
      padding-top 40px
      flex 1
      text-align center
      font-size 30px
      color #83796A
      &:after
        content ' '
        display block
        width 23px
        margin 0 auto
        margin-top 17px
        height 6px
        border-radius 3px
        background transparent
      &.active
        color #E8CF8B
        &:after
          background #E8CF8B
  .medal
    display block
    width 320px
    margin 0 auto
    height 320px
  .date
    margin-top 17px
    text-align center
    font-size 30px
    color #E8CF8B
  .privilege
    margin-top 97px
    display flex
    flex-wrap wrap
    justify-content space-between
    &>li
      margin-bottom 54px
      width 33%
      text-align center
      &>img
        padding-bottom 27px
        width 79px
        height 79px
      &>h6
        margin-bottom 18px
        font-size 26px
        color #D9D9D9
      &>p
        line-height 36px
        font-size 24px
        color #939393
  .pay
    display flex
    height 157px
    align-items center
    margin 0 30px
    border-top 1px solid #4C485A
    .desc
      flex 1
      &>p
        line-height 48px
        font-size 32px
        color #939393
        &>span
          color #D1B786
    &>img
      width 224px
      height 78px
</style>
