<template>
  <div @click="eventToggle">
    <i :class="toggleFunction"></i>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    props: ['className', 'classNameActive', 'statusFieldName', 'fillType', 'actionId', 'authUser'],
    data(){
      return {
        fillTypePost: '',
        statusFieldNamePost: '',
        postCount: '',
      }
    },
    computed: {
      toggleFunction() {
        return this.statusFieldNamePost
          ? this.classNameActive
          : this.className
      }
    },
    mounted(){
      this.postCount = this.count;
      this.statusFieldNamePost = this.statusFieldName;
      this.fillTypePost = this.fillType;
    },
    methods: {
      eventToggle(){
        let fillType = this.fillTypePost;
        let status = this.statusFieldNamePost;
        if(this.authUser.status !== 'guest'){
          if(fillType === 'bookmark'){
            if(status){
              axios.get('v1/users/posts/' + fillType + '?id=' + this.actionId + '&delete=true')
              .then(res =>{
                this.statusFieldNamePost = res.data.state;
              })
              .catch(err => console.log(err.response));
            }
            else{
              axios.get('v1/users/posts/' + fillType + '?id=' + this.actionId)
              .then(res =>{
                this.statusFieldNamePost = res.data.state;
                if(res.data.state){
                  this.postCount++;
                }
              })
              .catch(err => console.log(err.response));
            }
          }
          else if(fillType === 'subscribe'){
            if(status){
              axios.get('v1/users/' + fillType + '?id=' + this.actionId + '&delete=true')
              .then(res =>{
                this.statusFieldNamePost = res.data.state;
              })
              .catch(err => console.log(err.response));
            }
            else{
              axios.get('v1/users/' + fillType + '?id=' + this.actionId)
              .then(res =>{
                this.statusFieldNamePost = res.data.state;
                if(res.data.state){
                  this.postCount++;
                }
              })
              .catch(err => console.log(err.response));
            }
          }
          else{
            if(!status){
              axios.get('v1/me/chats/messages/' + fillType + '?id=' + this.actionId)
              .then(res =>{
                this.statusFieldNamePost = res.data.state;
                let title = '';
                if(res.data.state)
                  title = 'Chin-Chin flirt sent';
                else
                  title = 'You have already sent Chin-Chin flirt';
                this.$notify({
                  group: 'chin-chin',
                  title: title,
                });
              })
              .catch(err => console.log(err.response));
            } else {
              this.$notify({
                group: 'chin-chin',
                title: 'You have already sent Chin-Chin flirt',
              });
            }
          }
        }
        else{
          this.$notify({
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      }
    }
  }
</script>
<style>

</style>
