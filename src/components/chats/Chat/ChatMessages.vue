<template>
  <div
    class="chat-messages"
    @scroll="handleTopVisible"
    ref="chatMessages"
    :style="{bottom: inputHeight}">
    <in-spinner :loading="loadingInfo"/>

    <div
      class="chat-messages-container"
      :style="chatStyles"
      ref="chatMessagesContainer">
      <template v-if="messages">
        <in-chat-message
          v-for="(message, index) in messages"
          :key="message.id + message.translated_message"
          :message="message"
          :nextMessage="messages[index - 1]" />
      </template>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  import {
    FETCH_MESSAGES,
    FETCH_MESSAGES_NEXT_PAGE,
    LOADING,
    MESSAGES,
    moduleName as chatMessagesModule
  } from "Store/modules/chats/chatMessages";

  import {moduleName as chatsAllModule, READ_MESSAGES} from "../../../store/modules/chats/chatsAll";

  import {
    FAVOURITE_MESSAGES,
    FETCH_FAVOURITE_MESSAGES,
    FETCH_FAVOURITE_MESSAGES_NEXT_PAGE,
    LOADING as FAVOURITE_LOADING,
    moduleName as chatFavouriteMessagesModule
  } from "Store/modules/chats/chatFavouriteMessages";

  import ChatMessage from "ComponentsVue/chats/Chat/ChatMessage";

  export default {
    name: "ChatMessages",
    components: {
      inChatMessage: ChatMessage
    },
    props: {
      inputHeight: String,
      chat: [Object, undefined]
    },
    data() {
      return {
        scrolledUp: false,
        scrollBottom: 0,
        top: false,
        isScrollToPosition: false,
        marginTopContainer: 0,
        isChange: false,
        chatId: this.$route.params.chat_id
      }
    },
    computed: {
      ...mapGetters({
        messagesInfo: chatMessagesModule + MESSAGES,
        loading: chatMessagesModule + LOADING,
        favouriteMessages: chatFavouriteMessagesModule + FAVOURITE_MESSAGES,
        favouriteLoading: chatFavouriteMessagesModule + FAVOURITE_LOADING
      }),
      messages() {
        if(this.chatId) {
          return this.messagesInfo(this.chatId);
        } else {
          return this.favouriteMessages;
        }
      },
      loadingInfo() {
        if(this.chatId) {
          return this.loading
        } else {
          return this.favouriteLoading
        }
      },
      chatStyles() {
        return this.isChange && this.messages ? { marginTop: this.marginTopContainer + 'px' } : null
      }
    },
    watch: {
      '$route'(to, from) {
        this.chatId = this.$route.params.chat_id;

        if (to.path !== from.path) {
          this.readMessages();
          this.fetch();
        }
      },
      top(top) {
        if (top && this.messages) {
          this.fetchNext();
        }
      },
      messages(newValue, oldValue) {
        if(!oldValue || newValue && (oldValue.length > 1 && newValue.length > oldValue.length && newValue[newValue.length - 1].id === oldValue[oldValue.length - 1].id)) {
          this.isScrollToPosition = true;
        }
        this.readMessages();
      },
      chat() {
        this.readMessages();
      }
    },
    mounted() {
      this.fetch();
      this.scroll();
      this.readMessages();

      this.$root.$on('changeMessagesScroll', () => {
        this.scroll();
      });
    },
    beforeUpdate() {
      if(this.$refs && this.$refs.chatMessages) {
        const {clientHeight, scrollTop, scrollHeight} = this.$refs.chatMessages;
        if (this.isScrollToPosition) {
          this.scrollBottom = scrollHeight - scrollTop;
        }
        this.scrolledUp = clientHeight + scrollTop < scrollHeight;
      }
    },
    updated() {
      this.changeMarginTop();
      this.scroll();
      this.readMessages();
    },
    beforeDestroy() {
      this.readMessages();
    },
    methods: {
      ...mapActions({
        fetchMessages: chatMessagesModule + FETCH_MESSAGES,
        fetchMessagesNextPage: chatMessagesModule + FETCH_MESSAGES_NEXT_PAGE,
        readMessagesAction: chatsAllModule + READ_MESSAGES,
        fetchFavouriteMessages: chatFavouriteMessagesModule + FETCH_FAVOURITE_MESSAGES,
        fetchFavouriteMessagesNextPage: chatFavouriteMessagesModule + FETCH_FAVOURITE_MESSAGES_NEXT_PAGE,
      }),
      readMessages() {
        if(this.chat && this.chat.unread_message_count > 0 && this.messages && this.messages.length > 0) {
          this.readMessagesAction(this.messages[this.messages.length - 1].id)
        }
      },
      handleTopVisible() {
        this.top = this.topVisible();
      },
      topVisible() {
        return this.$refs && this.$refs.chatMessages && this.$refs.chatMessages.scrollTop < 1
      },
      fetch() {
        if(this.chatId) {
          this.fetchMessages(this.chatId);
        } else {
          this.fetchFavouriteMessages();
        }
      },
      fetchNext() {
        if(this.chatId) {
          this.fetchMessagesNextPage(this.chatId);
        } else {
          this.fetchFavouriteMessagesNextPage();
        }
      },
      scroll() {
        if(this.$refs && this.$refs.chatMessages) {
          if (this.isScrollToPosition) {
            this.isScrollToPosition = false;
            this.$refs.chatMessages.scrollTop = this.$refs.chatMessages.scrollHeight - this.scrollBottom;
            return;
          }

          if (!this.scrolledUp) {
            this.$nextTick(() => {
              if(this.$refs.chatMessages) {
                const {clientHeight, scrollTop, scrollHeight} = this.$refs.chatMessages;

                if(scrollHeight !== clientHeight + scrollTop) {
                  this.$refs.chatMessages.scrollTop = scrollHeight + 10000;
                }
              }
            });
          }
        }
      },
      changeMarginTop() {
        if(this.$refs.chatMessagesContainer) {
          if(this.$refs.chatMessagesContainer.offsetHeight > 0) {
            this.isChange = true;
          }
          const offset = this.$refs.chatMessages.offsetHeight - this.$refs.chatMessagesContainer.offsetHeight - 10; // - 10px padding
          this.marginTopContainer = offset > 0 ? offset : 0
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .chat-messages {
    position: fixed;
    bottom: 61px;
    top: 0;
    left: 0;
    right: 0;
    overflow-y: scroll;
    box-sizing: border-box;
    padding: 40px 0 10px 0;
    max-height: 100vh;
    -webkit-overflow-scrolling: touch;

    &-container {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
  }
</style>
