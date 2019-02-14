<template>
  <div id="sendMessage">
    <label>
      <input type="file" @change="changeFile()" id="sendFile">
      <img  id="outImage"/>
      <i class="icon-attachment downloadFile"></i>
    </label>

    <textarea type="text" id="message-input" name="message" @keyup="changeArrow()" placeholder="Написать..."></textarea>
    <i @click="sendMessage()" id="sendArrow" class="icon-send"></i>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    props:['discussionId'],
    methods: {
      sendMessage() {

        let data = new FormData();
        let message_send=document.getElementById('message-input').value;
        data.append('discussion_id',this.discussionId);
        data.append('message',message_send);

        axios.post('v1/discussions/messages/create', data)
          .then(
            res=> {
              document.getElementById('message-input').value='';
              //this.$root.$emit('newSendMessage');
            }
          )

      },
      changeArrow() {
        if (document.getElementById('message-input').value!='') {
          document.getElementById('sendArrow').style.color="#5ac5c6";
        }
      }
    }
  }
</script>

<style>

</style>
