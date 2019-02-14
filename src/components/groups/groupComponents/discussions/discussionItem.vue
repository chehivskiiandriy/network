<template>
  <router-link :to="routerLink">
    <div class="discussion-item">
        <span v-text="discussion.title"></span>
        <div class="discussion-info">
          <div class="discussion-message">
            <span class="discussion-message--count" v-text="discussion.message_count"></span>
            <i class="icon-speech-2"></i>
          </div>
          <div class="discussion-create">
            <span v-text="discussion.created_at"></span>
          </div>
        </div>
    </div>
  </router-link>
</template>
<script>
  export default  {
    data() {
      return {
      }
    },
    props:['discussion'],
    computed: {
      routerLink() {
        return {
          name: 'group-discussion',
          params: {
            group_slug: this.$route.params.group_slug,
            discussion_slug: this.discussion.id,
          }
        }
      }
    },
    mounted() {
    }
  }
</script>
<style>


  h4 {
    color: #585858;
    margin:3px 0px;
    width: 100%;
    font-weight: 500;
  }

  .discussion-info {
    display: flex;
    justify-content: space-between;
    margin:3px 0px;
    align-items: flex-end;
  }

  .discussion-item {
    width:97%;
    padding: 5px 12px;
    box-sizing: border-box;
    box-shadow: 2px 2px 0px 0px rgba(95, 92, 92, 0.2);
    text-align: left;
    border-radius: 5px;
    margin: 5px auto;

  }

  .discussion-message {
    display: flex;
    align-items: center;
  }

  .discussion-message--count {
    color:#000;
  }

  .discussion-create {
    color:#000;
    font-size: 11px;
  }

</style>
