<template>
  <div class="set-list" @click.stop>
    <ul class="tabs">
      <li
        v-if="showMgr"
        @click="changeTab(0)"
        :class="{ active: active === 0 }"
      >
        管理员列表
      </li>
      <li @click="changeTab(1)" :class="{ active: active === 1 }">禁言列表</li>
    </ul>
    <van-list
      v-model="loading"
      :finished="isFinished"
      finished-text="没有更多了"
      @load="loadMore"
    >
      <user-item
        @cancel="cancel"
        :type="active"
        v-for="(item, index) in list"
        :index="index"
        :key="item.id"
        :anchorid="anchorid"
        :item="active === 0 ? item.user : item"
      />
    </van-list>
  </div>
</template>

<script>
import { post } from '../../common/js/http'
import UserItem from './user-item'

export default {
  name: 'set-list',
  components: {
    UserItem
  },
  props: {
    showMgr: {
      type: Boolean,
      default: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    anchorid: {
      type: Number,
      default: 0
    }
  },
  watch: {
    isOpen: function(val) {
      if (val && this.list.length === 0) {
        this.page = 1
        this.isFinished = false
        this.getList()
      }
    }
  },
  data() {
    return {
      active: 0,
      list: [],
      page: 1,
      loading: false,
      isFinished: false
    }
  },
  mounted() {
    if (!this.showMgr) {
      this.active = 1
    }
    this.getList()
  },
  methods: {
    refresh() {
      this.page = 1
      this.list = []
      this.getList()
    },
    loadMore() {
      if (this.loading || this.isFinished || this.active === 0) return
      this.page++
      this.loading = true
      this.getList()
    },
    changeTab(tab) {
      if (tab === this.active) return
      this.active = tab
      this.list = []
      this.page = 1
      this.getList()
    },
    cancel(index) {
      this.list.splice(index, 1)
    },
    getList() {
      post(
        this.active === 0
          ? '/webapi/live/getMgrList'
          : '/api/live/getBannedUserList',
        { anchorid: this.anchorid, page: this.page, size: 20 },
        true
      ).then(({ data: { data } }) => {
        data.forEach(item => {
          if (this.active === 0) {
            item.user.isVip =
              new Date(item.user.vip_date).getTime() > Date.now()
          } else {
            item.isVip = new Date(item.vip_date).getTime() > Date.now()
          }
        })
        this.list = this.list.concat(data)
        this.loading = false
        this.isFinished = data.length < 20
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
.set-list
  width 100%
  height 100%
  background #fff
  z-index 10
  .tabs
    height 95px
    line-height 87px
    display flex
    border-bottom 2px solid #F4F4F4
    &>li
      flex 1
      font-size 32px
      color #000000
      text-align center
      cursor pointer
      &:after
        content ' '
        display block
        width 26px
        margin 0 auto
        height 8px
        border-radius 4px
        background transparent
      &.active
        color $theme-color
        &:after
          background $theme-color
  .user-list
    height calc(100% - 95px)
    width 100%
</style>
