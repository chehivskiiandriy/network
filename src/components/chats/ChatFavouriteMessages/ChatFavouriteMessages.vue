<template>
  <div class="chat-favourite-messages">
    <in-chat-favourite-messages-header @showModal="showModal" />
    <in-chat-messages inputHeight="0px" />
    <div class="chat-bg"></div>

    <in-confirm-delete-messages-modal
      :show="isShowDeleteModal"
      @hideModal="hideDeleteModal" />

    <in-chat-messages-forward
      :show="isShowForwardModal"
      isForwardMessages
      @hideModal="hideForwardModal" />
  </div>
</template>

<script>
  import ConfirmDeleteMessagesModal from "ComponentsVue/chats/modal/ConfirmDeleteMessagesModal";
  import ChatMessagesForward from "ComponentsVue/chats/ChatMessagesForward/ChatMessagesForward";
  import ChatFavouriteMessagesHeader from "ComponentsVue/chats/ChatFavouriteMessages/ChatFavouriteMessagesHeader";
  import ChatMessages from "ComponentsVue/chats/Chat/ChatMessages";

  export default {
    name: "ChatFavouriteMessages",
    components: {
      inChatFavouriteMessagesHeader: ChatFavouriteMessagesHeader,
      inChatMessages: ChatMessages,
      inConfirmDeleteMessagesModal: ConfirmDeleteMessagesModal,
      inChatMessagesForward: ChatMessagesForward
    },
    data() {
      return {
        isShowDeleteModal: false,
        isShowForwardModal: false
      }
    },
    methods: {
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
  .chat-favourite-messages {
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
