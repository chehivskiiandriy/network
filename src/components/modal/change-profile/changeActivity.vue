<template>
  <modal
    name="changeActivity"
    width="100%"
    classes=" v--modal "
    height="100%"
    :scrollable="true">
    <div class="acivity-header">
      <i
        @click="hideActivity()"
        class="icon-left-f closeActivity"></i>
      <h3>{{$lang.variables.chooseActivity}}</h3>
    </div>
    <!--<div class="activity-search">
        <input type="text" id="searchActivity" @keyup="searchActivity()">
    </div>!-->
    <div class="activity-block">
      <div
        class="activity-child"
        v-for="(activity,index) in activityArray"
        @click="addToActivity(activity.value, index)">
        <div
          class="activity-item"
          v-if="index < 10">
          <div
            class="activity-item--text">
            <p v-text="activity.value"></p>
            <i v-if="chooseActivityArray.indexOf(activity.value) !== -1" class="icon-check-f active"></i>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
  import axios from 'axios';

  export default {
    props: ['chooseActivityArray'],
    data(){
      return {
        activityArray: [],
      }
    },
    mounted(){
      axios.get('v1/dict/activity-status/search?query=')
        .then(res =>{
          this.activityArray = res.data.data;
        })
        .catch(err => console.log(err.response));
    },
    methods: {
      hideActivity(){
        this.$modal.hide('changeActivity');
      },
      searchActivity(){
        let query = document.getElementById('searchActivity').value;
        axios.get('v1/dict/activity-status/search?query=' + query)
          .then(res =>{
            this.activityArray = res.data.data;
          })
      },
      addToActivity(activity, i){
        let trueIndex = this.chooseActivityArray.indexOf(activity);
        if(trueIndex === -1){
          this.chooseActivityArray.push(activity);
          // if(e.target.parentElement.parentElement.children[0].classList[0] == 'activity-item--radio'){
          //   e.target.parentElement.parentElement.children[0].style.background = '#5ac5c6';
          // }
        }
        else{
          this.chooseActivityArray.splice(trueIndex, 1);
          // if(e.target.parentElement.parentElement.children[0].classList[0] == 'activity-item--radio'){
          //   e.target.parentElement.parentElement.children[0].style.background = '#fff';
          // }
        }
      }

    }
  }
</script>

<style>


  .acivity-header{
    border-bottom: 1px solid #d3d3d3;
  }

  .activity-item{
    display: flex;
    align-items: center;
    padding: 0px 10px;
    justify-content: space-between;
  }

  .activity-item--radio{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #d3d3d3;
  }

  .activity-item--radio.active {
    background: #5ac5c6;
  }

  .activity-item--text{
    width: 95%;
    margin-left: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    border-bottom: 1px solid #d3d3d3;
    padding: 8px 0px;
  }

  .activity-item--text i {
    color: #0cb4be;
  }

  .acivity-header{
    text-align: center;
    color: #000;
    position: relative;
    font-weight: 300;
  }

  .closeActivity{
    position: absolute;
    left: 10px;
    top: 3px;
  }

  .activity-block{
    border-bottom: 1px solid #d3d3d3;
    margin-bottom: 30px;
  }

  .v--modal-overlay.scrollable{
    padding-bottom: 0px;
  }

  .activity-search{
    border-bottom: 1px solid #d3d3d3;
    padding: 10px 0px;
    text-align: center;
  }

  .activity-search input{
    width: 99%;
    margin: auto;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #5ac5c6;
    border-radius: 5px;
  }

  .activity-block:last-child{
    border-bottom: 0px;
  }

  .checkbox{
    display: none;
  }

  .activity-item--text p{
    margin: 0px;
  }

  .activity-child{
    width: 100%;
  }
</style>
