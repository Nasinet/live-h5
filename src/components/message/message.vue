<template>
  <div class="live-message" :class="{ 'full-message': isFullScreen }">
    <scroll class="msg-scroll" ref="msgScroll">
      <h4 class="tips">
        {{ $store.state.appConfig.room_notice }}
      </h4>
      <ul class="msg-list">
        <li v-for="(msg, index) in msgs" :key="index">
          <img
            class="medal"
            v-if="msg.vip_level && msg.isVip"
            :src="medals[msg.vip_level - 1]"
            alt=""
          />
          <img :src="levelIcon[msg.user_level]" alt="" /><span
            @click.stop="showFloatUser(msg)"
            class="name"
            >{{ msg.nick_name }}: </span
          ><span>{{ msg.message }}</span>
        </li>
      </ul>
    </scroll>
    <form @submit.prevent="submitMsg()" class="input" v-if="!isFullScreen">
      <input
        @blur="inputBlur"
        ref="input"
        v-model="message"
        placeholder="快来调侃一下主播吧"
        type="text"
      />
      <button type="submit" class="btn">发送</button>
    </form>
  </div>
</template>

<script>
import TIM from 'tim-js-sdk'
import { mapState, mapMutations } from 'vuex'
import levelIcon from '../../common/js/level-icon'
import Scroll from '../../components/scroll/scroll'
import { blurInput } from '../../common/js/mixins'
import { getItem } from '../../common/js/storage'

