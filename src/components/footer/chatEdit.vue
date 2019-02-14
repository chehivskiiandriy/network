<template>
  <div id="editChat">
    <i class="icon-star-f"></i>
    <i @click="resendMessages()" class="icon-re-send"></i>
    <i @click="deleteMessages()" class="icon-trash"></i>
    <span class="choose-message">
            <span>{{$lang.chats.selectedMessages}}: {{this.deleteArrayMessage.length}}</span>
            <i class="icon-delete-f" @click="resetDeleteMessages()"></i>
        </span>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    props: ['deleteArrayMessage'],
    methods: {
      deleteMessages() {

        let data = new FormData();
        data.append('ids', JSON.stringify(this.deleteArrayMessage));
        data.append('chat_id',this.$route.params.chat_id);
        axios.post('v1/me/chats/messages/delete', data)
          .then(
            res => {
              this.$root.$emit('updateChat');
            }
          )
      },
      resetDeleteMessages() {
        this.$root.$emit('resetMessagesDeleteArray');
      },
      resendMessages() {
        this.$router.push({
          path: '/chats',
          query: {
            msg: JSON.stringify(this.deleteArrayMessage)
          }
        })
      }
    }
  }
</script>

<style>
  #editChat {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #5ac5c6;
    padding: 5px 0px;
  }

  .choose-message {
    display: flex;
    align-items: center;
    color: #d3d3d3;
    font-size: 16px;
  }

  .choose-message span {
    padding-right: 10px;
  }

  #editChat i {
    font-size: 22px;
    color: #fff
  }
</style>
