<template>
  <modal
    name="repostModal"
    width="100%"
    classes=" v--modal repost-modal-create"
    height="100%">
    <div class="repost-modal">
      <h3 v-if="post" class="repost-title"><i @click="closeRepostModal" class="go-back icon-left-f"></i>
        {{$lang.variables.repostFrom}} {{post.author.nickname}}</h3>
      <template v-if="post">
        <div
          class="post-repost"
          v-if="post.attachments.posts != null">

          <in-post-image
            :post="post.attachments.posts[0].attachments"
            :order="post.attachments.posts[0].attachments_order"/>
          <div class="post-repost-icon">
            <i class="icon-share-f"></i>
            <router-link :to="'/u/' + post.attachments.posts[0].author.nickname">
              <span v-text="post.attachments.posts[0].author.nickname"></span>
            </router-link>
          </div>
        </div>
        <div
          class="post-normal"
          v-else>
          <in-post-image
            :avatar="post.is_avatar"
            :user="post.author"
            :post="post.attachments"
            :order="post.attachments_order"/>
        </div>
        {{post.title}}
        <div class="post-intags">
          <span
            v-for="intag in post.intags">
              <span>{{'^^'+intag.name}}</span>
            </span>
        </div>
        <textarea v-model="postNewTitle" :placeholder="$lang.variables.signRepost"
                  class="text-repost-teaxtarea"></textarea>
        <input @keyup.enter="addIntag()" v-model="postNewIntag" :placeholder="$lang.variables.enterInTag"
               class="repost-intag">
        <ul id="intagList">
          <li
            class="intagList-item"
            v-for="(intag, index) in postNewIntagArray"
            :key="index">
            <span v-text="'^^'+intag">  </span>
            <i
              @click="deleteIntag(index)"
              class="icon-delete-f"></i>
          </li>
        </ul>
        <button
          class="repost-button"
          @click="createRepost">{{$lang.variables.create}}
        </button>
      </template>
    </div>

  </modal>
</template>
<style>

</style>
<script>
  import {mapActions} from 'vuex';
  import {FETCH_REPOST, moduleName as repostModule,} from "Store/modules/repost";

  export default {
    data() {
      return {
        post: '',
        postNewTitle: '',
        postNewIntag: '',
        postNewIntagArray: [],
      }
    },
    mounted() {
      this.$root.$on('postModalRepost', (event) => {
        this.post = event;
        this.$modal.show('repostModal');
      });
    },
    methods: {
      ...mapActions({
        makeReposts: repostModule + FETCH_REPOST,
      }),
      closeRepostModal() {
        this.$modal.hide('repostModal');
      },
      addIntag() {
        let toAdd = this.postNewIntagArray.indexOf(this.postNewIntag);
        console.log(toAdd);
        if (toAdd == -1) {
          this.postNewIntagArray.push(this.postNewIntag);
        }
        this.postNewIntag = '';
      },
      deleteIntag(i) {
        this.postNewIntagArray.splice(i, 1);
      },
      createRepost() {
        let data = {
          id: this.post.id,
          title: this.postNewTitle,
          intags: JSON.stringify(this.postNewIntagArray),
          onSuccess: this.repostSuccess,
        };
        this.makeReposts(data);
        this.$notify({
          group: 'repost-add',
          duration: 3000,
          speed: 300,
        });
      },
      repostSuccess() {
        this.closeRepostModal();
      }
    },

  }
</script>
<style lang="less">
  @import "~LessStyle/variables";

  .repost-button {
    margin: 14px auto;
  }

  .repost-modal {
    height: 100vh;
    overflow-y: auto;
  }

  .v--modal-background-click {
    padding-bottom: 0 !important;
  }

  .repost-title {
    margin: 0 0 15px 0;
    padding: 10px;
    .bgc-grad();
    color: @white;
    text-align: center;
  }

  .repost-modal-create {
    text-align: center;
  }
</style>
