<template>
  <div class="post-add">
    <div class="post-add-header">
      <i v-if="(!filters && !textfields)"
         @click="goBack()"
         class="icon-left-f go-back"></i>
      <i v-if="(filters && !textfields)"
         @click="goToTextFields()"
         class="icon-left-f go-back"></i>
      <i v-if="(filters && textfields)"
         @click="goBackToCropp()"
         class="icon-left-f go-back"></i>
      <span>{{$lang.variables.addPost}}</span>
    </div>
    <div v-if="(!filters && !textfields)">
      <div v-if="!addPhotoIndex">
        <div
          class="choose-your-destiny"
          :class="{
            'top-position' : this.imagesArray.length > 0,
            'middle-position' : this.imagesArray.length === 0
          }"
        >
          <div @click="addVideoToArray()">
            <i class="icon-videocamera"></i>
            <p v-if="!imagesArray.length" class="add-filepost">{{$lang.variables.addVideo}}</p>
            <p class="add-filepost" v-else>{{$lang.variables.createMultipost}}</p>
          </div>
          <div @click="changePhotoIndex()">
            <i class="icon-picture"></i>
            <p v-if="!imagesArray.length" class="add-filepost">{{$lang.variables.addPhoto}}</p>
            <p class="add-filepost" v-else>{{$lang.variables.createMultipost}}</p>
          </div>
        </div>
      </div>

      <div
        v-if="addPhotoIndex"
        class="post-add-cropp">
        <div class="crop-container">
          <croppa
            v-model="myCroppa"
            :width="imageSize"
            :height="imageSize"
            :quality="qualityImage"
            :video-enabled=true
            :prevent-white-space="true"
            :show-remove-button="false"
            :placeholder="$lang.variables.chooseAPhoto">
          </croppa>
          <img class="icon-cropper" src="https://media.inrating.top/storage/img/default/cropp-action.svg" alt="">
        </div>
        <button
          class="action-post-button"
          @click="chooseAnotheFile()">{{$lang.variables.cancel}}
        </button>
        <button
          class="action-post-button"
          @click="addToArray()">{{$lang.variables.crop}}
        </button>
        <!--<button @click="addVideoToArray()"><i class="icon-videocamera-f"></i></button>-->
      </div>
      <input
        id="video-input"
        accept="video/*"
        @change="addVideo()"
        type="file"
        name="name"
        style="display: none;"/>
      <div
        v-if="imagesArray.length && !addPhotoIndex"
        class="post-add-image">

        <ul id="list">
          <li v-for="(image,index) in imagesArray">
            <div class="delete-item-image" @click="deleteItemFromArray(index)"><i class="icon-delete-f"></i></div>
            <img
              v-if="image.type === 'img'"
              class='previewPhotoArr'
              :src="image.img"
            />
            <div
              class="previewVideo"
              v-else>
              <video :src="image.preview_url" :style="{height:videoHeight+'px'}"></video>
              <img class="preview-video-play-button" :src="playVideoButton"/>
            </div>
          </li>

        </ul>
        <button
          class="action-post-button"
          @click="goToTextFields()">{{$lang.variables.next}} <!--goToFilter early use -->
        </button>
      </div>
    </div>
    <div v-if="(filters && !textfields)">
      <in-post-filter :imagesArray="imagesArray"/>
      <div class="action-post-block">
        <!--<button
          class="action-post-button"
          @click="goBackToCropp()">{{$lang.profile.back}}
        </button>
        <button
          class="action-post-button"
          @click="goToTextFields()">{{$lang.profile.next}}
        </button>-->
      </div>
    </div>
    <div v-if="(filters && textfields)">
      <in-post-text
        :imagesArray="imagesArray"
        :title="title"
        :intags="intags"
        :mentions="mentions"
        :place.sync="place"
        :mentions.sync="mentions"
        @updateTitle="updateTitle"
        @addIntag="addIntag"
        @deleteIntag="deleteIntag"/>
      <img
        id="lastPreview"
        src="">
      <button
        class="action-post-button"
        @click="goBackToCropp()">{{$lang.variables.back}}
      </button>
      <button
        class="action-post-button"
        @click="makePost()">{{$lang.variables.publishPost}}
      </button>
    </div>
    <div
      v-if="loading"
      class="spinner-bg">
      <img
        class="spinner-svg"
        src="https://media.inrating.top/images/Spinner.svg"/>
    </div>

  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import Vue from 'vue'
  import Croppa from 'vue-croppa'
  import ImagesFilter from './ImagesFilter.vue'
  import PostAddText from './PostAddText.vue'

  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {ADD_POST, moduleName as postsModule} from "Store/modules/posts";

  Vue.component('in-post-filter', ImagesFilter)
  Vue.component('in-post-text', PostAddText)
  Vue.use(Croppa)
  export default {
    data() {
      return {
        myCroppa: {},
        addPhotoIndex: false,
        groupSlug: '',
        albumId: '',
        loading: false,
        forCount: 0,
        imageSize: null,
        dataUrl: '',
        imagesArray: [],
        videosArraY: [],
        filters: false,
        textfields: false,
        inputArray: [],
        imageIndex: false,
        playVideoButton: img.PlaySmall,
        qualityImage: 4,
        intags: [],
        title: '',
        place: null,
        mentions: {},
        arrayPostSend: {
          title: null,
          place_geo_id: null,
          preview_id: null,
          intags: [],
          upload: {
            id: null,
            items: [],
          },
          mentions: {},
          videoHeight: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
      }),
      place_geo_id() {
        return this.place && this.place.place_id;
      }
    },
    mounted() {
      let image = localStorage.getItem('clientWidth');
      this.imageSize = parseInt(image) - 10;
      this.videoHeight = localStorage.getItem('clientWidth') * 0.18;
      this.qualityImage = Math.ceil(1080 / this.imageSize);
      this.groupSlug = this.$route.params.group_slug;
      this.albumId = this.$route.params.album_slug;
      this.$root.$on('openFilters', () => {
        this.goToFilter();
      });
    },
    methods: {
      ...mapActions({
        addPost: postsModule + ADD_POST
      }),
      updateTitle(title) {
        this.title = title;
      },
      addIntag(intag) {
        this.intags.push(intag);
      },
      deleteIntag(index) {
        this.intags.splice(index, 1)
      },
      goBack() {
        this.$router.go(-1);
      },
      deleteItemFromArray(index) {
        this.imagesArray.splice(index, 1);
      },
      chooseAnotheFile() {
        this.myCroppa.remove();
        this.addPhotoIndex = false;
      },
      changePhotoIndex() {
        this.addPhotoIndex = true;
        setTimeout(() => {
          this.myCroppa.chooseFile()
        }, 100);
      },
      uploadCroppedImage() {
        this.myCroppa.generateBlob((blob) => {
        }, 'image/jpeg');
      },
      goToFilter() {
        console.log('this.imagesArray', this.imagesArray);

        this.textfields = false;
        this.filters = true;
        this.imagesArray.map((item) => {
          if (item.type == 'img') {
            this.imageIndex = true;
          }
        });
        if (this.imagesArray.length > 0) {
          this.filters = true;
          if (!this.imageIndex) {
            this.textfields = true;
            /*
            }
            else {
              let img = document.getElementById('list').querySelector('.previewPhotoArr');
              this.eImg = img;
              this.imgID = img.alt;
              */
          }
        }
        else {
          alert('Вы не выбрали ни одного фото');
        }
      },
      goToTextFields() {
        this.textfields = true;
        this.filters = true;
      },
      addToArray(event) {
        console.log(this.myCroppa.getCanvas());
        console.log(this.myCroppa.getContext());
        console.log(this.myCroppa.getChosenFile());

        this.dataUrl = this.myCroppa.generateDataUrl();
        //let inputFile=document.querySelector('input ');
        let file = document.querySelector('input[type=file]').files[0];
        this.imageFile = file;
        //this.inputArray.push(inputFile);
        if ((this.imagesArray.length < 5) && (this.dataUrl != '')) {
          this.imagesArray.push({
            img: this.dataUrl,
            imgB: this.dataUrl,
            // mentions: [],
            type: 'img',
            imgId: this.imagesArray.length
          });
          this.myCroppa.remove();
          this.addPhotoIndex = false;
        }
        else {
          alert('none');
        }
      },
      addVideoToArray() {
        document.getElementById('video-input').click();
      },
      addVideo() {
        let file = document.getElementById('video-input').files[0];
        console.log(file);
        let video_preview = window.URL.createObjectURL(file);

        this.imagesArray.push({
          file: file,
          type: 'video',
          preview_url: video_preview,
          // mentions: [],
          imgId: this.imagesArray.length
        });
        document.getElementById('video-input').value = '';
      },
      goBackToFilters() {
        this.textfields = false;
        if (this.imagesArray.length == 1 && this.imagesArray[0].type == 'video')
          this.filters = false;
      },
      goBackToCropp() {
        this.filters = false;
        this.textfields = false;
      },
      makePost() {
        if (this.$userStatus(this.authUser)) {
          if (!this.loading) {
            this.loading = true;

            const payload = {
              albumId: this.albumId,
              groupSlug: this.groupSlug,
              imagesArray: this.imagesArray,
              intags: this.intags,
              geoId: this.place_geo_id,
              title: this.title,
              mentions: this.mentions,
              onSuccess: this.onSuccessAddPost,
              redirectOnMain: this.redirectOnMain,
              goBack: this.goBack
            };

            this.addPost(payload);
          }
        }
      },
      redirectOnMain() {
        this.$router.push('/');
      },
      onSuccessAddPost() {
        this.$notify({
          group: 'post-add',
          duration: 3000,
          speed: 300,
        });
        this.loading = false;
      }
    },
    head: {
      title() {
        return {
          inner: this.$lang.variables.addPost
        }

      },
    }

  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  #SpinnerOnloadImg {
    display: block;
    width: 35%;
    margin: auto;
  }

  .crop-container {
    position: relative;
  }

  .icon-cropper {
    position: absolute;
    width: 8vw !important;
    bottom: 4vw;
    right: 4vw;
  }

  .post-add {
    margin-top: -43px;
    &-header {
      position: relative;
      padding: 10px 0;
      background: linear-gradient(to left top, #000fbc, #30c2be 50%);
      font-weight: 600;
      color: #fff;
    }
    i {
      &.icon-picture {
        font-size: 30vw;
        .text-grad();
      }
      &.icon-videocamera {
        font-size: 30vw;
        .text-grad();
      }
    }
  }

  .post-add-image {
    padding: 10px 0;
    border-top: 1px solid #d3d3d3;
  }

  .go-back {
    top: 8px;
    color: #fff;
  }

  .choose-your-destiny {
    display: flex;
    width: 70%;
    margin: auto;
    justify-content: space-between;
  }

  .previewPhotoArr {
    width: 90%;
    margin: auto;
    height: auto;
  }

  #list {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button {
    border: 1px solid #5ac5c6;
    background-color: white;
    color: #5ac5c6;
    padding: 10px 10px;
    border-radius: 4px;
  }

  .post-add-cropp {
    display: block;
  }

  #list > li {
    width: 18%;
    margin: 0 1%;
    position: relative;
    display: inline-block;
    border-radius: @border-radius;
  }

  .previewPhotoArr {
    width: 100%;
    height: auto;
    border-radius: 3px;
    display: block;
  }

  .croppa-container {
    margin-top: 30px;
    margin-bottom: 14px;
  }

  .croppa-container canvas {
    border: 1px solid #d3d3d3;
    border-radius: 5px;
  }

  .previewVideo {
    background: #000;
    border-radius: 5px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .previewVideo img {
    width: 60%;
  }

  .post-add-cropp > button > i {
    font-size: 23px;
  }

  .action-post-button {
    width: 46%;
    margin: 10px 1%;
    text-align: center;
    color: #5ac5c6;
  }

  .add-filepost {
    color: #5ac5c6;
    margin-top: 20px;
    font-weight: 600;
    font-size: 12px;
  }

  .middle-position {
    margin-top: 35vh;
  }

  .top-position {
    padding-top: 80px;
    padding-bottom: 80px;
  }

  .choose-your-destiny img {
    width: 120px;
    height: 100px;
  }

  .previewVideo {
    position: relative;
  }

  .preview-video-play-button {
    position: absolute;
    width: 30%;
    left: 22%;
    top: 20%;
  }

  .delete-item-image {
    position: absolute;
    right: 0px;
    color: white;
    text-shadow: 1px 1px 2px black, 0 0 1em black;
  }

  .action-post-block {
    width: 85%;
    margin: auto;
  }

</style>
