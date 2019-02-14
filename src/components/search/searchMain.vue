<template>
  <div class="searchmain-block">
    <div
      class="search-item"
      v-for="user in allSearch">
      <in-item-user
        :user="user"
        letter='disabled'
        :is_subscribed="user.is_subscribed"></in-item-user>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import itemUser from 'ComponentsVue/itemuser/itemUser.vue'

  Vue.component('in-item-user', itemUser);
  export default {
    data(){
      return {
        allSearch: [],
      }
    },
    mounted(){
      axios.get('v1/users/all')
        .then(res =>{
          this.allSearch = res.data.data;
        })
        .catch(err => console.log(err.response));
    }

  }
</script>

<style>


  .search-item{
    display: flex;
    margin: 10px 0;
    position: relative;
    box-sizing: border-box;
    padding: 5px 0;
    border-radius: 10px;
    box-shadow: 2px 2px 0 0 rgba(95, 92, 92, 0.2);

  }

  .searchmain-block{
    padding-bottom: 65px;
  }

</style>
