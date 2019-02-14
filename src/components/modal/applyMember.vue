<template>
  <modal
    name="applyMember"
    width="100%"
    classes=" v--modal "
    height="100%"
    :scrollable="true">
    <div class="apply-header">
      <i
        @click="closeApplyMember()"
        class="icon-delete-f"></i>
    </div>
    <h2>Подача заявки на конкурс</h2>
    <div class="apply-member">
      <p>Поле дополнительной информации конкурса</p>
      <input
        type="text"
        id="apply-input"
        class="apply-input">
      <p>Выберите фото для данного конкурса</p>
      <div class="member-photos">
        <div
          class="member-photos--item"
          v-for="(post,key) in userPosts"
          v-bind:style="{height : clientHeight*0.25+'px'}">
          <div v-if="post.attachments.posts==undefined">
            <img
              @click="chooseThisPhoto($event,key,post.id)"
              :src="post.attachments.images[0].url_medium">
            <div
              v-if="keyBlock==key"
              class="choose-block"
              v-bind:style="{height : clientHeight*0.24+'px'}">
              <i class="icon-check-f"></i>
            </div>
          </div>
        </div>
      </div>
      <button @click="applyMember()">Подать заявку</button>
    </div>
  </modal>
</template>

<script>
  import axios from 'axios';

  import {scrollOnBottom} from "../../mixins/scrollOnBottom";

  export default {
    props: ['contest'],
    mixins: [scrollOnBottom],
    data(){
      return {
        userPosts: [],
        memberAvatar: '',
        keyBlock: '',
        postID: '',
        // bottom: false,
        nextPage: 2,
        scrollPosition: 0,
        clientHeight: ''
      }
    },
    watch: {
      bottom(bottom){
        if(bottom){
          this.addPost()
        }
      }
    },
    methods: {
      closeApplyMember(){
        this.$modal.hide('applyMember');
      },
      chooseThisPhoto(e, key, id){
        this.keyBlock = key;
        this.postID = id;
      },
      applyMember(){
        let applyText = document.getElementById('apply-input').value;
        if(applyText != ''){
          let data = new FormData();
          const config = {headers: {'Content-Type': 'multipart/form-data'}};
          data.append('contest_id', this.contest.id);
          data.append('post_id', this.postID);
          data.append('extra', applyText);
          axios.post('v1/contests/applications/send', data, config)
          .then(res =>{
          })
          .catch(err => console.log(err.response));

        }
      },
      addPost(){
        let local = localStorage.getItem('user');
        let user = JSON.parse(local);
        axios.get('v1/users/posts/only-photo?page=' + this.nextPage)
        .then(res =>{
          let postArray = res.data.data;
          let url = res.data.meta.current_page;
          for(let i = 0; i < postArray.length; i++){
            if(postArray[i].attachments_order.length == 1){
              if(postArray[i].attachments_order[0].type == 'image'){
                this.userPosts.push(postArray[i]);
              }
            }
          }
          this.nextPage = url + 1;
          this.postID = this.userPosts[0].id;
        })
      },
    },
    mounted(){
      this.clientHeight = localStorage.getItem('clientWidth');
      let local = localStorage.getItem('user');
      let user = JSON.parse(local);
      axios.get('v1/users/posts/only-photo')
      .then(res =>{
        let postArray = res.data.data;
        for(let i = 0; i < postArray.length; i++){
          if(postArray[i].attachments_order.length == 1){
            if(postArray[i].attachments_order[0].type == 'image'){
              this.userPosts.push(postArray[i]);
            }
          }
        }
        this.postID = this.userPosts[0].id;
      })
    }
  }
</script>

<style>
  @import '~LessStyle/applymember.less';
</style>
