<template>
  <div id="chat">
    <in-chat-header
      :chat="chat"
      @showModal="showModal"/>

    <in-chat-messages
      :inputHeight="inputHeight"
      :chat="chat"/>
    <in-chat-message-input @updateInputHeight="updateInputHeight"/>
    <div class="chat-bg"></div>

    <in-confirm-delete-messages-modal
      :show="isShowDeleteModal"
      @hideModal="hideDeleteModal" />

    <in-chat-messages-forward
      :show="isShowForwardModal"
      isForwardMessages
      @hideModal="hideForwardModal" />

    <in-chat-image-modal />
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  import {CHAT, FETCH_CHAT, LOADING, moduleName as chatsModule} from "Store/modules/chats/chats";

  import ChatHeader from "ComponentsVue/chats/Chat/ChatHeader";
  import ChatMessages from "ComponentsVue/chats/Chat/ChatMessages";
  import ChatMessageInput from "ComponentsVue/chats/Chat/ChatMessageInput";
  import ConfirmDeleteMessagesModal from "ComponentsVue/chats/modal/ConfirmDeleteMessagesModal";
  import ChatMessagesForward from "ComponentsVue/chats/ChatMessagesForward/ChatMessagesForward";
  import ChatImageModal from "ComponentsVue/chats/modal/ChatImageModal";

  export default {
    name: "Chat",
    components: {
      inChatHeader: ChatHeader,
      inChatMessages: ChatMessages,
      inChatMessageInput: ChatMessageInput,
      inConfirmDeleteMessagesModal: ConfirmDeleteMessagesModal,
      inChatMessagesForward: ChatMessagesForward,
      inChatImageModal: ChatImageModal
    },
    data() {
      return {
        inputHeight: '61px',
        isShowDeleteModal: false,
        isShowForwardModal: false
      }
    },
    computed: {
      ...mapGetters({
        chatInfo: chatsModule + CHAT,
        loading: chatsModule + LOADING,
      }),
      chat() {
        return this.chatInfo(this.chatId)
      },
      chatId() {
        return this.$route.params.chat_id
      }
    },
    mounted() {
      if (!this.chat) {
        this.fetchChat({id: this.chatId});
      }
    },
    beforeRouteUpdate(to, from, next) {
      if (to.path !== from.path) {
        this.fetchChat({id: this.chatId});
      }
      next();
    },
    methods: {
      ...mapActions({
        fetchChat: chatsModule + FETCH_CHAT
      }),
      updateInputHeight(value) {
        this.inputHeight = value;
      },
      showModal(value) {
        if(value === 'delete') {
          this.isShowDeleteModal = true;
        } else if(value === 'forward') {
          this.isShowForwardModal = true;
        }
      },
      hideDeleteModal() {
        this.isShowDeleteModal = false;
      },
      hideForwardModal() {
        this.isShowForwardModal = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  #chat {
    margin-bottom: -10px;

    .chat-bg {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background: url('https://media.inrating.top/storage/img/backgrounds/BgMsg_mob.jpg') no-repeat #f1f1f1;
      background-size: cover;
      z-index: -1;
    }
  }
</style>
