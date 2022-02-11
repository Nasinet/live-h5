<template>
  <div v-if="live" class="live-detail" @touchstart.stop>
    <div
      class="player-wrap"
      :class="{
        'full-player': live.orientation == 2,
        'dplayer-hide-controller': isPlaying
      }"
      id="player_wrap"
    ></div>
    <template v-if="live.orientation == 1">
      <div class="head border-bottom-1px">
        <div class="tab-wrap">
          <van-tabs
            @click="changeTab"
            v-model="active"
            scrollspy
            color="#AC74FF"
            :line-width="13"
            animated
          >
            <van-tab
              v-for="(item, index) in tabs"
              :key="item.id"
              :name="index"
              :title="item.title"
            ></van-tab>
          </van-tabs>
        </div>
        <div class="focus" @click.stop="focus">
          <img src="./guanzhu@2x.png" alt />
          <span>{{ anchor.isattent ? '已关注' : '关注' }}</span>
        </div>
      </div>
      <div class="swiper-container detail-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <message v-if="anchor.id" :room-id="'LIVEROOM_' + anchor.id" />
          </div>
          <div class="swiper-slide">
            <anchor-info @focus="focus" v-if="anchor.id" :anchor="anchor" />
          </div>
          <div class="swiper-slide">
            <money-rank v-if="anchor.id" :anchorid="anchor.id" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="anchor">
        <img class="avatar" :src="anchor.avatar || defaultAvatar" />
        <div mode="aspectFit" class="info">
          <p class="ellipse-one">{{ anchor.nick_name }}</p>
          <span class="ellipse-one">热度：{{ live.hot }}</span>
        </div>
        <img
          class="focus"
          @click="focus"
          v-if="!anchor.isattent"
          src="./wechat/button_guanzhu@2x.png"
          alt
        />
        <img
          class="focus"
          @click="focus"
          v-else
          src="./wechat/button_yiguanzhu@2x.png"
          alt=""
        />
      </div>
      <div class="honey-rank">
        <div class="scroll">
          <div
            @click.stop="changeFloatUser(item.user.id)"
            :class="'avatar ' + (index < 3 ? 'bg' + index : '')"
            v-for="(item, index) in honeyRank"
            :key="item.id"
          >
            <img :src="item.user.avatar || defaultAvatar" alt="" />
          </div>
        </div>
        <p class="num">{{ humanNum }}</p>
      </div>
      <div class="rank-btn-group">
        <div class="rank-btn" @click.stop="showMoneyRank = true">
          <img src="./wechat/ic_list@2x.png" alt="" />
          <p>贡献榜</p>
        </div>
        <!-- <div class="rank-btn">
          <img src="./wechat/ic_shouhu@2x.png" alt="" />
          <p>守护33人</p>
        </div> -->
        <div class="rank-btn" v-if="isMgr" @click.stop="showSetList = true">
          <img src="./wechat/ic_Banned@2x.png" alt="" />
          <p>禁言列表</p>
        </div>
      </div>
      <div class="message-control">
        <message
          ref="message"
          v-if="anchor.id"
          :room-id="'LIVEROOM_' + anchor.id"
          @changHumanNum="changHumanNum"
          is-full-screen
        />
      </div>
      <div class="bottom">
        <div class="input" @click="handleSlowInput">
          <img src="./wechat/ic_msg@2x.png" alt="" />
          <span>说点什么...</span>
        </div>
        <!-- <img src="./wechat/gouwuche@2x.png" alt="" /> -->
        <!-- <img src="./wechat/lianmai@2x.png" alt="" /> -->
        <img
          @click.stop="alertType = 'gift'"
          src="./wechat/ic_gift@2x.png"
          alt=""
        />
        <!-- <img src="./wechat/ic_message@2x.png" alt="" />
        <img src="./wechat/share@2x.png" alt="" /> -->
        <img @click="$router.back()" src="./wechat/close@2x.png" alt="" />
      </div>
      <form v-if="showInput" @submit.prevent="submitMsg()" class="form-control">
        <input
          ref="megInput"
          v-model="message"
          placeholder="快来调侃一下主播吧"
          type="text"
        />
        <button type="submit" class="btn">发送</button>
      </form>
      <gift-send
        :detail="detail"
        v-if="alertType === 'gift'"
        @close="alertType = ''"
      />
      <user-float
        @set="mutedUser"
        v-if="alertType === 'userFloat'"
        @close="alertType = ''"
        :show-set="showSet"
        :uid="currentUserId"
      />
      <van-popup
        v-model="showMoneyRank"
        round
        position="bottom"
        :style="{ height: '60vh' }"
      >
        <money-rank background="none" v-if="anchor.id" :anchorid="anchor.id" />
        <div class="safe-area-size-box"></div>
      </van-popup>

      <van-popup
        v-if="isMgr"
        v-model="showSetList"
        round
        position="bottom"
        :style="{ height: '60vh' }"
      >
        <set-list
          ref="setList"
          :is-open="showSetList"
          :show-mgr="false"
          v-if="anchor.id"
          :anchorid="anchor.id"
        />
        <div class="safe-area-size-box"></div>
      </van-popup>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { post } from '../../common/js/http'
