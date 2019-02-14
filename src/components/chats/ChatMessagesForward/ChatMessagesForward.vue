<template>
  <in-transition-component name="translateX">
    <div v-show="show" class="for-f">
      <in-chat-messages-forward-header @hideModal="hideModal"/>

      <div
        ref="forward"
        @scroll="handleBottomVisible"
        class="chat-messages-forward">

        <div class="chat-messages-forward-container">
          <!--<in-search-block class="search">-->
          <!--<div class="search-input-block" style="width: 100%">-->
          <!--<input-->
          <!--type="text"-->
          <!--:placeholder="$lang.variables.searchByNameOrNickname"-->
          <!--:value="searchInput"-->
          <!--@keyup="fetchInput"-->
          <!--class="search-input-field">-->
          <!--</div>-->
          <!--</in-search-block>-->

          <in-chats-all-item
            v-for="chat in chatsAll"
            :key="chat.id"
            :chat="chat"
            isForward
            @forward="forward"/>

          <in-spinner :loading="loadingInfo"/>
        </div>
      </div>
    </div>

  </in-transition-component>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import ChatsAllItem from "ComponentsVue/chats/ChatsAll/ChatsAllItem";
  import ChatMessagesForwardHeader from "ComponentsVue/chats/ChatMessagesForward/ChatMessagesForwardHeader";

  import {
    CHATS,
    FETCH_CHATS,
    FETCH_CHATS_NEXT_PAGE,
    LOADING,
    moduleName as chatsAllModule
  } from "Store/modules/chats/chatsAll";

  import {
    CHANGE_SEARCH_INPUT,
    FETCH_SEARCH_CHATS,
    FETCH_SEARCH_CHATS_NEXT_PAGE,
    LOADING as SEARCH_LOADING,
    moduleName as chatsAllSearchModule,
    SEARCH_CHATS,
    SEARCH_INPUT
  } from "Store/modules/chats/chatsAllSearch";

  import {
    moduleName as chatMessagesModule,
    CHANGE_SELECTED_FORWARD_MESSAGES,
    CHANGE_SELECTED_FORWARD_POST,
    SELECTED_MESSAGES,
    SELECTED_POST,
    RESET_SELECTED_MESSAGES,
    RESET_SELECTED_POST
  } from "Store/modules/chats/chatMessages";

  export default {
    name: "ChatMessagesForward",
    props: {
      isForwardMessages: Boolean,
      isForwardPost: Boolean,
      show: Boolean
    },
    components: {
      inChatsAllItem: ChatsAllItem,
      inChatMessagesForwardHeader: ChatMessagesForwardHeader
    },
    data() {
      return {
        bottom: false
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchNext();
        }
      }
    },
    computed: {
      ...mapGetters({
        chats: chatsAllModule + CHATS,
        loading: chatsAllModule + LOADING,
        searchLoading: chatsAllSearchModule + SEARCH_LOADING,
        searchChats: chatsAllSearchModule + SEARCH_CHATS,
        searchInput: chatsAllSearchModule + SEARCH_INPUT,
        selectedMessages: chatMessagesModule + SELECTED_MESSAGES,
        selectedPost: chatMessagesModule + SELECTED_POST
      }),
      chatsAll() {
        if (this.searchInput) {
          return this.searchChats
        } else {
          return this.chats
        }
      },
      loadingInfo() {
        if (this.searchInput) {
          return this.searchLoading
        } else {
          return this.loading
        }
      }
    },
    mounted() {
      this.fetch();
    },
    updated() {
      this.bottom = false;
    },
    methods: {
      ...mapActions({
        fetchChats: chatsAllModule + FETCH_CHATS,
        fetchChatsNextPage: chatsAllModule + FETCH_CHATS_NEXT_PAGE,
        fetchSearchChats: chatsAllSearchModule + FETCH_SEARCH_CHATS,
        fetchSearchChatsNextPage: chatsAllSearchModule + FETCH_SEARCH_CHATS_NEXT_PAGE
      }),
      ...mapMutations({
        changeSearchInput: chatsAllSearchModule + CHANGE_SEARCH_INPUT,
        changeSelectedForwardMessages: chatMessagesModule + CHANGE_SELECTED_FORWARD_MESSAGES,
        changeSelectedForwardPost: chatMessagesModule + CHANGE_SELECTED_FORWARD_POST,
        resetSelectedMessages: chatMessagesModule + RESET_SELECTED_MESSAGES,
        resetSelectedPost: chatMessagesModule + RESET_SELECTED_POST,
      }),
      handleBottomVisible() {
        this.bottom = this.bottomVisible();
      },
      bottomVisible() {
        const {clientHeight, scrollTop, scrollHeight} = this.$refs.forward;
        return (clientHeight + scrollTop + 400) >= scrollHeight;
      },
      forward(id) {
        if (this.isForwardMessages) {
          this.changeSelectedForwardMessages([...this.selectedMessages]);
          this.resetSelectedMessages();
          this.$router.replace(`/messages/${id}`);
        } else if (this.isForwardPost) {
          this.changeSelectedForwardPost({...this.selectedPost});
          this.resetSelectedPost();
          this.$router.push(`/messages/${id}`);
        }
        this.hideModal();
      },
      fetchInput(e) {
        this.changeSearchInput(e.target.value);
        this.fetch();
      },
      fetch() {
        if (this.searchInput) {
          this.fetchSearchChats();
        } else {
          this.fetchChats();
        }
      },
      fetchNext() {
        if (this.searchInput) {
          this.fetchSearchChatsNextPage();
        } else {
          this.fetchChatsNextPage();
        }
      },
      hideModal() {
        this.$emit('hideModal');
      }
    }
  }
</script>

<style lang="less" scoped>
  .for-f {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    z-index: 14000;
  }

  .chat-messages-forward {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 14000;
    background: #fff;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;


    &-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      /*padding-top: 2px;*/
      width: 100vw;
      margin-top: 40px;
      padding-top: 7px;
    }

    .search {
      width: 100%;
      margin-bottom: 5px;
    }
  }
</style>
