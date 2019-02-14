<template>
  <div>
    <input class="group_input" name="title" ref="discussionCreateTitle" type="text" placeholder="Введите название обсуждения">
    <input class="group_input" name="desc" ref="discussionMessage" type="text" placeholder="Введите сообщение  обсуждения">
    <input type="button" @click="createAlbum()" class="group_album_submit" value="Создать">
  </div>
</template>
<style>
  .group_input  {
    width:90%;
    height: 35px;
    font-size: 16px;
    background-color: hsla(0, 0%, 100%, .7);
    outline: 0;
    padding: 5px;
    border-radius: 5px;
    margin-bottom: 20px;
    border: 1px solid #f1f1f1;
    box-sizing: border-box;
    color: #b7bac0;
  }

  .group_album_submit {
    color:#5ac5c6;
    border: 1px solid #5ac5c6;
    padding: 5px 15px;
    border-radius: 10px;
    background: transparent;
    font-size: 14px;
  }
</style>
<script>
  import axios from 'axios';

  export default {
    methods: {
      createAlbum() {
        let discussionCreateTitle=this.$refs.discussionCreateTitle.value;
        let discussionMessage=this.$refs.discussionMessage.value;
        let groupSlug=this.$route.params.group_slug;

        let params={
          group_slug:groupSlug,
          title:discussionCreateTitle,
          message:discussionMessage,
        };
        axios.post('v1/discussions/create',params)
          .then(
            res=> {
            }
          )
      },
    }
  }
</script>
