<template>
  <div class="edit-post-block">
    <div
      v-if="!!this.post.attachments.posts"
      class="post-repost">
      <in-post-image
        :post="this.post.attachments.posts[0].attachments"
        :order="this.post.attachments.posts[0].attachments_order"></in-post-image>
      <div class="post-repost-icon">
        <i class="icon-share-f"></i>
        <router-link :to="'/'+this.post.attachments.posts[0].author.id">
          <span v-text="this.post.attachments.posts[0].author.nickname"></span>
        </router-link>
      </div>
    </div>
    <div
      v-else
      class="post-normal">
      <in-post-image
        :avatar="post.is_avatar"
        :user="post.author"
        :post="this.post.attachments"
        :order="this.post.attachments_order"></in-post-image>
    </div>
    <textarea
      class="edit-text"
      id="change-text"
      :placeholder="$lang.variables.signThePost"
      v-model="changeTitle">
    </textarea>
    <input
      type="text"
      class="change-input"
      @click="googleAutoComplete()"
      v-model="changeLocation" value=""
      :placeholder="$lang.variables.enterYourLocation"
      id="place"
      name="place"/>
    <input type="hidden" name="placeId" id="placeId" value=""/>
    <input
      :placeholder="$lang.variables.addIntags"
      class="change-input"
      v-model="intag"
      id="input-intag"
      v-on:keyup.enter="addIntag()"/>
    <ul id="intagList">
      <li class="intagList-item" v-for="(intag, index) in intagArray">
        <span v-text="'^^'+intag"></span>
        <i @click="deleteIntag(index)" class="icon-delete-f"></i>
      </li>
    </ul>
    <button
      @click="deletePost()"
      class="button-gradient">{{$lang.variables.delete}}
    </button>
    <button
      @click="updatePost()"
      class="button-gradient">{{$lang.variables.update}}
    </button>
  </div>
</template>
<script>
  import axios from 'axios';
  import {mapActions, mapGetters} from 'vuex';

  import Vue from 'vue'
  import PostImage from 'ComponentsVue/main/postimage/PostImage'

  import {EDIT_POST, EDIT_POST_LOADING, moduleName as postsModule} from "Store/modules/posts"
  import {DELETE_GROUP_POST, moduleName as groupPostsModule} from "Store/modules/groups/groupPosts"

  Vue.component('in-post-image', PostImage);
  export default {
    data() {
      return {
        postSlug: '',
        post: [],
        changeLocation: '',
        changeLocationId: '',
        changeTitle: '',
        intagArray: [],
        intag: '',
      }
    },
    computed: {
      ...mapGetters({
        editPostLoading: postsModule + EDIT_POST_LOADING
      })
    },
    mounted() {
      this.postSlug = this.$route.params.post_slug;
      axios.get('v1/users/posts/get?slug=' + this.postSlug)
        .then(
          res => {
            this.post = res.data;
            this.intagArray = this.post.intags.map((intag) => {
              return intag.name
            });
            this.changeTitle = this.post.title;
            if (this.post.place) {
              this.changeLocation = this.post.place.location;
              this.changeLocationId = this.post.place.google_place_id;
            }
          }
        )
    },
    methods: {
      ...mapActions({
        editPost: postsModule + EDIT_POST,
        deletePostAction: groupPostsModule + DELETE_GROUP_POST
      }),
      updatePost() {
        if(!this.editPostLoading) {
          let params = {
            post_id: this.post.id,
            title: document.getElementById('change-text').value,
            place_geo_id: this.changeLocationId,
            intags: JSON.stringify(this.intagArray),
            mentions: null,
          };

          const payload = {
            params,
            onSuccess: this.onSuccessEditPost
          }

          this.editPost(payload);
        }
      },
      onSuccessEditPost() {
        this.$router.go(-1);
      },
      deletePost() {
        const payload = {
          post_id: this.post.id,
          group_id: this.post.extra.group.id,
          groupSlug: this.post.extra.group.slug,
          onSuccess: this.onSuccessDeletePost
        };

        this.deletePostAction(payload);
      },
      onSuccessDeletePost() {
        this.$router.push('/group/' + this.post.extra.group.slug);
      },
      googleAutoComplete() {
        let place = document.getElementById('place');
        let placeId = document.getElementById('placeId');

        let autocomplete = new google.maps.places.Autocomplete(place);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          placeId.value = place.place_id;
          this.changeLocation = place.formatted_address;
          this.changeLocationId = place.place_id;
          this.$modal.hide('location');
        });
      },
      deleteIntag(i) {
        this.intagArray.splice(i, 1);

      },
      addIntag() {
        let intagArr = this.intag.split(' ');
        intagArr.map((item) => {
          if (item) {
            let toAdd = this.intagArray.indexOf(item);
            if (toAdd === -1) {
              this.intagArray.push(item);
            }
          }
        });
        this.intag = '';
      },
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/post.less';
  @import '~LessStyle/editpost.less';
  @import '~LessStyle/postaddtext.less';
</style>
