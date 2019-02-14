<template>
    <div>

      <div class="discussion-messages">
          <div v-for="message in allmessages">
              <in-discussion-message :message="message"></in-discussion-message>
          </div>
      </div>
    </div>
</template>
<script>
  import axios from 'axios';

  import Vue from 'vue'
  import discussionMessage from 'ComponentsVue/groups/groupComponents/discussions/discussionMessage'

  Vue.component('in-discussion-message',discussionMessage);
  export default {
    data() {
      return {
        discussion:{},
        allmessages:[],
      }
    },
    mounted() {
      let discussionId=this.$route.params.discussion_slug;
      axios.get('v1/discussions/get?id='+discussionId)
        .then(
          res=> {
            this.discussion=res.data;
          }
        )
      axios.get('v1/discussions/messages/all?discussion_id='+discussionId)
        .then(
          res=> {
            this.allmessages=res.data.data.reverse();
          }
        )
    }
  }
</script>
<style>

</style>
