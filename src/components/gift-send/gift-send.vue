<template>
  <div>
    <div class="mask" @click="onClose" v-if="!closeAnimation"></div>
    <div class="gift-send" :class="{ close: closeAnimation }">
      <div class="head">
        <span>礼物</span>
        <a url="/pages/recharge/recharge"
          >充值 <img src="./more@2x.png" alt=""
        /></a>
      </div>
      <div class="swiper-container detail-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in list" :key="index">
            <div
              @click.stop="active = gift"
              v-for="gift in item"
              :key="gift.id"
              :class="{ gift: true, active: active.id === gift.id }"
            >
              <img mode="aspectFit" :src="gift.icon" alt="" />
              <p>{{ gift.title }}</p>
              <span>{{ gift.price }}<img src="./coin@2x.png" alt=""/></span>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="ac">
        <p class="price">{{ total }} <img src="./coin@2x.png" alt="" /></p>
        <div class="submit" @click="sendGift">
          <p @click.stop="toggleSelect(count)">
            {{ count }} <img src="./up@2x.png" alt="" />
          </p>
        </div>
        <div class="select" v-if="showSelect">
          <p
            v-for="item in select"
            @click.stop="toggleSelect(item)"
            :key="item"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '../../common/js/http'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'gift-send',
  props: {
    detail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      closeAnimation: false,
      list: [],
      active: {},
      count: 1,
      select: [1, 10, 66, 88, 100, 520, 1314],
      showSelect: false,
      currentSlide: 0
    }
  },
  mounted() {
    this.createSwiper()
    this.getList()
  },
  computed: {
    ...mapState(['userInfo']),
    total() {
      return this.active.price * this.count || 0
    }
  },
  methods: {
    ...mapMutations(['changeUserInfo']),
    onClose() {
      this.closeAnimation = true
      const timer = setTimeout(() => {
        this.$emit('close')
        clearTimeout(timer)
      }, 300)
    },
    createSwiper() {
      this.swiper = new window.Swiper('.detail-swiper', {
        loop: false,
        observer: true,
        observeParents: true,
        pagination: {
          el: '.swiper-pagination'
        }
      })
    },
    toggleSelect(num) {
      this.count = num
      this.showSelect = !this.showSelect
    },
    async sendGift() {
      if (!this.detail.anchorid) {
        this.$toast.fail('主播还未开播')
        return
      }
      try {
        this.onClose()
        const {
          data: { data }
        } = await post('/webapi/gift/sendGift', {
          giftid: this.active.id,
          anchorid: this.detail.anchorid,
          liveid: this.detail.liveid,
          count: this.count
        })

        this.changeUserInfo({
          ...this.userInfo,
          gold: data.gold
        })
      } catch (e) {}
    },
    getList() {
      post('/webapi/gift/getGiftList', {}, true).then(({ data: { data } }) => {
        const list = []
        this.active = data[0]
        const count = Math.ceil(data.length / 8)
        for (let i = 0; i < count; i++) {
          list.push(data.slice(8 * i, 8 * (i + 1)))
        }
        this.list = list
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @keyframes slowUp
    0%
      transform translate3d(0, 100%, 0)
    100%
      transform translate3d(0, 0, 0)
  @keyframes slowDown
    0%
      transform translate3d(0, 0, 0)
    100%
      transform translate3d(0, 100%, 0)
.mask {
  top: 0;
  left 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 98;
  background: rgba(0, 0, 0, 0.7);
}
.swiper-container{
  --swiper-pagination-color: rgba(255, 255, 255, 0.7);
}
.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction {
  bottom: 0;
}
.gift-send
  width 100%
  position fixed
  left 0
  bottom 0
  box-sizing border-box
  padding 0 30px
  background #151723
  z-index 99
  animation slowUp 0.3s ease
  padding-bottom calc(constant(safe-area-inset-bottom) + 30px)
  padding-bottom calc(env(safe-area-inset-bottom) + 30px)
  .head
    height 84px
    display flex
    justify-content space-between
    align-items center
    &>span
      font-size 30px
      color #FFFFFF
    &>a
      display flex
      align-items center
      font-size 28px
      color #FF387C
      &>img
        margin-left 12px
        width 10px
        height 19px
  .detail-swiper
    width 100%
    height 426px
    margin-top 14px
    .swiper-slide
      display flex
      align-content flex-start
      flex-wrap wrap
      height 366px
      .gift
        width 25%
        margin-bottom 40px
        text-align center
        border-radius 10px
        &.active
          background rgba(255, 255, 255, 0.2)
        &>img
          padding-top 8px
          width 103px
          height 82px
        &>p
          margin 6px 0
          line-height 24px
          font-size 24px
          color #C9C9C9
        &>span
          line-height 24px
          font-size 24px
          color #FFE241
          &>img
            margin-left 8px
            width 20px
            height 20px
  .ac
    display flex
    justify-content space-between
    align-items center
    margin-top -40px
    position relative
    z-index 3
  .price
    display flex
    align-items center
    font-size 24px
    color #FFFFFF
    font-weight bold
    position relative
    &>img
      margin-left 6px
      width 20px
      height 20px
  .submit
    background url(./button@2x.png) center center no-repeat
    background-size contain
    width 235px
    height 56px
    &>p
      display flex
      align-items center
      justify-content center
      width 50%
      line-height 56px
      font-size 24px
      color #FFFFFF
      &>img
        margin-left 16px
        width 13px
        height 7px
  .select
    position absolute
    z-index 8
    right 85px
    top -5px
    width 163px
    height 481px
    box-sizing border-box
    padding-bottom 26px
    text-align center
    font-size 24px
    color #333333
    background url(./bg@2x.png) center center no-repeat
    background-size contain
    transform translateY(-100%)
    &>p
      height 65px
      line-height 65px
.gift-send.close
  animation slowDown 0.3s ease forwards
</style>
