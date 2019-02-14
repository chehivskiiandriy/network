<template>
  <modal name="allParicipants"
            width="100%"
            classes=" v--modal all-paricipants"
            height="100%"
            :scrollable="true">
            <h3 class="modal-title">
              Подписчики группы
              <i  @click="hideAllParicipants()" class="close-modal-group icon-left-f"></i>
            </h3>
            <div id="participant-block">
                <div class="search-item" v-for="user in allpatricipants">
                    <in-item-user  letter="disabled"  :user="user"></in-item-user>
                </div>
            </div>
  </modal>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
        return {
            groupSlug:'',
            allpatricipants:[],
        }
    },
    mounted() {
        this.groupSlug=this.$route.params.group_slug;
        axios.get('v1/groups/users/all?group_slug='+this.groupSlug)
        .then(
            res=> {
                this.allpatricipants=res.data.data;
            }
        )
    },
    methods: {
      hideAllParicipants() {
        this.$modal.hide('allParicipants');
      }
    }
}
</script>

<style lang="less">
  @import '~LessStyle/groups.less';
</style>
