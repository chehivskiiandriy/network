<template>
  <div class="chat-all-header">
    <in-header-block class="header">
      <div
        @click="goBack"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <div class="header-content chat-all-header-content">
        <span class="header-content-name">{{$lang.variables.chats}}</span>
      </div>
      <div
        @click="createChat"
        class="header-back">
        <i class="icon-plus-f"></i>
      </div>
    </in-header-block>
    <div
      class="chat-all-sub-header">
      <div class="chat-all-sub-header--item">
        <i
          @click="showUserSearch"
          :class="[isActiveSearch ? 'icon-search-f' : 'icon-search']"></i>
      </div>
      <div class="chat-all-sub-header--item">
        <router-link to="/create-newsletter">
          <i class="icon-dispatch"></i>
        </router-link>
      </div>
      <div class="chat-all-sub-header--item">
        <router-link to="/create-groupchat">
          <i class="icon-Group_chat"></i>
        </router-link>
      </div>
      <div class="chat-all-sub-header--item">
        <router-link to="/messages-favourite">
          <i class="icon-star"></i>
        </router-link>
      </div>
      <div class="chat-all-sub-header--item">
        <router-link to="/messages-archive">
          <i class="icon-archive"></i>
        </router-link>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "ChatHeader",
    props: {
      isActiveSearch: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      createChat() {
        this.$router.push('/create-search-chat');
      },
      showUserSearch() {
        // this.$emit('showUserSearch');
        this.$notify({
          group: 'not-is-now',
          duration: 3000,
          speed: 300
        })
      }
    },
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-all {
    &-header {
      z-index: 2;

      .header {
        padding: 0;

        &-back {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      &-content {
        width: calc(~'100vw - 80px') !important;
      }
    }

    .header {
      transition: all .2s;
    }

    &-sub-header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      height: 40px;
      transition: all .2s;
      z-index: 2;

      i {
        font-size: 26px;
        .text-grad();
      }
    }

    &-header--item {
      width: 15%;
      text-align: center;
    }
  }
</style>



