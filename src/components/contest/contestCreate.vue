<template>
  <div class="contestCreate">
    <div class="modal-title">
      <div @click="goBack" class="go-back"><i class="icon-left-f"></i></div>
      {{$lang.variables.createContest}}
    </div>
    <div class="contestCreate-body">
      <p class="contestCreate-title">{{$lang.variables.name}}</p>
      <input v-model="contestName" class="contestCreate-input"/>
      <p class="contestCreate-title">{{$lang.variables.desc}}</p>
      <textarea v-model="contestDesc" class="contestCreate-input"></textarea>
      <p class="contestCreate-title">{{$lang.variables.date}}</p>
        <div class="contestCreate-date">
          <span>{{$lang.variables.for}}</span><input class="contestCreate-input" v-model="contestDateStart" type="date"/><span>{{$lang.variables.until}}</span><input class="contestCreate-input"  v-model="contestDateEnd" type="date"/>
        </div>
      <p class="contestCreate-title">{{$lang.variables.uploadAvatar}}</p>
      <button v-if="!showCropp && !choosenPhoto" @click="openCroppa">{{$lang.variables.uploadAvatar}}</button>
      <template v-if="showCropp">
        <div class="crop-container">
          <croppa
            v-model="myCroppa"
            :width=imageSize
            :height=imageSize
            :quality="qualityImage"
            :prevent-white-space="true"
            :show-remove-button="false"
            placeholder-color="#fff"
            :placeholder-font-size="20"
            :placeholder="$lang.variables.avatar"
          >
          </croppa>
          <img class="icon-cropper" src="https://media.inrating.top/storage/img/default/cropp-action.svg" alt="">
        </div>
        <label class="avatar-title">{{$lang.variables.chooseAvatar}}</label>
        <button
          class="log-button"
          type="button"
          @click="removeFromCropp">{{$lang.variables.delete}}
        </button>
        <button
          class="log-button"
          type="button"
          @click="addToCropp">{{$lang.variables.apply}}
        </button>
      </template>
      <img v-show="!showCropp"
           class='previewPhoto'
           @click="newAvatar()"
           :src="image"/>
      <p class="contestCreate-title">{{$lang.variables.canVote}}</p>
      <div class="contestCreate-action" @click="usersVote='1'">
        <in-contestdot :vote="usersVote" string="1"></in-contestdot>
        {{$lang.variables.canVoteAll}}
      </div>
      <div class="contestCreate-action" @click="usersVote='2'">
        <in-contestdot :vote="usersVote" string="2"></in-contestdot>
        {{$lang.variables.canVoteSome}}
      </div>
      <p class="contestCreate-title">{{$lang.variables.canParticipateContest}}</p>
      <div class="contestCreate-action" @click="usersAll='1'">
        <in-contestdot :vote="usersAll" string="1"></in-contestdot>
        {{$lang.variables.usersAll}}
      </div>
      <div class="contestCreate-action" @click="usersAll='2'">
        <in-contestdot :vote="usersAll" string="2"></in-contestdot>
        {{$lang.variables.usersModeration}}
      </div>
      <div class="contestCreate-action" @click="usersAll='3'">
        <in-contestdot :vote="usersAll" string="3"></in-contestdot>
        {{$lang.variables.usersSome}}
      </div>
      <p class="contestCreate-title">{{$lang.variables.contestRules}}</p>
      <div class="contestCreate-action" @click="contestRules='1'">
        <in-contestdot :vote="contestRules" string="1"></in-contestdot>
        {{$lang.variables.rating}}
      </div>
      <div class="contestCreate-action" @click="contestRules='2'">
        <in-contestdot :vote="contestRules" string="2"></in-contestdot>
        {{$lang.variables.coins}}
      </div>
      <div class="contestCreate-action" @click="contestRules='3'">
        <in-contestdot :vote="contestRules" string="3"></in-contestdot>
        {{$lang.variables.likes}}
      </div>
      <div class="contestCreate-action" @click="contestRules='4'">
        <in-contestdot :vote="contestRules" string="4"></in-contestdot>
        {{$lang.variables.ratingLikes}}
      </div>
      <div class="contestCreate-action" @click="contestRules='5'">
        <in-contestdot :vote="contestRules" string="5"></in-contestdot>
        {{$lang.variables.likesCoins}}
      </div>
      <div class="contestCreate-action" @click="contestRules='6'">
        <in-contestdot :vote="contestRules" string="6"></in-contestdot>
        {{$lang.variables.likeRating}}
      </div>
      <div class="contestCreate-action" @click="contestRules='7'">
        <in-contestdot :vote="contestRules" string="7"></in-contestdot>
        {{$lang.variables.likeRatingCoin}}
      </div>
      <p class="contestCreate-title"> {{$lang.variables.extraField}}</p>
      <input v-model="contestExtraField" class="contestCreate-input"/>
      <h3> {{$lang.variables.organizationInfo}}</h3>
      <p class="contestCreate-title">{{$lang.variables.organizationName}}</p>
      <input v-model="contestOrganiserName" class="contestCreate-input"/>
      <p class="contestCreate-title">Email</p>
      <input v-model="contestOrganiserEmail" class="contestCreate-input"/>
      <p class="contestCreate-title">{{$lang.variables.phone}}</p>
      <input v-model="contestOrganiserPhone" class="contestCreate-input"/>
      <p class="contestCreate-title">{{$lang.variables.comments}}</p>
      <textarea v-model="contestOrganiserComments" class="contestCreate-input"></textarea>
      <button @click="createContest"
        class="log-button"
        type="button"
        >{{$lang.variables.goToNext}}
      </button>
    </div>
    <contest-created-modal />
  </div>
