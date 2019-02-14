<template>
  <in-header-block class="header">
    <div
      @click="goBack"
      class="header-back">
      <i class="icon-left-f"></i>
    </div>
    <div class="header-content">
      <span class="header-content-name">{{$lang.variables.forward}}</span>
    </div>
    <div class="empty-archive-block"></div>
  </in-header-block>
</template>

<script>
  import {mapMutations} from 'vuex';

  import {CHANGE_ACTIVE_SEARCH, moduleName as chatsAllSearchModule,} from "Store/modules/chats/chatsAllSearch";

  export default {
    name: "ChatMessagesForwardHeader",
    methods: {
      ...mapMutations({
        changeActiveSearch: chatsAllSearchModule + CHANGE_ACTIVE_SEARCH
      }),
      goBack() {
        this.$emit('hideModal');
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    padding: 0 !important;
    -webkit-overflow-scrolling: auto;
    z-index: 14001;

    &-back {
      font-size: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-content {
      width: calc(~'100vw - 80px');
    }
  }

  .empty-archive-block {
    height: 40px;
    width: 40px;
  }
</style>
