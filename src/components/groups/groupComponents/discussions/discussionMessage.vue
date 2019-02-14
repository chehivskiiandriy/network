<template>
      <div class="discussion-message--item">
        <div class="discussion-message--header">
          <div class="discussion-message--user">
            <span class="discussion-user--nickname" v-text="this.message.author.nickname"></span>
            <in-time :time="this.message.created_at"></in-time>
          </div>
          <div class="discussion-message--image" ><img :src="this.message.author.avatar_image.url_small"/></div>
        </div>
        <div class="discussion-message--text">
          <span v-text="this.message.message"></span>
        </div>
        <div class="discussion-message--info">
          <i class="icon-heart-f"></i> 128
          <span>Ответить</span>
        </div>
      </div>
</template>
<script>
    export default {
      props:['message'],
    }
</script>
<style>
  .discussion-message--item {
    border-bottom: 1px solid #666666;
  }

  .discussion-message--header {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
  }

  .discussion-message--user {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 10px;
    align-items: flex-end;
  }

  .discussion-message--image {
    width: 15%;
  }

  .discussion-message--image img{
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
  }

  .discussion-user--nickname {
    color: #5ac5c6;
    font-weight: 600;
  }

  .discussion-message--text {
    font-size: 12px;
    text-align: left;
    padding: 10px;
  }

  .discussion-message--info {
    color:#5ac5c6;
    width: 100%;
    padding:0px 10px;
    box-sizing: border-box;
    text-align: right;
    margin-bottom: 5px;
  }
</style>

