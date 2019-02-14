<template>
  <div>
    <div
      :class="'post-mentions--icon '+showMentionIconsIndex"
      v-if="imageMentions && imageMentions.length > 0">
      <i
        :class="showMentionIcons"
        @click="showMentions()"></i>

    </div>
    <div
      v-if="showMent"
      class="post-mentions-block">
        <transition-group name="mentions-scale" tag="div">
          <router-link
            v-for="(mention,i) in imageMentions"
            :to="'/u/'+mention.nickname"
            :key="mention.nickname">
            <span
              class="mentionBlock"
              v-bind:style="{'top': mention.y*widthWindow+'px', 'left': mention.x*widthWindow+'px' }">
              {{mention.nickname}}
            <i
              v-if="mention.nickname === currentUsersNickname"
              class="icon-delete-f"
              @click.prevent="deleteMentionOfCurrentUser"></i>
            </span>
          </router-link>
        </transition-group>
      </div>
  </div>


</template>
<script>
  import axios from 'axios';
  import api from 'utils/api';

  export default {
    name: 'postMentions',
    props: ['image', 'currentUsersNickname'],
    data(){
      return {
        imageMentions: [],
        showMent: false,
        widthWindow: localStorage.getItem('clientWidth'),
      }
    },
    computed: {
      showMentionIcons(){
        if(!this.showMent)
          return 'icon-guy-2 mention-icon-index';
        else
          return 'icon-guy-2-f mention-iconbig-index';
      },
      showMentionIconsIndex(){
        if(!this.showMent)
          return ' mention-icon-index';
        else
          return ' mention-iconbig-index';
      },
    },
    mounted(){
      let mentionArray = [];
      mentionArray.push(this.image.id);
      axios.get('v1/mentioned-users/on-image/all?ids=' + JSON.stringify(mentionArray))
        .then(
          res =>{
            this.imageMentions = res.data.data;

          }
        )
    },
    methods: {
      showMentions(){
        this.showMent = !this.showMent;
      },
      async deleteMentionOfCurrentUser() {
        const data = new FormData();
        data.append('image_id', this.image.id);
        try {
          await api.users.deleteMentionOfCurrentUser(data);
          this.imageMentions = this.imageMentions.filter(mention => mention.nickname !== this.currentUsersNickname);
        } catch (e) {
          console.error('Error while deleting mention of current user', e);
        }
      },
    }
  }

</script>
<style>
  .mentions-scale-enter-active, .mentions-scale-leave-active {
    transition: all 0.3s;
  }
  .mentions-scale-enter-active .mentionBlock, .mentions-scale-leave-active .mentionBlock {
    transition: all 0.3s;
  }
  .mentions-scale-enter .mentionBlock, .mentions-scale-leave-to .mentionBlock{
    transform: scale(0);
  }
</style>
