<template>
  <in-transition-component name="fade">
    <div v-show="show" class="confirm-delete-modal">
      <div
        @click="cancel"
        class="confirm-delete-modal-bg"></div>
      <transition name="scale">
        <div v-if="show" class="confirm-delete-modal-container">
          <h2 class="confirm-delete-modal-title">{{$lang.variables.message}}</h2>
          <div class="confirm-delete-modal-sub-title">
            {{$lang.variables.wontDelete}} {{$lang.variables.messages.toLowerCase()}}?
          </div>
          <div
            v-if="deleteForAll && chatId"
            @click="changeCheckbox"
            class="confirm-delete-modal-body"
            :class="{'confirm-delete-modal-body-anim': isCheck}">
            <div
              class="confirm-delete-modal-checkbox"
              :class="{active: isCheck}">
              <transition name="scale">
                <i v-if="isCheck" class="icon-check-f"></i>
              </transition>
            </div>
            <div class="confirm-delete-modal-body-message">{{$lang.variables.deleteFor}} {{nickname ? nickname : $lang.variables.allUsers}}</div>
          </div>
          <div class="confirm-delete-modal-actions">
            <div
              @click="cancel"
              class="button button-cancel">{{$lang.variables.cancel}}
            </div>
            <div
              @click="confirm"
              class="button button-confirm">OK
              <!--{{$lang.variables.delete}}-->
            </div>
          </div>
        </div>
      </transition>
    </div>
  </in-transition-component>

</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex';

  import {
    moduleName as chatsModule,
    CHAT
  } from "Store/modules/chats/chats";

  import {
    moduleName as chatMessagesModule,
    RESET_SELECTED_MESSAGES,
    SELECTED_MESSAGES,
    DELETE_MESSAGES
  } from "Store/modules/chats/chatMessages";

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";

  import {
    moduleName as chatFavouriteMessagesModule,
    DELETE_FAVOURITE_MESSAGES
  } from "Store/modules/chats/chatFavouriteMessages";

  export default {
    name: "ConfirmDeleteMessagesModal",
    props: {
      show: Boolean
    },
    data() {
      return {
        isCheck: false,
        chatId: this.$route.params.chat_id,
        loading: false
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
        selectedMessages: chatMessagesModule + SELECTED_MESSAGES,
        chatInfo: chatsModule + CHAT
      }),
      chat() {
        return this.chatId ? this.chatInfo(this.chatId) : null
      },
      nickname() {
        return this.chat && this.chat.type === 1 && this.chat.users[0].nickname
      },
      deleteForAll() {
        return this.selectedMessages.every(item => item.sender_id === this.authUser.id)
      }
    },
    methods: {
      ...mapActions({
        deleteFavouriteMessages: chatFavouriteMessagesModule + DELETE_FAVOURITE_MESSAGES,
        deleteMessages: chatMessagesModule + DELETE_MESSAGES
      }),
      ...mapMutations({
        resetSelectedMessages: chatMessagesModule + RESET_SELECTED_MESSAGES
      }),
      confirm() {
        if(!this.loading) {
          const selectedIds = this.selectedMessages.map(item => item.id);

          if (this.chatId) {
            const payload = {
              chatId: this.chatId,
              ids: selectedIds,
              deleteForAll: this.deleteForAll && this.isCheck,
              onSuccess: this.cancel
            };

            this.loading = true;
            this.deleteMessages(payload);
          } else {
            const payload = {
              ids: selectedIds,
              onSuccess: this.cancel
            };

            this.loading = true;
            this.deleteFavouriteMessages(payload);
          }
        }
      },
      cancel() {
        this.loading = false;
        this.isCheck = false;
        this.$emit('hideModal');
      },
      changeCheckbox() {
        this.isCheck = !this.isCheck;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .scale-enter-active {
    animation: scale-in 0.2s ease-out forwards;
  }

  .scale-leave-active {
    animation: scale-out 0.1s ease-out forwards;
  }

  @keyframes scale-in {
    from {
      transform: scale(0.5);
    }
    to {
      transform: scale(1);
    }
  }

  @keyframes scale-out {
    from {
      transform: scale(1);
    }
    to {
      transform: scale(0.2);
    }
  }

  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 1;
    }
    20% {
      transform: scale(25, 25);
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }

  .confirm-delete-modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 12500;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: left;

    &-bg {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 12501;
    }

    &-container {
      background: #fff;
      border-radius: 5px;
      width: 90vw;
      padding: 15px 0;
      box-sizing: border-box;
      box-shadow: 1px 2px 10px rgba(0, 0, 0, 0.3);
      z-index: 12502;
    }

    &-title {
      margin: 0;
      font-size: 5.2vw;
      padding: 5px 20px;
    }

    &-sub-title {
      padding: 10px 20px 18px 20px;
      font-size: 4.2vw;
    }

    &-body {
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      overflow: hidden;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 5px;
        background: rgba(0, 0, 0, .05);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
      }

      &-message {
        font-size: 4.2vw;
      }
    }

    &-body-anim {
      &:after {
        width: 15px;
        animation: ripple 1s ease-out;
      }
    }

    &-checkbox {
      border: 2px solid #727272;
      border-radius: 3px;
      width: 14px;
      height: 14px;
      font-size: 14px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      padding: 1px;
      transition: 0.2s ease-out;

      &.active {
        border: 2px solid #229acd;
        background: #229acd;
      }

      .icon-check-f {
        color: #fff;
      }
    }

    &-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 3.8vw;
      color: #229acd;
      padding: 8px 20px 0 20px;

      .button {
        padding: 5px 20px;
      }
    }
  }
</style>
