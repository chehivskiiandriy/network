<template>
  <transition name="fade">
    <div v-if="selectedImage" class="chat-image-modal">
      <div
        @click="changeSelectedImage(null)"
        class="chat-image-modal-bg"></div>
      <i
        @click="changeSelectedImage(null)"
        class="chat-image-modal-close icon-delete-f"></i>
      <div v-if="selectedImage" class="chat-image-modal-container">
        <img :src="selectedImage.url_large">
      </div>
    </div>
  </transition>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';

  import {
    moduleName as chatMessagesModule,
    SELECTED_IMAGE,
    CHANGE_SELECTED_IMAGE
  } from "Store/modules/chats/chatMessages";

  export default {
    name: "ChatImageModal",
    computed: {
      ...mapGetters({
        selectedImage: chatMessagesModule + SELECTED_IMAGE
      })
    },
    methods: {
      ...mapMutations({
        changeSelectedImage: chatMessagesModule + CHANGE_SELECTED_IMAGE
      })
    }
  }
</script>

<style lang="less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .chat-image-modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 12500;
    display: flex;
    align-items: center;
    justify-content: center;

    &-bg {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 12501;
    }

    &-close {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 12503;
      padding: 10px;
      font-size: 20px;
      color: #fff;
    }

    &-container {
      /*background: #fff;*/
      /*width: 100vw;*/
      /*height: 100vh;*/
      z-index: 12502;

      img {
        max-width: 100vw;
        max-height: 100vh;
        object-fit: contain;
        vertical-align: middle;
      }
    }
  }
</style>
