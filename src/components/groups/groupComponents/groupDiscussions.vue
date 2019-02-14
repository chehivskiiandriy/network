<template>
  <div id="groupsDiscussion">
    <h3 class="group-title">{{$lang.variables.discussions}}</h3>
    <div class="discussion-blocks">
      <div v-for="discussion in allDiscussion">
        <in-discussion-item :discussion="discussion"/>
      </div>
    </div>
  </div>
</template>
<style>

</style>
<script>
  import axios from 'axios';

  import Vue from 'vue'
  import discussionItem from 'ComponentsVue/groups/groupComponents/discussions/discussionItem'

  Vue.component('in-discussion-item', discussionItem);
  export default {
    data(){
      return {
        allDiscussion: [],
      }
    },
    mounted(){
      let group_slug = this.$route.params.group_slug;
      axios.get('v1/discussions/all?group_slug=' + group_slug)
      .then(res =>{
        this.allDiscussion = res.data.data;
      })
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/groups.less';
</style>
