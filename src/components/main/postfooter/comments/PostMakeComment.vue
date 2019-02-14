<template>
  <div class="post-make-comment">
    <div class="make-comment-user">
      <textarea
        v-model="message"
        class="make-comment"
        :placeholder="$lang.variables.wtiteComment"></textarea>
    </div>
    <div
      @click="makeComment"
      class="send-comment"
      :class="{'send-comment-active': message.length > 0}">
      <i ref="sendIcon" class="icon-send"></i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'PostMakeComment',
    props: {
      postId: Number
    },
    data(){
      return {
        message:'',
        user: {},
        userAvatar: '',
      }
    },
    mounted(){
      this.$parent.$on('answerNickname', (event) =>{
        this.addCommentMessage(event);
      });
    },
    methods: {
      async makeComment(){
        if(this.message) {
          const data = new FormData();
          data.append('post_id', this.postId);
          data.append('message', this.message);

          this.message = '';

          let res = await this.$api.post.comments.add(data);

          this.$emit('action:add-comment', res.data);
        }
      },
      addCommentMessage(event){
        this.message = event + ',';
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/variables';

  .post-make-comment{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px 5px;
    border-top: 1px solid #d3d3d3;
  }

  .make-comment-user{
    width: 90%;
    display: flex;

  }

  .make-comment-user .solo-user-avatar{
    width: 60px;
    height: 60px;
    border-radius: 10px;
    display: block;

  }

  .post-send-comment{
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.3);
    background: transparent;
    border: 0;
    border-radius: 5px;
    font-size: 14px;
    color: #5ac5c6;
  }

  .make-comment{
    border-radius: 5px;
    height: 24px;
    width: 100%;
    border: none;
    font-size: 4vw;
    resize: none;
    overflow: auto;
    padding: 5px;
  }
  .send-comment {
    font-size: 24px;
    color:#d3d3d3;
    display: flex;
    align-items: center;

    &-active {
      .icon-send {
        .text-grad();
      }
    }
  }
</style>

