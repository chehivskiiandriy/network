<template>
  <div id="chat-message-input">
    <div
      v-if="selectedForwardMessages"
      class="selected-message">
      <div class="selected-message-icon">
        <i class="icon-actions icon-re-send"></i>
      </div>
      <div class="selected-message-name">{{$lang.variables.forward}} {{selectedForwardMessages.length}} {{$lang.variables.messages.toLowerCase()}}</div>
      <div
        @click="changeSelectedForwardMessagesAction"
        class="selected-message-delete">
        <i class="icon-delete-f"></i>
      </div>
    </div>

    <div
      v-if="selectedForwardPost"
      class="selected-forward">
      <div class="selected-forward-icon">
        <i class="icon-actions icon-re-send"></i>
      </div>
      <div class="selected-forward-name">{{$lang.variables.forwardPost}}</div>
      <div
        @click="changeSelectedForwardPostAction"
        class="selected-forward-delete">
        <i class="icon-delete-f"></i>
      </div>
    </div>

    <div
      v-if="file"
      class="chosen-file">
      <div class="chosen-file-img">
        <img src="https://media.inrating.top/storage/img/default/new_story.png">
      </div>
      <div class="chosen-file-name" v-text="file.name"></div>
      <div
        @click="deleteFile"
        class="chosen-file-delete">
        <i class="icon-delete-f"></i>
      </div>
    </div>

    <div
      @click="chooseFile"
      class="attachment">
      <i class="icon-attachment"></i>
      <form enctype="multipart/form-data">
        <input
          @change="changeFile"
          type="file"
          ref="addFileInput"
          accept="image/*, video/*"
          class="file-input">
      </form>
    </div>
    <div class="message-input">
       <textarea
         ref="textarea"
         rows="1"
         @keydown="resizeHeight"
         v-model="message"
         class="message-input-field"
         :placeholder="$lang.variables.enterMessage"></textarea>
    </div>
    <div
      @click="sendMessage"
      class="send">
      <i
        class="icon-send"
        :class="{'icon-send-active': message.trim().length > 0 || file || selectedForwardMessages || selectedForwardPost}"></i>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import {
    moduleName as chatsAllModule,
    CREATE_CHAT
  } from "Store/modules/chats/chatsAll";

  import {
    moduleName as chatMessagesModule,
    SELECTED_FORWARD_MESSAGES,
    SELECTED_FORWARD_POST,
    FORWARD_MESSAGES,
    FORWARD_POST,
    CHANGE_SELECTED_FORWARD_MESSAGES,
    CHANGE_SELECTED_FORWARD_POST,
    SEND_MESSAGE
  } from "Store/modules/chats/chatMessages";

  export default {
    name: "ChatMessageInput",
    props: {
      isNewChat: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        message: '',
        file: null
      }
    },
    computed: {
      ...mapGetters({
        selectedForwardMessages: chatMessagesModule + SELECTED_FORWARD_MESSAGES,
        selectedForwardPost: chatMessagesModule + SELECTED_FORWARD_POST
      }),
      chatId() {
        return this.$route.params.chat_id
      },
      forwardMessagesHeight() {
        return this.selectedForwardMessages ? 50 : 0
      },
      forwardPostHeight() {
        return this.selectedForwardPost ? 50 : 0
      },
      fileHeight() {
        return this.file ? 40 : 0
      },
      attachmentHeight() {
        return this.forwardMessagesHeight + this.forwardPostHeight + this.fileHeight
      }
    },
    watch: {
      '$route'(to, from) {
        if(to.path !== from.path) {
          this.deleteFile();
        }
      }
    },
    mounted() {
      this.resizeHeight();
    },
    beforeDestroy() {
      if(this.selectedForwardMessages) {
        this.changeSelectedForwardMessages(null);
      } else if(this.selectedForwardPost) {
        this.changeSelectedForwardPost(null);
      }
    },
    methods: {
      ...mapActions({
        sendMessageAction: chatMessagesModule + SEND_MESSAGE,
        createChat: chatsAllModule + CREATE_CHAT,
        forwardMessages: chatMessagesModule + FORWARD_MESSAGES,
        forwardPost: chatMessagesModule + FORWARD_POST
      }),
      ...mapMutations({
        changeSelectedForwardMessages: chatMessagesModule + CHANGE_SELECTED_FORWARD_MESSAGES,
        changeSelectedForwardPost: chatMessagesModule + CHANGE_SELECTED_FORWARD_POST
      }),
      forward() {
        if (this.selectedForwardMessages) {
          const ids = this.selectedForwardMessages.map(item => item.id);
          this.forwardMessages({chatId: this.chatId, ids});
          this.changeSelectedForwardMessages(null);
        } else if (this.selectedForwardPost) {
          this.forwardPost({chatId: this.chatId, postId: this.selectedForwardPost.id});
          this.changeSelectedForwardPost(null);
        }
      },
      chooseFile() {
        this.$refs.addFileInput.click();
      },
      changeFile() {
        this.file = this.$refs.addFileInput.files[0];
        if(this.selectedForwardMessages || this.selectedForwardPost) {
          this.sendMessage();
        }
        this.resizeHeight();
      },
      sendMessage() {
        if(this.message.trim() || this.file) {
          if(this.isNewChat) {
            const payload = {
              name: 'New chat',
              ids: [this.$route.params.user_id],
              message: this.message,
              file: this.file,
              onSuccess: this.onSuccessCreateChat
            };

            this.createChat(payload);
          } else {
            const payload = {
              chatId: this.chatId,
              message: this.message,
              file: this.file
            };
            this.sendMessageAction(payload);
          }
        }

        this.forward();

        this.cleanInput();
      },
      onSuccessCreateChat(id, message, file) {
        const payload = {
          chatId: id,
          message,
          file,
          onSuccess: this.onSuccess
        };
        this.sendMessageAction(payload);
      },
      onSuccess(id) {
        this.$router.replace('/messages/' + id);
      },
      resizeHeight() {
        this.$refs.textarea.style.height = 'auto';

        if (this.$refs.textarea.scrollHeight > 110) {
          this.$refs.textarea.style.height = '100px';
          if(!this.isNewChat) this.$emit('updateInputHeight', 122 + this.attachmentHeight + 'px');
        } else {
          this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight - 10 + 'px';
          let updateBottom = this.$refs.textarea.scrollHeight + 22 + this.attachmentHeight;
          if(!this.isNewChat) this.$emit('updateInputHeight', (updateBottom > 60 ? updateBottom : 61) + 'px');
        }
      },
      deleteFile() {
        this.file = null;
        this.$refs.addFileInput.value = '';
        this.resizeHeight();
      },
      cleanInput() {
        this.message = '';

        this.$refs.textarea.style.height = 'auto';
        this.$refs.textarea.style.height = '19px';
        if(!this.isNewChat) this.$emit('updateInputHeight', 61 + this.attachmentHeight + 'px');

        if (this.file) {
          this.deleteFile();
        }
      },
      changeSelectedForwardMessagesAction() {
        this.changeSelectedForwardMessages(null);
        this.resizeHeight();
      },
      changeSelectedForwardPostAction() {
        this.changeSelectedForwardPost(null);
        this.resizeHeight();
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .file-input {
    display: none;
  }

  #chat-message-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    min-height: 60px;
    max-height: calc(~'100px + 10px + 4vw');
    background: @white;
    z-index: 12000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid #eee;

    ::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #FF0000;
    }

    .attachment,
    .send {
      height: 60px;
      width: 50px;
      box-sizing: border-box;
      /*padding: 5px;*/
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .icon-attachment {
      color: @contest-list-text-color;
      font-size: 6vw;
    }

    .icon-send {
      color: @dark_grey;
      font-size: 6vw;

      &-active {
        .text-grad();
      }
    }

    .message-input {
      width: calc(~'100vw - 100px');
      padding: 10px 0;
      box-sizing: border-box;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      &-field {
        border: none;
        font-size: 4vw;
        width: 100%;
        resize: none;
        overflow: auto;
        padding: 5px;

        &::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
          //color: @present_grey;
          //opacity: 1; /* Firefox */
          /*letter-spacing: 0px;*/
          /*word-spacing: -5px;*/
        }

        &:-ms-input-placeholder { /* Internet Explorer 10-11 */
          //color: @present_grey;
        }

        &::-ms-input-placeholder { /* Microsoft Edge */
          //color: @present_grey;
        }
      }
    }

    .chosen-file {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;

      &-img {
        width: 40px;
        height: 100%;
        padding: 4px;
        box-sizing: border-box;

        img {
          height: 32px;
          width: 32px;
        }
      }

      &-name {
        width: calc(~'100vw - 80px');
        padding: 0 10px;
        box-sizing: border-box;
        text-align: left;
        .truncate();
      }

      &-delete {
        width: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .selected-message,
    .selected-forward {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 100%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;

      &-icon {
        width: 50px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-actions {
          .text-grad();
        }
      }

      .icon-actions {
        font-size: 20px;
      }

      &-name {
        width: calc(~'100vw - 100px');
        padding: 0 5px;
        box-sizing: border-box;
        text-align: left;
        .truncate();
      }

      &-delete {
        width: 50px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
