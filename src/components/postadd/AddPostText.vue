<template>
  <div class="add-post-text">
    <textarea
      class="add-post-text-title"
      :value="title"
      @change="changeTitle"
      id="post-text-body"
      :placeholder="$lang.variables.signThePost"></textarea>
    <div class="autocompleted-field">
      <input
        class="autocompleted-field__input add-post-text-intag-input"
        :class="intagInputFocused && 'autocompleted-field_active__input'"
        type="text"
        :value="inputIntag"
        @input="intagInputInputHandler($event.target.value)"
        :placeholder="$lang.variables.enterIntag"
        @focus="intagInputFocused = true"
        @blur="intagInputFocused = false"
        ref="intagInput"
        @keyup.enter="addIntag()">
      <ul class="autocompleted-field__list" :class="intagInputFocused && 'autocompleted-field_active__list'" v-show="intagInputFocused">
        <li v-for="intag in intagsHistory"
            class="autocompleted-field__list-item"
            :key="intag"
            @click="intagClickHandler(intag)">{{intag}}</li>
      </ul>
    </div>
    <ul id="intagList">
      <li
        class="intagList-item"
        v-for="(item, index) in intags"
        :key="item">
        <span v-text="'^^' + item"></span>
        <i
          @click="deleteIntag(index)"
          class="icon-delete-f"></i>
      </li>
    </ul>
    <div class="post-location">
      <div
        @click="showLocation()"
        class="post-location-search">
        <span>{{$lang.variables.location}}</span>
        <i class="icon-right-f"></i>
      </div>
      <div
        v-if="geoLocation"
        class="post-location-value">
        <i class="icon-location-f"></i>
        <div v-text="geoLocation"></div>
        <i
          class="icon-delete-f"
          @click="deleteLocation()"></i>
      </div>
    </div>
    <div v-if="imageIndex"
         @click="showMentions()"
         class="post-mentions">
      <span>{{$lang.variables.tagsOfPeople}}</span>
      <i class="icon-right-f"></i>
    </div>

    <div
      class="post-visibility"
      v-if="!isGroupPost && !isGroupAlbumPost"
      @click="changePostVisibility">
      <div
        class="post-visibility-checkbox"
        :class="{active: isCheck}">
        <i v-if="isCheck" class="icon-check-f"></i>
      </div>
      <div class="post-visibility-message">{{$lang.variables.onlyForSubscribers}}</div>
    </div>


    <div
      class="post-visibility"
      v-if="shouldShowOnBehalfOfTheGroupCheckboxField"
      @click="changeIsOnBehalfOfTheGroup">
      <div
        class="post-visibility-checkbox"
        :class="{active: isOnBehalfOfTheGroup}">
        <i v-if="isOnBehalfOfTheGroup" class="icon-check-f"></i>
      </div>
      <div class="post-visibility-message">{{$lang.variables.onBehalfOfTheGroup}}</div>
    </div>

    <modal
      name="location"
      width="100%"
      classes=" v--modal"
      height="100%">
      <h3 class="modal-title modal-title-search">
        <i
          @click="hideLocation()"
          class="modal-goback icon-left-f"></i>
        {{$lang.variables.location}}
      </h3>
      <input
        type="text"
        class="modal-location"
        @click="googleAutoComplete()"
        :placeholder="$lang.variables.enterYourLocation"
        value=""
        id="place"
        name="place"/>
      <input
        type="hidden"
        name="placeId"
        id="placeId"
        value=""/>
    </modal>
    <modal
      name="mentions"
      width="100%"
      classes=" v--modal"
      height="100%">
      <h3 class="modal-title modal-title-search">
        <i
          @click="hideMentions()"
          class="modal-goback icon-left-f"></i>
        {{$lang.variables.tagsOfPeople}}
      </h3>
      <carousel :perPage=1>
        <slide
          v-for="(image, i) in imagesArray"
          :key="i"
          v-if="image.type === 'image'">
          <div
            v-if="image.type === 'image'"
            @click="makeMentions($event, i)"
            class="preview-photo"
            :style="{backgroundImage: `url(${image.cropped ? image.cropped : image.file})`}"></div>
          <div
            v-for="(user, index) in mentionsArray"
            :key="index">
            <div
              class="mentionBlock"
              :style="{top: user.posY - 20 + 'px', left: (user.posX + clientWidth * user.imgID) + 'px'}">
              <p v-text="user.userNickname"></p>
              <i
                class="icon-delete-f"
                @click="deleteFromMention(user, index)"></i>
            </div>
          </div>
        </slide>
      </carousel>
      <modal
        name="searchPeople"
        width="100%"
        classes=" v--modal"
        @before-open="beforeOpen"
        height="100%">
        <h3 class="modal-title modal-title-search">
          <i
            @click="hideSearch()"
            class="modal-goback icon-left-f"></i>
          {{$lang.variables.searchUser}}
        </h3>
        <input
          type="text"
          class="modal-location"
          @keyup="searchPeople()"
          v-model="inputSearch"
          :placeholder="$lang.variables.searchUser"/>
        <div class="search-container">
          <div
            v-for="(user,i) in searchArray"
            :key="i">
            <div
              class="search-item"
              @click="addUserToMentions(user)">
              <div class="item-avatar ">
                <img :src="user.avatar_image.url_medium">
              </div>
              <div class="subscribers-item-info">
                <p
                  class="user-subscribers-nickname"
                  v-text="user.nickname"></p>
                <p class="user-subscribers-name">
                  <span v-text="user.name"></span>
                  <span v-text="user.lastname"></span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </modal>
    </modal>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import VueCarousel from 'vue-carousel'
  import GroupAccess from 'utils/GroupAccess';

  Vue.use(VueCarousel);
  export default {
    name: 'AddPostText',
    props: [
      'imagesArray', 'intags', 'title', 'mentions',
      'intagsHistory', 'isCheck', 'isOnBehalfOfTheGroup',
      'isGroupPost', 'isGroupAlbumPost',
      'currentUserGroupRole', 'currentUserNickname',
    ],
    data() {
      return {
        intagArray: [],
        geoLocation: '',
        searchArray: [],
        mentionsArray: [],
        inputIntag: '',
        positionX: '',
        positionY: '',
        positionXdB: '',
        positionYdB: '',
        clientWidth: '',
        imageIndex: false,
        userId: '',
        imgID: '',
        videoHeight: '',
        intagInputFocused: false,
        inputSearch: ''
      }
    },
    mounted() {
      this.clientWidth = localStorage.getItem('clientWidth');
      this.imagesArray.map((item) => {
        if (item.type === 'image') {
          this.imageIndex = true;
        }
      });
    },
    methods: {
      beforeOpen() {
        this.searchPeople();
      },
      changeTitle(event) {
        this.$emit('updateTitle', event.target.value);
      },
      addIntag() {
        let intag = this.inputIntag.replace(/[\^]/gi, '');

        let intagArr = intag.split(' ');
        intagArr.map((item) => {
          if (item) {
            let toAdd = this.intags.indexOf(item);
            if (toAdd === -1) {
              this.$emit('addIntag', item);
            }
          }
        });
        this.intagInputInputHandler('');

      },
      deleteIntag(i) {
        this.$emit('deleteIntag', i);
      },
      showLocation() {
        this.$modal.show('location');
      },
      showMentions() {
        this.$modal.show('mentions');
      },
      hideLocation() {
        this.$modal.hide('location');
      },
      hideMentions() {
        this.$modal.hide('mentions');
      },
      googleAutoComplete() {
        let place = document.getElementById('place');
        let placeId = document.getElementById('placeId');

        let autocomplete = new google.maps.places.Autocomplete(place);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          placeId.value = place.place_id;
          this.$emit('addLocation', place.place_id);
          this.geoLocation = place.formatted_address;
          this.$modal.hide('location');
        });
      },
      makeMentions(e, i) {
        this.positionX = e.offsetX;
        this.positionY = e.offsetY;
        this.positionXdB = this.positionX / this.clientWidth;
        this.positionYdB = this.positionY / this.clientWidth;
        this.imgID = i;
        this.$modal.show('searchPeople');
      },
      hideSearch() {
        this.$modal.hide('searchPeople');
      },
      searchPeople() {
        axios.get('v1/users/search?query=' + this.inputSearch)
          .then(res => {
            this.searchArray = res.data.data;
          })
      },
      deleteFromMention(user, index) {
        let mentions = this.mentions[user.imgID];
        for (let i = 0; i < mentions.length; i++) {
          if (mentions[i].userId === this.mentionsArray[index].userId) {
            this.$emit('deleteMention', {
              index: i,
              imgID: user.imgID
            });
            break;
          }
        }
        this.mentionsArray.splice(index, 1);
      },
      addUserToMentions(user) {
        let replaceUser = false;
        let replaceId;
        this.$modal.hide('searchPeople');

        let mentions = this.mentions[this.imgID];
        if (mentions) {
          for (let i = 0; i < mentions.length; i++) {
            if (mentions[i].userId === user.id) {
              replaceUser = true;
              replaceId = i;
            }
          }
        }

        if (replaceUser) {
          this.$emit('changeMention', {
            replaceId,
            posXdB: this.positionXdB.toFixed(4),
            posYdB: this.positionYdB.toFixed(4),
            imgID: this.imgID,
          });
          let replace;
          for (let i = 0; i < this.mentionsArray.length; i++) {
            if ((this.mentionsArray[i].userId === user.id) && (this.mentionsArray[i].imgID === this.imgID)) {
              replace = i;
            }
          }

          this.mentionsArray[replace].posX = this.positionX;
          this.mentionsArray[replace].posY = this.positionY;
          this.mentionsArray[replace].posXdB = this.positionXdB;
          this.mentionsArray[replace].posYdB = this.positionYdB;
        } else {
          this.mentionsArray.push({
            userNickname: user.nickname,
            userId: user.id,
            posX: this.positionX,
            posY: this.positionY,
            posXdB: this.positionXdB,
            posYdB: this.positionYdB,
            imgID: this.imgID,
          });
          this.$emit('addMention', {
            userId: user.id,
            posXdB: this.positionXdB.toFixed(4),
            posYdB: this.positionYdB.toFixed(4),
            imgID: this.imgID,
          });
        }
      },
      deleteLocation() {
        this.geoLocation = '';
      },
      goFilters() {
        this.$root.$emit('openFilters');
      },
      intagClickHandler(intag) {
        this.$refs.intagInput.focus();
        this.intagInputInputHandler(intag);
      },
      intagInputInputHandler(value) {
        this.inputIntag = value;
        this.$emit('intag-type', value)
      },
      changePostVisibility() {
        this.$emit('changePostVisibility');
      },
      changeIsOnBehalfOfTheGroup() {
        this.$emit('changeIsOnBehalfOfTheGroup');
      },
    },
    computed: {
      shouldShowOnBehalfOfTheGroupCheckboxField() {
        console.log(this.currentUserGroupRole, this.currentUserNickname, GroupAccess.canIDo(this.currentUserGroupRole, this.currentUserNickname,
          null, null, 'make-posts-on-behalf-of-the-group'));
        return this.isGroupPost && GroupAccess.canIDo(this.currentUserGroupRole, this.currentUserNickname,
          null, null, 'make-posts-on-behalf-of-the-group');
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';
  @import '~LessStyle/postaddtext.less';

  .post-visibility {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px;

    &-checkbox {
      border: 2px solid #727272;
      border-radius: 3px;
      width: 14px;
      height: 14px;
      font-size: 14px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      padding: 1px;
      transition: 0.2s ease-out;

      &.active {
        border: 2px solid #229acd;
        background: #229acd;
      }

      .icon-check-f {
        color: #fff;
      }
    }
  }

  .preview-photo {
    height: 100vw;
    width: 100vw;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    /*border-radius: 3px;*/
    background-position: left center;
    background-size: cover;
  }

  .add-post-text-title {
    width: 98%;
    height: 50px;
    border-radius: 3px;
    margin: 10px 0 5px 0;
    box-sizing: border-box;
    border: 1px solid @contest-list-text-color;
  }

  .add-post-text-intag-input {
    width: 98%;
    border-radius: 3px;
    margin-bottom: 5px;
    padding: 6px;
    box-sizing: border-box;
    border: 1px solid @contest-list-text-color;
  }
  ////
  .item-avatar {
    margin: 0px 10px;

  }

  .modal-title-search {
    color: #fff !important;
  }

  .text-header-teaxftarea {
    width: 75%;
    font-size: 20px;
    border-radius: 5px;
    border: 1px solid #0cb4be;
  }

  .user-nickname {
    font-weight: 600;
  }

  .item-avatar img {
    width: 60px;
    height: auto;
    border-radius: 10px;
    display: block;
  }

  .post-add-text {
    margin-bottom: 20px;
  }

  .autocompleted-field {
    position: relative;
    display: block;
  }

  .autocompleted-field__input {
    display: inline-block;
  }

  .autocompleted-field_active__input {
    border-bottom: 1px solid lightgray;
    border-radius: 3px 3px 0 0;
  }

  .autocompleted-field__list {
    position: absolute;
    background: white;
    display: none;
    flex-flow: column nowrap;
    width: 98%;
    top: ~"calc(100% - 5px)";
    left: 1%;
    margin: 0;
    box-shadow: 2px 2px 10px rgba(50, 50, 50, 0.25);
  }

  .autocompleted-field_active__list {
    display: flex;
    border-radius: 0 0 5px 5px;
    border: 1px solid #0cb4be;
    border-top: 0;
    box-sizing: border-box;
    transition: 0.5s;
  }

  .autocompleted-field__list-item {
    text-align: left;
    padding: 0.25em 0.25em;
    margin: 0;
    display: block;
  }
  .autocompleted-field__list-item:hover {
    background-color: rgb(235, 235, 235);
  }
</style>
