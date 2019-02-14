<template>
    <div id="sendMessage">
        <label>
                <input type="file" @change="changeFile()" id="sendFile">
                <img  id="outImage"/>
                <i class="icon-attachment downloadFile"></i>
            </label>

            <textarea type="text" v-model="sendMessageValue" id="message-input" name="message" @keyup="changeArrow()" :placeholder="$lang.chats.write"></textarea>
            <i @click="sendMessage()" id="sendArrow" class="icon-send"></i>
    </div>
</template>

<script>
  import axios from 'axios';

  export default {
    props:['threadId'],
    data() {
      return {
        sendMessageValue:'',
        sendIndex:true,
      }
    },
    methods: {
      changeFile() {
        let fileData;
        let data = new FormData();
        let sendFile=document.getElementById('sendFile').files;
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
                    let message_send=document.getElementById('message-input').value;
                    data.append('chat_id',this.threadId);
                    data.append('message',message_send);
                    fileData=JSON.stringify(lastData);
                    data.append('upload',fileData);
                    axios.post('v1/me/chats/messages/send', data)
                      .then(
                        res=> {
                          document.getElementById('message-input').value='';
                          document.getElementById('sendFile').value='';
                          this.$root.$emit('newSendMessage');
                        }
                      )
                  }
                )
            }
          )
      },
      sendMessage() {

          let data = new FormData();
          if (this.sendMessageValue) {
            if (this.sendIndex) {
              this.sendIndex=false;
              data.append('chat_id',this.threadId);
              data.append('message',this.sendMessageValue);
              axios.post('v1/me/chats/messages/send', data)
                .then(
                  res=> {
                    this.sendMessageValue='';
                    this.sendIndex=true;
                    this.$root.$emit('newSendMessage');
                  }
                )
            }


          }
          else {
              this.$notify({
                group:'empty-chat-message',
                duration:3000,
                speed:300,
              })
          }
      },
      changeArrow() {
          if (this.sendMessageValue!='') {
              document.getElementById('sendArrow').style.color="#5ac5c6";
          }
      }
    }
}
</script>

<style>

</style>
