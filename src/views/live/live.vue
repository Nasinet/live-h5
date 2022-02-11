<template>
  <div class="live">
    <div class="tab">
      <van-tabs @click="changeTab" v-model="active" scrollspy color="#AC74FF" :line-width="13" animated>
        <van-tab v-for="(item, index) in tabs" :key="item.id" :name="index" :title="item.title"></van-tab>
      </van-tabs>
    </div>

    <img @click="$router.push('/search')" src="./ic_search@2x.png" alt="" class="search">

    <div class="swiper-container live-swipe">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(cate, idx) in tabs" :key="idx">
          <list ref="liveList" :ad-list="adList" :index="idx" :type="cate.id" :active="active" />
        </div>
      </div>
    </div>
    <tab-bar/>
  </div>
</template>

<script>
import TabBar from '../../components/tab-bar/tab-bar'
import List from './list'
import { mapState } from 'vuex'
import { post } from '../../common/js/http'

export default {
  name: 'live',
  components: {
    TabBar,
    List
  },
  data() {
    return {
      active: 0,
      initAc: 0,
      adList: []
    }
  },
  computed: {
    ...mapState(['categories']),
    tabs() {
      return [{ id: 0, title: '推荐' }, ...this.categories]
    }
  },
  activated() {
    this.initAc = this.active
    if (this.$refs.liveList) {
      this.$refs.liveList.forEach(item => {
        item.activated()
      })
    }
  },
  created() {
    this.getAd()
  },
  mounted() {
    setTimeout(() => {
      this.createSwiper()
    }, 500)
  },
  methods: {
    createSwiper() {
      if (this.categories.length) {
        this.swiper = new window.Swiper('.live-swipe', {
          loop: false,
          threshold: 10,
          on: {
            slideChangeTransitionStart: () => {
              this.active = this.swiper.activeIndex
            }
          }
        })
      } else {
        setTimeout(() => {
          this.createSwiper()
        }, 500)
      }
    },
    changeTab(index) {
      this.swiper.slideTo(index)
    },
    getAd() {
      post('/Ads/getHomeScrollAd')
        .then(({ data: { data } }) => {
          this.adList = data
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.live
  height 100%
  /*::v-deep*/
  /*  .van-tabs__wrap--scrollable .van-tabs__nav--complete*/
  /*    padding-right 63px*/
  .tab
    width 92%
  .search
    position fixed
    width 36px
    height 38px
    right 20px
    top 24px
  .live-swipe
    width 100vw
    height calc(100% - 98px - 1.17333rem)
    z-index 1 !important
</style>
