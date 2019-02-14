<template>
  <div class="chats-archive-header">
    <in-header-block class="header">
      <div
        @click="goBack"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <div class="header-content">
        <span class="header-content-name">{{name}}</span>
      </div>
      <div class="empty-archive-block"></div>
    </in-header-block>
  </div>
</template>

<script>
  export default {
    name: "ChatsCommonHeader",
    props: {
      name: {
        type: String,
        default: ''
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="less" scoped>
  .header {
    padding: 0 !important;

    &-back {
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
    width: 40px;
    height: 40px;
  }
</style>
