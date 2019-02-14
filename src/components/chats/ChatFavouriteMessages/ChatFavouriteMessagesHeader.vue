<template>
  <div class="chat-favourite-messages-header">
    <in-chats-common-header :name="$lang.variables.favouriteMessages"/>
    <in-chat-header-actions @showModal="showModal" />
  </div>
</template>

<script>
  import {scrollOnBottom} from "Mixins/scrollOnBottom";
  import ChatsCommonHeader from "ComponentsVue/chats/ChatsCommonHeader";
  import ChatHeaderActions from 'ComponentsVue/chats/ChatHeaderActions';

  export default {
    name: "ChatFavouriteMessagesHeader",
    mixins: [scrollOnBottom],
    components: {
      inChatsCommonHeader: ChatsCommonHeader,
      inChatHeaderActions: ChatHeaderActions
    },
    methods: {
      showModal(value) {
        this.$emit('showModal', value);
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