import Message from '../../components/message/message'
export default {
  name: 'live-detail',
  components: {
    Message,
    GiftSend: () => import('../../components/gift-send/gift-send'),
    SetList: () => import('../../components/set-list/set-list'),
    UserFloat: () =>
      import('../../components/message-user-float/message-user-float'),
    MoneyRank: () => import('./money-rank'),
    AnchorInfo: () => import('./anchor-info')
  },
  data() {
    return {
      live: null,
      honeyRank: [],
      humanNum: '0',
      isMgr: false,
      message: '',
      showInput: false,
      showSetList: false,
      alertType: '',
      detail: {},
      currentUserId: 0,
      isPlaying: false,
      showMoneyRank: false,
      anchor: {
        isattent: false,
        profile: {}
      },
      tabs: [
        { id: 1, title: '聊天' },
        { id: 2, title: '主播' },
        { id: 3, title: '贡献榜' }
      ],
      active: 0
    }
  },
  computed: {
    ...mapState(['defaultAvatar', 'userInfo']),
    showSet() {
      return (
        this.isMgr &&
        this.currentUserId !== this.userInfo.id &&
        this.currentUserId !== this.anchor.id
      )
    }
  },
  created() {
    this.getDetail()
  },
  mounted() {
    this.touchmoveFn = function(e) {
      e.preventDefault()
    }
    document.body.addEventListener('touchmove', this.touchmoveFn, {
      passive: false
    })
    // this.createSwiper()
  },
  beforeDestroy() {
    this.player && this.player.destroy()
    document.body.removeEventListener('touchmove', this.touchmoveFn, false)
  },
  methods: {
    getHoneyRank() {
      post('/webapi/intimacy/getTotalIntimacyRank', {
        anchorid: this.anchor.id
      }).then(({ data: { data } }) => {
        console.log(data)
        this.honeyRank = data
      })
    },
    changHumanNum(num) {
      this.humanNum = num
    },
    changeFloatUser(id) {
      this.currentUserId = id
      this.alertType = 'userFloat'
    },
    checkMgr() {
      if (!this.userInfo.id) return
      post('/api/live/checkIsMgr', { anchorid: this.anchor.id, hideMsg: true })
        .then(({ data }) => {
          this.isMgr = true
        })
        .catch(() => {
          this.isMgr = false
        })
    },

    mutedUser(user) {
      this.$confirm({
        title: '请选择您要做的操作',
        message: `用户：${user.nick_name}（ID：${user.id}）`,
        confirmButtonText: '禁言'
      }).then(() => {
        post('/webapi/live/banUser', {
          userid: user.id,
          type: 1,
          anchorid: this.anchor.id
        }).then(() => {
          this.alertType = ''
        })
      })
    },
    handleSlowInput() {
      if (!this.userInfo.id) {
        this.$router.push('/login')
        return
      }
      this.showInput = true
      this.$nextTick(() => {
        this.$refs.megInput.focus()
      })
    },
    submitMsg() {
      if (this.message === '') {
        this.$toast.fail('请输入消息')
        return
      }
      this.msgTimer && clearTimeout(this.msgTimer)
      this.msgTimer = setTimeout(() => {
        this.$refs.megInput.blur()
        this.$refs.message.sendMessage(this.message, 'RoomMessage')
        this.message = ''
        this.showInput = false
      }, 200)
    },
    createSwiper() {
      this.swiper = new window.Swiper('.detail-swiper', {
        loop: false,
        threshold: 10,
        on: {
          slideChangeTransitionStart: () => {
            this.active = this.swiper.activeIndex
          }
        }
      })
    },
    changeTab(index) {
      this.swiper.slideTo(index)
    },
    getDetail() {
      post('/webapi/live/getLivePageData', {
        anchorid: this.$route.params.id
      }).then(({ data: { data } }) => {
        this.live = data.live
        if (!data.anchor.isattent) {
          data.anchor.isattent = false
        }
        this.anchor = data.anchor
        if (data.live) {
          delete data.live.anchor
          this.detail = data.live
        }
        this.$nextTick(() => {
          if (!this.live) {
            setTimeout(() => {
              this.$toast.fail('主播休息中')
            }, 1000)
            return
          }
          this.checkMgr()
          this.getHoneyRank()
          this.createPlayer()
          Number(data.live.orientation) === 1 && this.createSwiper()
        })
      })
    },
    createPlayer() {
      if (this.player) return

      this.player = new this.$DPlayer({
        container: document.getElementById('player_wrap'),
        video: {
          url: this.live.pull_url,
          pic: this.live.thumb
        },
        autoplay: true
        // volume: 0.5,
        // loop: true
      })
      this.player.on('play', () => {
        this.isPlaying = true
      })
    },
    focus() {
      post('/webapi/Anchor/attentAnchor', {
        anchorid: this.anchor.id,
        type: !this.anchor.isattent
      }).then(() => {
        this.anchor.isattent = !this.anchor.isattent
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../common/style/variable.styl';
.safe-area-size-box {
  height calc(constant(safe-area-inset-bottom) + 20px)
  height calc(env(safe-area-inset-bottom) + 20px)
}
/deep/ .full-player .dplayer-controller,
/deep/ .full-player .dplayer-controller-mask{
  display: none;
}
.live-detail {
  height: 100%;
  overflow: hidden;

  .player-wrap {
    height: 422px;
    background: #000;

    &.full-player {
      height: 100vh;

      /deep/ .dplayer-video {
        object-fit: cover;
      }
    }
  }

  .head {
    display: flex;
    justify-content: space-between;
    background: #fff;

    .tab-wrap {
      width: 359px;
    }

    .focus {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 146px;
      height: 1.17333rem;
      line-height: 1.17333rem;
      background: $theme-color;

      &>img {
        width: 30px;
        height: 26px;
        padding-right: 11px;
      }

      &>span {
        font-size: 26px;
        color: #FFFFFF;
      }
    }
  }

  .detail-swiper {
    width: 100%;
    height: calc(100% - 422px - 1.17333rem);
  }
}
.form-control {
  position absolute
  bottom 0
  left 0
  right 0
  z-index 20
  background #ffffff
  display flex
  height calc(constant(safe-area-inset-bottom) + 90px)
  height calc(env(safe-area-inset-bottom) + 90px)
  input {
    box-sizing border-box
    flex 1
    height 90px
    padding 15px 20px
    line-height 60px
    background none
    border 0 none
    display block
    color #333
    font-size 26px
    &::placeholder {
      color rgba(0, 0, 0, .6)
    }
  }
  .btn {
    height 90px
    line-height 90px
    width 150px
    text-align center
    color #ffffff
    font-size 30px
    background #FF6273
    border 0 none
    outline 0
  }
}

.message-control {
  position: absolute;
  z-index 9
  left: 30px;
  right: 30px;
  height: 500px;
  overflow: hidden;
  bottom calc(constant(safe-area-inset-bottom) + 100px)
  bottom calc(env(safe-area-inset-bottom) + 100px)
}

.bottom
  position absolute
  bottom calc(constant(safe-area-inset-bottom) + 20px)
  bottom calc(env(safe-area-inset-bottom) + 20px)
  left 0
  width 100%
  box-sizing border-box
  padding 0 30px
  display flex
  justify-content space-between
  z-index 9
  .input
    flex 1
    height 65px
    border-radius 33px
    padding 0 20px
    display flex
    justify-content flex-start
    align-items center
    background rgba(0,0,0,0.2)
    overflow hidden
    &>img
      flex-shrink 0
      margin-right 10px
      width 39px
      height 39px
    &>span
      font-size 25px
      color #FFFFFF
  &>img
    flex-shrink 0
    width 63px
    height 63px
    margin-left 20px
    border-radius 50%
.rank-btn-group {
  position absolute
  z-index 9
  left 30px
  top 117px
  max-width 340px
  display flex
  flex-wrap wrap
  align-items flex-start
}
.rank-btn
  flex-shrink  0
  padding 0 11px
  height 41px
  margin-bottom 11px
  border-radius 22px
  display flex
  align-items center
  justify-content center
  background-color rgba(0,0,0,0.2)
  margin-right 12px
  &>img
    width 31px
    height 31px
  &>p
    margin-left 7px
    font-size 22px
    font-weight 500
    color #FFFFFF

.honey-rank
  position absolute
  top 30px
  right 30px
  display flex
  align-items center
  z-index 9
  .num
    margin-top 7px
    margin-left 9px
    padding 0 12px
    height 36px
    line-height 36px
    border-radius 18px
    background rgba(0, 0, 0, 0.2)
    font-size 20px
    color #FFFFFF
  .scroll
    width 256px
    height 67px
    display flex
    align-items flex-start
    overflow-x auto
    .avatar
      width 53px
      height 53px
      min-width 53px
      min-height 53px
      margin-left 7px
      margin-top 10px
      &.bg0
        margin-left 0
        margin-top 0
        width 64px
        height 67px
        min-width 64px
        min-height 67px
        background url(./wechat/no1@2x.png) center center no-repeat
        background-size contain
        position relative
        &>img
          width 53px
          height 53px
          position absolute
          bottom 2px
          right 2px
      &.bg1
        margin-left 0
        margin-top 0
        width 64px
        height 67px
        min-width 64px
        min-height 67px
        background url(./wechat/no2@2x.png) center center no-repeat
        background-size contain
        position relative
        &>img
          width 53px
          height 53px
          position absolute
          bottom 2px
          right 2px
      &.bg2
        margin-left 0
        margin-top 0
        width 64px
        height 67px
        min-width 64px
        min-height 67px
        background url(./wechat/no2@2x.png) center center no-repeat
        background-size contain
        position relative
        &>img
          width 53px
          height 53px
          position absolute
          bottom 2px
          right 2px
      &>img
        width 56px
        height 56px
        border-radius 50%
.anchor {
  position: absolute;
  z-index: 9;
  left: 30px;
  top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 7px;
  box-sizing: border-box;
  min-width: 300px;
  height: 72px;
  border-radius: 36px;
  background: rgba(0, 0, 0, 0.2);

  .avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }

  .info {
    margin-left: 11px;
    margin-right: 16px;
    flex: 1;
    line-height: 24px;
    color: #FFFFFF;

    &>p {
      margin-bottom: 7px;
      width: 98%;
      font-size: 24px;
    }

    &>span {
      display: block;
      width: 98%;
      font-size: 20px;
      color: #FFFFFF;
    }
  }

  .focus {
    width: 55px;
    height: 55px;
  }
}
</style>