</template>
<script>
  import axios from 'axios';

  import Vue from 'vue'
  import contestDot from 'ComponentsVue/contest/contestCreateDots'
  import imageHelper from 'JsLib/imageHelper'
  import contestCreatedModal from 'ComponentsVue/contest/contestCreatedModal'

  Vue.component('in-contestdot',contestDot);
  export default  {
    components: {
      contestCreatedModal
    },
    data() {
      return {
        myCroppa: {},
        usersVote:'1',
        usersAll:'1',
        contestRules:'1',
        showCropp:false,
        imageSize:localStorage.getItem('clientWidth')-40,
        contestName:'',
        contestDesc:'',
        contestDateStart:'',
        contestDateEnd:'',
        contestExtraField:'',
        contestOrganiserName:'',
        contestOrganiserEmail:'',
        contestOrganiserPhone:'',
        contestOrganiserComments:'',
        dataUrl:'',
        fileUpload:'',
        uploadFile:'',
        qualityImage: 4,
        image: '',
        choosenPhoto: false
      }
    },
    mounted() {
      let image = localStorage.getItem('clientWidth');
      this.imageSize = parseInt(image) - 40;
      this.qualityImage = Math.ceil(1080 / this.imageSize);
    },
    methods: {
      newAvatar() {
        if (this.validated !== 1) {
          this.showCropp=true;
          this.image = '';
          setTimeout(() => {
            this.myCroppa.chooseFile()
          }, 100);
        }
      },
      removeFromCropp() {
        this.myCroppa.remove();
      },
      openCroppa() {
        this.showCropp = true;
        setTimeout(() => {
          this.myCroppa.chooseFile()
        }, 100);
      },
      addToCropp() {
        this.dataUrl = this.myCroppa.generateDataUrl();
        if (this.dataUrl !== '') {
          this.image = this.dataUrl;
          this.fileUpload = imageHelper.formatPhoto(this.dataUrl);
          axios.post('v1/uploads/create?type=user-post')
            .then(res => {
              let dataPost = new FormData();
              let upload_id = res.data.upload_id;
              dataPost.append('upload_id', upload_id);
              dataPost.append('file', this.fileUpload);
              axios.post('v1/uploads/load', dataPost)
                .then(res => {
                  let newFile = {
                    'id': res.data.upload_id,
                    'items': [res.data.file_id]
                  };
                  this.choosenPhoto = true;
                  this.showCropp = false;
                  this.uploadFile = JSON.stringify(newFile);
                });

            });
        }
      },
      createContest() {
        let data=new FormData();
        data.append('name',this.contestName);
        data.append('description',this.contestDesc);
        data.append('start_date',this.contestDateStart);
        data.append('end_date',this.contestDateEnd);
        data.append('app_submission_start_date',this.contestDateStart);
        data.append('app_submission_end_date',this.contestDateEnd);
        data.append('type',parseInt(this.contestRules));
        data.append('extra_field', this.contestExtraField);
        data.append('organiser',this.contestOrganiserName);
        data.append('organiser_email',this.contestOrganiserEmail);
        data.append('organiser_phone',this.contestOrganiserPhone);
        data.append('organiser_comment',this.contestOrganiserComments);
        data.append('upload',this.uploadFile);
        data.append('who_vote',this.usersVote);
        data.append('who_join',this.usersAll);
        axios.post('v1/contests/create',data)
          .then(
            res=>{
              this.$modal.show('contestCreatedModal');
            })
          .catch(e => {
            this.$notify({
              group: 'action-error',
              duration: 3000,
              speed: 300,
            });
          })
      },
      goBack() {
        history.go(-1);
      }
    }

  }
</script>
<style lang="less">
  @import '~LessStyle/variables.less';
  .contestCreate{
    margin-top: -43px;

    .croppa-container {
      position: relative;
      canvas {
        margin: auto;
      }
    }
    .icon-cropper {
      position: absolute;
      bottom: 10px;
      right: 30px;
      width: 50px;
    }
    &-title{
      text-align: left;
      color: @grey_grey;
    }
    &-body {
      padding: 0px 20px;
      .contestCreate-action{
        display: flex;
        align-items: center;
        margin: 5px 0px;
        text-align: left;
      }
    }
    &-date {
      display: flex;
      align-items: center;
    }
    &-input {
      width: 95%;
      border: 1px solid @grey_grey;
      padding: 8px ;
      font-size: 16px;
      box-sizing: border-box;
      border-radius: 5px;
      margin: 0px 10px;
    }
  }
  .modal-title i {
    position: absolute;
    left: 2px;
    top: 1px;
    color: #fff;
    font-size: 22px;
  }

</style>
