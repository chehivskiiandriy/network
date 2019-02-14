<template>
  <modal
    name="changeStatus"
    width="100%"
    classes=" v--modal "
    height="100%"
    :scrollable="true">
    <div class="status-header">
      <i
        @click="hideStatus()"
        class="icon-left-f closeStatus"></i>
      <h3>{{$lang.variables.chooseStatus}}</h3>
    </div>
    <!--<div class="status-search">
        <input type="text" id="searchStatus" @keyup="searchstatus()">
    </div>!-->
    <div class="status-block">
      <div
        class="status-child"
        v-for="(status,index) in statusArray"
        @click="addTostatus(status.value, index)">
        <div
          class="status-item"
          v-if="index < 9">
          <div
            class="status-item--text">
            <p v-text="dataStatusLang[index]"></p>
            <i v-if="chooseStatusArray.indexOf(status.value) !== -1" class="icon-check-f active"></i>
          </div>
        </div>
      </div>
    </div>

  </modal>
</template>

<script>
  import axios from 'axios';

  export default {
    props: ['chooseStatusArray'],
    data(){
      return {
        statusArray: [],
        statusClass: {},
        // dataStatusArray: [],
        dataStatusLang:[this.$lang.variables.student,this.$lang.variables.businesswomen,
          this.$lang.variables.manager,this.$lang.variables.top_manager,this.$lang.variables.official,
          this.$lang.variables.athlete,this.$lang.variables.blogger,this.$lang.variables.media_person,this.$lang.variables.creative_person],

      }
    },
    mounted(){
      // this.dataStatusArray = this.chooseStatusArray;
      axios.get('v1/dict/social-status/search?query=')
        .then(res =>{
          this.statusArray = res.data.data;


        })
        .catch(err => console.log(err.response));
    },
    methods: {
      hideStatus(){
        this.$modal.hide('changeStatus');
      },
      searchstatus(){
        let query = document.getElementById('searchStatus').value;
        axios.get('v1/dict/social-status/search?query=' + query)
          .then(res =>{
            this.statusArray = res.data.data;
          })
      },
      addTostatus(status, i){



        let trueIndex = this.chooseStatusArray.indexOf(status);
        if(trueIndex === -1){
          // this.statusClass[status] = 'active';
          this.chooseStatusArray.push(status);

        }
        else {
          // this.statusClass[status] = '';
          this.chooseStatusArray.splice(trueIndex, 1);
          // if(e.target.parentElement.parentElement.children[0].classList[0] === 'status-item--radio'){
          //   e.target.parentElement.parentElement.children[0].style.background = '#fff';
          // }
        }
      }
    }
  }
</script>

<style>
  .post-add-cropp{
    text-align: center;
    margin-top: 40px;
  }

  .post-add-cropp > i{
    position: absolute;
    top: 10px;
    right: 2%;
  }

  canvas{
    border-radius: 10px;
    border: 1px solid #d3d3d3;
  }

  .status-item{
    display: flex;
    align-items: center;
    padding: 0px 10px;
    justify-content: space-between;
  }

  .status-item--radio{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #d3d3d3;
    background: #fff;
  }

  .status-item--radio.active {
    background: #5ac5c6;
  }

  .status-item--text{
    width: 95%;
    margin-left: 5%;
    text-align: left;
    border-bottom: 1px solid #d3d3d3;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .status-item--text i {
    color: #0cb4be;
  }

  .status-item--text p {
    margin: 0px;
    padding: 10px 0px;
  }

  .status-header{
    text-align: center;
    color: #000;
    position: relative;
    font-weight: 300;
  }

  .closeStatus{
    position: absolute;
    left: 10px;
    top: 3px;
  }

  .status-block{
    border-bottom: 1px solid #d3d3d3;
    margin-bottom: 30px;
  }

  .v--modal-overlay.scrollable{
    padding-bottom: 0px;
  }

  .status-search{
    border-bottom: 1px solid #d3d3d3;
    padding: 10px 0px;
    text-align: center;
  }

  .status-search input{
    width: 99%;
    margin: auto;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #5ac5c6;
    border-radius: 5px;
  }

  .status-block:last-child{
    border-bottom: 0px;
  }

  .checkbox{
    display: none;
  }


</style>
