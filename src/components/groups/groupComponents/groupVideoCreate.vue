<template>
  <div id="createAlbum">
    <div class="modal-title">
      {{$lang.variables.createVideo}}
      <span @click="goBack" class="go-back">
        <i class="icon-left-f"></i>
      </span>
    </div>

    <input
      id="video-input"
      accept="video/*"
      @change="addVideo()"
      type="file"
      name="name"
      style="display: none;"/>


    <div
      v-if="video === null"
      class="post-add"
      @click="addVideoToArray()"
    >
      <i class="icon-videocamera"></i>
      <p class="add-filepost">{{$lang.variables.addVideo}}</p>
    </div>
    <div
      v-else
      class="post-add-image"
    >
      <div class="previewVideo">
        <video :src="video.preview_url" :style="{height:videoHeight+'px'}"></video>
        <img class="preview-video-play-button" :src="playVideoButton"/>
      </div>
    </div>

    <input class="group_input" ref="title" type="text" :placeholder="$lang.variables.description">
    <div class="button-container">
      <button
        type="button"
        class="group_album_submit"
        @click="addVideoToArray()"
        v-if="video !== null"
      >
        {{$lang.variables.add_another_video}} Choose another
      </button>
      <button
        type="button"
        class="group_album_submit"
        @click="createVideo()"
      >
        {{$lang.variables.add_video}} Add video
      </button>
    </div>



  </div>
</template>
<script>
  import axios from 'axios';
  import {mapActions, mapState} from 'vuex';
  import {FETCH_CURRENT_GROUP, moduleName as groupsModule} from "Store/modules/groups/groups";

  export default {
    data() {
      return {
        video: null,
        playVideoButton: img.PlaySmall,
      }
    },
    computed: {
      ...mapState([
        'groups'
      ])
    },
    methods: {
      ...mapActions({
        getGroupData: groupsModule + FETCH_CURRENT_GROUP
      }),
      addVideoToArray() {
        document.getElementById('video-input').click();
      },
      addVideo() {
        let file = document.getElementById('video-input').files[0];
        let video_preview = window.URL.createObjectURL(file);

        this.video = ({
          file: file,
          type: 'video',
          preview_url: video_preview,
          imgId: 1
        });
        document.getElementById('video-input').value = '';
      },

      createVideo() {
        const slug = this.$route.params.group_slug;
        this.getGroupData(slug);
        const group_id = this.groups.groups[slug].id;
        let params= {
          group_id,
          title: this.$refs.title.value,
        };

        axios.post('v1/groups/videos/add',params)
          .then(
            res=> {
              this.$router.push('/group/'+slug+'/videos')
            }
          )


      },
      goBack(){
        history.go(-1);
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/variables.less';

  #createAlbum {
    margin-top: -43px;
  }

  .group_input  {
    width:90%;
    height: 35px;
    font-size: 16px;
    background-color: hsla(0, 0%, 100%, .7);
    outline: 0;
    padding: 5px;
    border-radius: 5px;
    margin:20px;
    border: 1px solid @base_green;
    box-sizing: border-box;
    color: #b7bac0;
  }

  .group_album_submit {
    color:#5ac5c6;
    border: 1px solid #5ac5c6;
    padding: 5px 15px;
    border-radius: 3px;
    width: 40%;
    margin-top: 10px;
    background: transparent;
    font-size: 14px;
  }

  .go-back {
    position: absolute;
    left: 0px;
    top: 2px;
    font-size: 22px;
    color: #fff;
  }


  .post-add {
    margin-top: 5vh;
    i {
      &.icon-videocamera {
        font-size: 30vw;
        .text-grad();
      }
    }
  }

  .add-filepost {
    color: #5ac5c6;
    margin-top: 0;
    font-weight: 600;
    font-size: 12px;
  }

  .preview-video-play-button {
    position: absolute;
    margin: 0 auto;
    width: 20%;
    /*left: 50%;*/
    /*top: 50%;*/
  }

  .previewVideo {
    position: relative;
    background: #000;
    border-radius: 5px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button-container{
    display: flex;
    justify-content: space-around;
  }


</style>