export default {
  name: 'live-message',
  mixins: [blurInput],
  components: {
    Scroll
  },
  props: {
    roomId: {
      type: String,
      default: ''
    },
    isAnchor: {
      type: Boolean,
      default: false
    },
    isFullScreen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      msgs: [],
      message: '',
      medals: [
        require('./youxia@2x.png'),
        require('./qishi@2x.png'),
        require('./gongjue@2x.png'),
        require('./king@2x.png')
      ],
      levelIcon,
      joinSuccess: false
    }
  },
  computed: {
    ...mapState(['userInfo', 'appConfig', 'tim'])
  },
  mounted() {
    this.initIm()
  },
  beforeDestroy() {
    if (this.tim && this.joinSuccess && !this.isAnchor) {
      this.tim.quitGroup(this.roomId)
    }
    this.tim && this.tim.logout()
    this.tim.off(TIM.EVENT.MESSAGE_RECEIVED, this.receiveMsg)
    this.tim.off(TIM.EVENT.SDK_READY, this.imReady)
    clearTimeout(this.msgTimer)
    this.$off('showFloatUser')
    this.$off('liveFinished')
    this.$off('pushGift')
    this.$off('drawDanmu')
    this.$off('changHumanNum')
  },
  methods: {
    ...mapMutations(['changeIm']),
    submitMsg(message) {
      if (message) {
        this.message = message
      }
      if (!this.userInfo.id) {
        this.$refs.input.blur()
        setTimeout(() => {
          this.$router.push('/login')
        }, 20)
        return
      }
      if (!this.message) {
        this.$toast.fail('请输入消息')
        return
      }
      clearTimeout(this.msgTimer)
      this.msgTimer = setTimeout(() => {
        this.sendMessage(this.message, 'RoomMessage')
      }, 200)
    },
    showFloatUser(user) {
      this.$emit('showFloatUser', user)
    },
    initIm() {
      if (!this.tim) {
        this.changeIm(
          TIM.create({
            SDKAppID: this.appConfig.im_sdkappid
          })
        )

        this.tim.setLogLevel(1)
      }

      this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.receiveMsg)

      this.tim.on(TIM.EVENT.SDK_READY, this.imReady)
      if (this.userInfo.id) {
        this.tim.login({
          userID: this.userInfo.id.toString(),
          userSig: this.userInfo.txim_sign
        })
      } else {
        const tourist = getItem('tourist')
        if (tourist) {
          this.tim.login({
            userID: tourist.userName.toString(),
            userSig: tourist.sign
          })
        }
      }
    },
    joinGroup() {
      if (!this.roomId) return
      return this.tim.joinGroup({ groupID: this.roomId }).then(e => {
        this.joinSuccess = true
      })
    },
    receiveMsg(e) {
      e.data.forEach(item => {
        if (!item.payload.data) return
        const data = JSON.parse(item.payload.data)
        if (data.Action === 'LiveFinished') this.$emit('liveFinished')
        if (data.Action === 'RoomMessage' && item.to === this.roomId) {
          if (data.Data.chat.sender.id === this.userInfo.id) {
            return
          }
          this.showMsg(data.Data.chat)
        }
        // console.log(data)
        // if (data.Action === 'RoomAttentAnchor') {
        //   this.showMSg(data)
        //   this.$emit('increaseAttend')
        // }
        if (data.Action === 'LiveGroupMemberJoinExit') this.getMemberNum()
        if (data.Action === 'GiftAnimation') this.$emit('pushGift', data)
      })
    },
    imReady() {
      this.joinGroup().then(() => {
        this.sendMessage('加入直播间', 'RoomMessage')
      })
      this.getMemberNum()
    },
    sendMessage(message, action) {
      const tourist = getItem('tourist')

      const content = {
        Action: action,
        Data: {
          chat: {
            sender: {
              id: this.userInfo.id || 0,
              nick_name: this.userInfo.nick_name || tourist.userName,
              avatar: this.userInfo.avatar,
              user_level: this.userInfo.user_level
                ? this.userInfo.user_level.toString()
                : '1',
              vip_level: this.userInfo.vip_level,
              vip_date: this.userInfo.vip_date,
              is_anchor: this.userInfo.is_anchor
            },
            message: message
          }
        }
      }

      const msgBody = this.tim.createCustomMessage({
        to: this.roomId,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          data: JSON.stringify(content)
        }
      })

      this.tim.sendMessage(msgBody).then(() => {
        this.message = ''
        this.showMsg(content.Data.chat)
      })
    },
    showMsg(chat) {
      this.msgs.push({
        message: chat.message,
        ...chat.sender,
        isVip: new Date(chat.sender.vip_date).getTime() > Date.now()
      })
      this.$emit('drawDanmu', chat.sender.nick_name + '：' + chat.message)
      this.$nextTick(() => {
        if (this.$refs.msgScroll) {
          this.$refs.msgScroll.scrollEnd()
        }
      })
    },
    getMemberNum() {
      if (!this.roomId) return
      this.tim
        .getGroupProfile({
          groupID: this.roomId
        })
        .then(res => {
          this.$emit('changHumanNum', res.data.group.memberNum)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.live-message
  height 100%
  box-sizing border-box
  padding-bottom 112px
  position relative
  background #F4F7F
  .msg-scroll
    height 100%
    overflow-y scroll
    .tips
      line-height 48px
      padding 25px 30px 32px 30px
      font-size 30px
      color #FF8A43
    .msg-list
      &>li
        margin-bottom 30px
        padding 0 30px
        line-height 40px
        font-size 30px
        color #333333
        .name
          color #B3B3B3
        &>img
          padding-right 14px
          display inline-block
          height 38px
          vertical-align top
          &.medal
            margin-top -5px
            height 48px
  .input
    position absolute
    left 0
    bottom 0
    box-sizing border-box
    padding 0 30px
    width 100%
    height 112px
    display flex
    align-items center
    background #fff
    &>input
      flex 1
      height 78px
      padding-left 30px
      border-radius 39px
      background #F5F5F5
      font-size 30px
    &>button
      margin-left 20px
      width 150px
      height 74px
      border none
      outline none
      border-radius 37px
      background $theme-color
      font-size 28px
      color #FFF
  &.full-message
    background none
    padding-bottom 0
    .msg-scroll
      .tips
        background rgba(0, 0, 0, .2)
        color #FFEF37
        margin-bottom 26px
        border-radius 10px
      .msg-list
        &>li
          color #FFF
          .name
            color #5FFCFF
</style>
