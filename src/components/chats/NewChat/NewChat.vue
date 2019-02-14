<template>
  <div class="new-chat">
    <in-new-chat-header />
    <in-chat-message-input :isNewChat="true" />
    <div class="new-chat-bg"></div>
  </div>
</template>

<script>
  import NewChatHeader from 'ComponentsVue/chats/NewChat/NewChatHeader';
  import ChatMessageInput from "ComponentsVue/chats/Chat/ChatMessageInput";

  export default {
    name: "NewChat",
    components: {
      inNewChatHeader: NewChatHeader,
      inChatMessageInput: ChatMessageInput
    },
  }
</script>

<style lang="less" scoped>
  .new-chat {
    &-bg {
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
