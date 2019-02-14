<template>
  <div id="sendMessage">
    <label>
      <input type="file" id="sendFile">
      <i class="icon-attachment downloadFile"></i>
    </label>

    <textarea type="text" id="message-input" name="message" @keyup="changeArrow()" :placeholder="$lang.chats.write"></textarea>
    <i @click="sendMessage()" id="sendArrow" class="icon-send"></i>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
        return {
            threadId:'',
        }
    },

    methods: {
      sendMessage() {
          let fileData;
          let data = new FormData();
          let message_send=document.getElementById('message-input').value;
          let sendFile=document.getElementById('sendFile').files;
          //let file = imageHelper.formatPhoto(sendFile); //отдает нам то что надо.
          let newUser=[];
          newUser.push(this.$route.params.user_chat);
          let createChat=new FormData;
          createChat.append('name','My Friends');
          createChat.append('ids',JSON.stringify(newUser))
          axios.post('v1/me/chats/create',createChat)
          .then(
              res=>{
                  /*TODO THIS SHIT*/
                  this.threadId=res.data.id;
                  data.append('chat_id',this.threadId);
                    data.append('message',message_send);
                    if (sendFile[0]!=null) {
                        axios.get('v1/uploads/create?type=user-message')
                        .then(
                            res=> {
                            let uploadId=res.data.upload_id;
                            let uploadFile=new FormData();
                            uploadFile.append('upload_id',uploadId);
                            uploadFile.append('file', sendFile[0]);
                            axios.post('v1/uploads/load',uploadFile)
                            .then (
                                res=> {
                                let uploadLast=res.data.upload_id;
                                let fileLast=res.data.file_id;
                                let lastData= {
                                    'id': uploadLast,
                                    'items': [fileLast]
                                };
                                fileData=JSON.stringify(lastData);
                                data.append('upload',fileData);
                                axios.post('v1/me/chats/messages/send', data)
                                .then(
                                    res=> {
                                    document.getElementById('message-input').value='';
                                    document.getElementById('sendFile').value='';
                                    this.$root.$emit('newSendMessage');
                                    this.$router.replace('/messages/'+this.threadId)
                                    }
                                )
                                }
                            )
                            }
                        )
          }
          else {
            axios.post('v1/me/chats/messages/send', data)
            .then(
              res=> {
                document.getElementById('message-input').value='';
                this.$root.$emit('newSendMessage');
                this.$router.replace('/messages/'+this.threadId)
                }
            )
          }
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
