<template>
  <div class="post-add-text">
    <div class="post-text-header">
      <textarea
        class="text-header-teaxftarea"
        :value="title"
        @change="changeTitle"
        id="post-text-body"
        :placeholder="$lang.variables.signThePost"></textarea>
      <img
        v-if="imagesArray[0].type === 'img'"
        class="text-header-img"
        :src="imagesArray[0].img">
      <video
        v-else
        :src="imagesArray[0].preview_url"
        :style="{height: clientWidth * 0.2 + 'px'}">
      </video>
    </div>
    <div class="intags-input">
      <input
        class="post-intag"
        type="text"
        v-model="inputIntag"
        :placeholder="$lang.variables.enterIntag"
        @keyup.enter="addIntag()">
      <button @click="goFilters()">FILTERS</button>
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
        :value="geoLocationId"/>
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
          :key="i" v-if="image.type === 'img'">
          <img
            @click="makeMentions($event, image.imgId)"
            class='previewPhoto'
            :src="image.img"/>
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
          id="inputSearch"
          :placeholder="$lang.variables.searchUser"/>
        <div class="search-container">
          <div
            v-for="(user,i) in this.searchArray"
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
  import VModal from 'vue-js-modal'
  import VueCarousel from 'vue-carousel'

  Vue.use(VueCarousel);
  Vue.use(VModal);
  export default {
    name: 'PostAddText',
    props: ['imagesArray', 'intags', 'title', 'place', 'mentions'],
    data() {
      return {
        intagArray: [],
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
      }
    },
    mounted() {
      this.clientWidth = localStorage.getItem('clientWidth');
      this.imagesArray.map((item) => {
        if (item.type === 'img') {
          this.imageIndex = true;
        }
      });
    },
    computed: {
      geoLocation() {
        return this.place && this.place.formatted_address;
      },
      geoLocationId() {
        return this.place && this.place.place_id;
      }
    },
    methods: {
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
        this.inputIntag = '';

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
          this.$emit('update:place', place);
          console.log('emited', place);
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
        let human = document.getElementById('inputSearch').value;
        axios.get('v1/users/search?query=' + human)
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
          this.changeMention({
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
          this.addMention({
            userId: user.id,
            posXdB: this.positionXdB.toFixed(4),
            posYdB: this.positionYdB.toFixed(4),
            imgID: this.imgID,
          });
        }
      },
      deleteLocation() {
        this.emit('update:location', '');
      },
      goFilters() {
        this.$root.$emit('openFilters');
      },
      addMention(mention) {
        const mentions = [...this.mentions];
        if (mentions[mention.imgID]) {
          mentions[mention.imgID].push(mention);
        } else {
          mentions[mention.imgID] = [mention];
        }
        this.$emit('update:mentions', mentions);
      },
      changeMention(payload) {
        const mentions = [...this.mentions];
        mentions[payload.imgID][payload.replaceId].posXdB = payload.posXdB;
        mentions[payload.imgID][payload.replaceId].posYdB = payload.posYdB;
        this.$emit('update:mentions', mentions);
      },
      deleteMention(payload) {
        const mentions = [...this.mentions];
        mentions[payload.imgID].splice(payload.index, 1);
        this.$emit('update:mentions', mentions);
      },
    },

  }
</script>

<style lang="less">
  @import '~LessStyle/postaddtext.less';

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
</style>
