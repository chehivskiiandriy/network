<template>
  <in-transition-component name="fade">
    <div v-if="selectedMessages.length > 0" class="chat-header-actions">
      <div class="chat-header-actions-left">
        <i
          class="icon-actions icon-delete-f"
          @click="resetSelectedMessages"></i>
        <transition :name="translateAnimationName">
          <div
            v-if="translateAnimationName === 'translateYRevert' && selectedMessages.length % 2 === 0"
            :key="selectedMessages.length"
            class="span">{{selectedMessages.length}}</div>
          <div
            v-if="selectedMessages.length % 2 === 1"
            :key="selectedMessages.length"
            class="span">{{selectedMessages.length}}</div>
          <div
            v-if="translateAnimationName === 'translateY' && selectedMessages.length % 2 === 0"
            :key="selectedMessages.length"
            class="span">{{selectedMessages.length}}</div>
        </transition>
      </div>
      <div class="chat-header-actions-right">
        <i
          v-if="isActiveCopyLink"
          class="icon-actions icon-copy"
          @click="copyText"></i>
        <i
          class="icon-actions rotate180 icon-re-send"
          @click="forwardInCurrentChat"></i>
        <i
          v-if="chatId"
          class="icon-actions icon-star-f"
          @click="addToFavourite"></i>
        <i
          class="icon-actions icon-re-send"
          @click="forwardMessages"></i>
        <i
          class="icon-actions icon-trash"
          @click="deleteMessagesAction"></i>
      </div>
    </div>
  </in-transition-component>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import {
    moduleName as chatMessagesModule,
    RESET_SELECTED_MESSAGES,
    SELECTED_MESSAGES,
    CHANGE_SELECTED_FORWARD_MESSAGES
  } from "Store/modules/chats/chatMessages";

  import {
    ADD_FAVOURITE_MESSAGES,
    moduleName as chatFavouriteMessagesModule
  } from "Store/modules/chats/chatFavouriteMessages";

  import { writeTextToClipboard } from 'JsLib/clipboard';

  export default {
    name: "ChatHeaderActions",
    data() {
      return {
        translateAnimationName: 'translateY',
        old: [],
      }
    },
    computed: {
      ...mapGetters({
        selectedMessages: chatMessagesModule + SELECTED_MESSAGES,
      }),
      chatId() {
        return this.$route.params.chat_id
      },
      isActiveCopyLink() {
        for (let i = 0; i < this.selectedMessages.length; i++ ) {
          if(this.isMessage(i) || this.isForwardMessage(i)) {
            return true;
          }
        }
        return false;
      }
    },
    watch: {
      selectedMessages(newValue) {
        if(newValue && newValue.length > this.old.length) {
          this.translateAnimationName = 'translateY';
        } else {
          this.translateAnimationName = 'translateYRevert';
        }
        this.old = [...newValue];
      }
    },
    methods: {
      ...mapActions({
        addFavouriteMessages: chatFavouriteMessagesModule + ADD_FAVOURITE_MESSAGES,
      }),
      ...mapMutations({
        resetSelectedMessages: chatMessagesModule + RESET_SELECTED_MESSAGES,
        changeSelectedForwardMessages: chatMessagesModule + CHANGE_SELECTED_FORWARD_MESSAGES,
      }),
      isMessage(i) {
        return this.selectedMessages[i].message
      },
      isForwardMessage(i) {
        return this.selectedMessages[i]
          && this.selectedMessages[i].attachments.messages
          && this.selectedMessages[i].attachments.messages[0].message
      },
      forwardMessages() {
        this.$emit('showModal', 'forward');
      },
      forwardInCurrentChat() {
        this.changeSelectedForwardMessages([...this.selectedMessages]);
        this.resetSelectedMessages();
      },
      async addToFavourite() {
        const selectedIds = this.selectedMessages.map(item => item.id);

        await this.addFavouriteMessages(selectedIds);

        this.$notify({
          group: 'common',
          duration: 3000,
          speed: 300,
          text: this.$lang.variables.addedToFavorites + ''
        });
      },
      deleteMessagesAction() {
        this.$emit('showModal', 'delete');
      },
      async copyText() {
        let text = '';

        for (let i = 0; i < this.selectedMessages.length; i++ ) {
          if(this.isMessage(i)) {
            if(text) {
              text += '\n\n';
            }
            text += this.isMessage(i);
          }

          if (this.isForwardMessage(i)) {
            if(text) {
              text += '\n\n';
            }
            text += this.isForwardMessage(i);
          }
        }

        await writeTextToClipboard(text);

        this.$notify({
          group: 'common',
          duration: 3000,
          speed: 300,
          text: this.$lang.variables.messagesCopied
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .chat-header-actions {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1112;
    height: 40px;
    background: #fff;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: @dark_grey;

    .rotate180 {
      transform: rotateY(180deg);
    }

    .icon-actions {
      height: 40px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;

      //&:active {
        //.text-grad();
      //}
    }

    @keyframes rotateIcon {
      from {
        transform: rotate(-180deg);
        opacity: 0.5;
      }
      to {
        transform: rotate(0);
        opacity: 1;
      }
    }

    .icon-delete-f {
      animation: rotateIcon 0.5s ease-out;
      font-size: 16px;
    }

    .span {
      padding: 2px 0 0 10px;
      font-weight: bold;
      position: absolute;
      left: 40px;
    }

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    &-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .icon-actions {
        margin-right: 10px;
      }
    }

    .translateY-enter-active {
      animation: translateY-in 0.2s ease-out forwards;
    }

    .translateY-leave-active {
      animation: translateY-out 0.2s ease-out forwards;
    }

    .translateYRevert-enter-active {
      animation: translateYRevert-in 0.2s ease-out forwards;
    }

    .translateYRevert-leave-active {
      animation: translateYRevert-out 0.2s ease-out forwards;
    }

    @keyframes translateY-out {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }

    @keyframes translateY-in {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes translateYRevert-out {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(-100%);
        opacity: 0;
      }
    }

    @keyframes translateYRevert-in {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  }
</style>
