<template>
  <div id="groupCreate">
    <div class="modal-title">
      <i @click="goBack" class="icon-left-f go-back"></i>
      {{$lang.variables.create}}
    </div>
    <div class="group-create--header">
      <div :class="makeEvent" @click="changeType('event')">
        {{$lang.variables.event_accusativeCase || $lang.variables.event}}
      </div>
      <div :class="makeGroup" @click="changeType('group')">
        {{$lang.variables.group_accusativeCase || $lang.variables.group}}
      </div>
      <div :class="makeCommunity" @click="changeType('community')">
        {{$lang.variables.community_accusativeCase || $lang.variables.community}}
      </div>
    </div>
    <template v-if="typeOfCreate==='group'">
      <div class="group-previewimg">
        <div @click="groupBannerOpen" class="group-previewimg-banner">
          <img :src="dataUrlBanner">
          <div class="group-banner-slogan" v-if="!indexBanner">
            {{$lang.variables.selectABanner}} <br> (760 X 315)
          </div>
          <div class="banner-settings left-settings">
            <div class="banner-settings--item group-count"><i class="icon-guy-2-f"></i> <span>0</span></div>
            <div class="banner-settings--item  group-type"><i class="icon-lock_open"></i>
              <span><span>{{$lang.variables.group}}</span></span>
            </div>
          </div>
          <div class="banner-settings right-settings">
            <div class="banner-settings--item group-location"><span>{{$lang.variables.location}}</span><i
              class="icon-location-f"></i></div>
            <div class="banner-settings--item group-desc"><span> {{$lang.variables.description}}</span> <i
              class="icon-information"></i></div>
          </div>
        </div>
        <div @click="groupLogoOpen" class="group-previewimg-banner-logo">
          <div class="group-logo-slogan" v-if="!indexLogo">
            {{$lang.variables.uploadGroupAvatar}}<br>
            (300 X 300)
          </div>
          <img :src="dataUrlLogo">
        </div>
      </div>
      <div class="group-info-subbunner subbunner-name">
        <div class="group-info-subbunner--title-and-subject">
          <div class="group-info-subbunner--title">
            {{$lang.variables.groupNameMaximumCharacters}}
          </div>
          <div class="group-info-subbunner--subject">
            {{$lang.variables.subject}}
          </div>
        </div>
        <div class="group-info-subbunner--buttons">
          <i class=" icon-plus-guy-f"></i>
          <i class="icon-plus-f"></i>
        </div>
      </div>
    </template>
    <template v-else-if="typeOfCreate==='community'">
      <div class="community-previewimg">
        <div @click="groupBannerOpen" class="community-previewimg-banner">
          <img :src="dataUrlBanner">
          <div class="group-banner-slogan" v-if="!indexBanner">
            {{$lang.variables.selectABanner}} <br> (760 X 315)
          </div>
          <div class="community-info">
            <div class="community-info--item">
              <div><i class="icon-guy-2-f"></i> <span>0</span></div>
              <div><i class="icon-location-f"></i><span>{{$lang.variables.location}}</span></div>
            </div>
            <div class="community-info--item">
              <div><i class="icon-information"></i><span> {{$lang.variables.description}}</span></div>
            </div>
          </div>
        </div>
        <div @click="groupLogoOpen" class="community-previewimg-banner-logo">
          <div class="group-logo-slogan" v-if="!indexLogo">
            {{$lang.variables.uploadGroupAvatar}} <br> (300 X 300)
          </div>
          <img :src="dataUrlLogo">
        </div>
      </div>
      <div class="community-info-subbuner">
        <div>
          {{$lang.variables.nameContest}}<br>
          {{$lang.variables.subject}}
        </div>
        <div>
          <i class=" icon-plus-guy-f"></i>
        </div>
      </div>
    </template>
    <template v-else-if="typeOfCreate==='event'">
      <div class="event-previewimg">
        <div @click="groupBannerOpen" class="event-previewimg-banner">
          <img :src="dataUrlBanner">
          <div class="event-banner-slogan" v-if="!indexBanner">
            {{$lang.variables.selectABanner}} <br> (760 X 315)
          </div>
        </div>
        <div class="event-info">
          <div class="event-info--item">
            {{$lang.variables.nameContest}}<br>
            {{$lang.variables.subject}}
          </div>
          <div class="event-info--item event-sub">
            <i class=" icon-plus-guy-f"></i>
          </div>
          <div class="event-info--item event-time">
            <span><i class="icon-location-f"></i><span>{{$lang.variables.location}}</span></span><br>
            <span><i class="icon-clock"></i><span>{{$lang.variables.today}}</span></span><br>
            <span><i class="icon-clock"></i><span>{{$lang.variables.today}}</span></span>
          </div>
        </div>
        <button v-if="!indexLogo" @click="groupLogoOpen" class="action-post-button">
          {{$lang.variables.addAvatar}}
        </button>
        <img class="event-preview-logo" v-if="indexLogo" :src="dataUrlLogo">
      </div>
    </template>
    <div class="group-createfields">
      <div class=" group-name">
        <p class="group-create-title">{{nameFieldCaption}}</p>
        <input class="group-input--item" type="text" :placeholder="$lang.variables.Title" v-model="groupName">
      </div>
      <p class="group-create-title">{{$lang.variables.subject}}</p>
      <div class=" group-subj">
        <template v-for="subject in groupSubjects">
          <div v-if="subject.id !== 0" class="status-item" @click="groupTheme = subject.id">
              <span>
                 <in-contestdot :vote="groupTheme" :string="subject.id"></in-contestdot>
                  <p>{{subject.name}}</p>
              </span>
          </div>
        </template>
      </div>
      <div class="group-location">
        <p class="group-create-title">{{$lang.variables.location}}</p>
        <input type="text" class="modal-location group-input--item" v-on:click="googleAutoComplete()"
               v-model="groupLocation"
               :placeholder="$lang.variables.location"
               id="place"
               name="place"/>
        <input type="hidden" name="placeId" v-model="groupLocationId" id="placeId" value=""/>
      </div>

      <div class=" group-descr">
        <p class="group-create-title">{{$lang.variables.description}}</p>
        <textarea class="group-input--item" type="text" :placeholder="$lang.variables.description" v-model="groupDesc"
                  id="group-desc"></textarea>
      </div>
      <div class="group-lifetime" v-if="this.typeOfCreate=='event'">
        <p class="group-lifetime__field">от <input v-model="startDate" type="date"> <input v-model="startTime" type="time"></p>
        <p class="group-lifetime__field">до <input v-model="endDate" type="date"> <input v-model="endTime" type="time"></p>
      </div>
      <div class="group-status" v-if="this.typeOfCreate!='community'">
        <p class="group-create-title">{{$lang.variables.typeOfGroup}}</p>
        <div class="status-item" @click="accessibility = 'open'">
              <span>
                 <in-contestdot :vote="accessibility" string="open"></in-contestdot>
                  <i class="icon-lock_open"></i>
                  <p>{{$lang.variables.publicGroup}}</p>
              </span>
        </div>
        <div class="status-item" @click="accessibility = 'closed'">
              <span>
                 <in-contestdot :vote="accessibility" string="closed"></in-contestdot>
                  <i class="icon-lock_close"></i>
                  <p> {{$lang.variables.privateGroup}}</p>
              </span>
        </div>
        <div class="status-item" @click="accessibility = 'fee'">
              <span>
                 <in-contestdot :vote="accessibility" string="fee"></in-contestdot>
                  <i class="icon-lock_close"></i>
                  <p> {{$lang.variables.privateGroup}} {{$lang.variables.closedPaidEntrance}}</p>
              </span>
        </div>
      </div>

      <div class=" group-web">
        <p class="group-create-title">{{$lang.variables.siteOptional}}</p>
        <input class="group-input--item" type="text" :placeholder="$lang.variables.siteOptional" v-model="groupWeb"
               id="group-web"/>
      </div>

      <div class=" group-phone">
        <p class="group-create-title">{{$lang.variables.phoneOptional}}</p>
        <input class="group-input--item" type="text" :placeholder="$lang.variables.phoneOptional" v-model="groupPhone"
               id="group-phone"/>
      </div>
    </div>
    <div v-if="accessibility === 'fee'" class="group-fee">
      <p class="group-create-title">{{$lang.variables.amountOfIncoinForEntry}}</p>
      <input class="group-input--item" type="number" min="1" max="10000" v-model="fee"
             :placeholder="$lang.variables.amountOfIncoinForEntry">
    </div>
    <button class="log-button" @click="createGroup()"> {{$lang.variables.create}}</button>
    <modal name="groupBanner"
           width="100%"
           classes=" v--modal"
           :scrollable="true"
           height="100%">
      <div class="modal-title">
        <i @click="closeBanner" class="icon-left-f go-back"></i>
        {{$lang.variables.selectABanner}} ( 760 X 315 )
      </div>
      <croppa
        v-model="myCroppa"
        :width=imageWidth
        :height=imageHeigth
        :quality="qualityImage"
        :prevent-white-space="true"
        :show-remove-button="false"
        :placeholder-font-size="20"
        :placeholder="$lang.variables.selectABanner"
        placeholder-color="#000">
      </croppa>
      <button
        class="log-button"
        type="button"
        @click="myCroppa.remove()">{{$lang.variables.cancel}}
      </button>
      <button
        class="log-button"
        type="button"
        @click="addToCropp()">{{$lang.variables.crop}}
      </button>
    </modal>
    <modal name="groupLogo"
           width="100%"
           classes=" v--modal "
           :scrollable="true"
           height="100%">
      <div class="modal-title">
        <i @click="closeLogo" class="icon-left-f go-back"></i>
        {{$lang.variables.selectAvatar}}
      </div>

      <croppa
        v-model="myCroppaLogo"
        :width=300
        :height=300
        :quality=1
        :placeholder="$lang.variables.selectAvatar+ '(300 X 300)'"
        :placeholder-font-size="20"
        :disabled="false"
        :prevent-white-space="true"
        :show-remove-button="false"
        placeholder-color="#000">
      </croppa>
      <div class="logo-buttons-cropp">
        <button
          class="log-button"
          type="button"
          @click="myCroppaLogo.remove()">{{$lang.variables.cancel}}
        </button>
        <button
          class="log-button"
          type="button"
          @click="addToCroppLogo()">{{$lang.variables.crop}}
        </button>
      </div>
    </modal>
    <template v-if="loading">
      <in-spinner-load></in-spinner-load>
    </template>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import contestDot from 'ComponentsVue/contest/contestCreateDots'
  import imageHelper from 'JsLib/imageHelper'
  import spinnerLoad from 'ComponentsVue/other/SpinnerLoad'
  import {mapActions, mapGetters, mapState} from 'vuex';
  import {CREATE_GROUP, moduleName as groupsModule} from "Store/modules/groups/groups";
  import {FETCH_GROUP_SUBJECTS, GROUP_SUBJECTS, moduleName as groupsAllModule,} from "Store/modules/groups/groupsAll";

  Vue.component('in-contestdot', contestDot);
  Vue.component('in-spinner-load', spinnerLoad);
  export default {
    computed: {
      ...mapGetters({
        groupSubjects: groupsAllModule + GROUP_SUBJECTS
      }),
      ...mapState({
        creatingError: state => state.groups.creatingError,
        loading: state => state.groups.loading,
      }),
      logoImgChange() {
        if (!this.dataUrlLogo)
          return 'group-logoimg';
        else {
          if (this.dataUrlBanner)
            return 'group-logoimg group-logo-border group-logotop';
          else
            return 'group-logoimg group-logo-border group-logobottom';
        }

      },
      makeEvent() {
        if (this.typeOfCreate == 'event')
          return "create-header--item active"
        else
          return "create-header--item"
      },
      makeGroup() {
        if (this.typeOfCreate == 'group')
          return "create-header--item active"
        else
          return "create-header--item"
      },
      makeCommunity() {
        if (this.typeOfCreate == 'community')
          return "create-header--item active"
        else
          return "create-header--item"
      },
      nameFieldCaption() {
        return this.typeOfCreate == 'event'
          ? this.$lang.variables.titleOfEvent
          : this.$lang.variables.titleOfCommunityOrGroup;
      }
    },
    data() {
      return {
        logoObj: {},
        bannerObj: {},
        typeOfCreate: 'group',
        accessibility: 'open',
        imageSize: localStorage.getItem('clientWidth'),
        myCroppa: {},
        myCroppaLogo: {},
        imageBanner: 'https://media.inrating.top/images/Fon_350x150.png',
        fileUploadBanner: '',
        imageLogo: 'https://media.inrating.top/images/Fon_60x60.png',
        fileUploadLogo: '',
        qualityImage: '',
        imageWidth: '',
        imageHeigth: '',
        groupName: '',
        groupTheme: '',
        location: '',
        groupLocationId: '',
        groupDesc: '',
        groupWeb: '',
        groupPhone: '',
        dataUrlBanner: 'https://media.inrating.top/storage/img/default/banner-750x315.jpg',
        dataUrlLogo: 'https://media.inrating.top/storage/img/default/banner-300x300.jpg',
        fee: '1',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        indexBanner: false,
        indexLogo: false,
      }
    },
    mounted() {
      let image = localStorage.getItem('clientWidth');
      this.imageWidth = parseInt(image);
      this.imageHeigth = this.imageWidth * 315 / 760;
      this.qualityImage = Math.ceil(1080 / this.imageWidth);
      this.getGroupSubjects();
    },
    methods: {
      ...mapActions({
        getGroupSubjects: groupsAllModule + FETCH_GROUP_SUBJECTS,
        createCurrentGroup: groupsModule + CREATE_GROUP,
      }),
      changeType(e) {
        this.typeOfCreate = e;
      },
      groupBannerOpen() {
        this.$modal.show('groupBanner');
        setTimeout(() => {
          this.myCroppa.chooseFile();
        }, 100);

      },
      groupLogoOpen() {
        this.$modal.show('groupLogo');
        setTimeout(() => {
          this.myCroppaLogo.chooseFile();
        }, 100);
      },
      closeBanner() {
        this.$modal.hide('groupBanner');
      },
      closeLogo() {
        this.$modal.hide('groupLogo');
      },
      addToCropp() {
        this.dataUrlBanner = this.myCroppa.generateDataUrl();
        if (this.dataUrlBanner !== '') {
          this.imageBanner = this.dataUrlBanner;
          this.fileUploadBanner = imageHelper.formatPhoto(this.imageBanner);
          this.$modal.hide('groupBanner');
          this.uploadBanner();
          this.indexBanner = true;
        }
      },
      addToCroppLogo() {
        this.dataUrlLogo = this.myCroppaLogo.generateDataUrl();
        if (this.dataUrlLogo !== '') {
          this.imageLogo = this.dataUrlLogo;
          this.fileUploadLogo = imageHelper.formatPhoto(this.imageLogo);
          this.$modal.hide('groupLogo');
          this.uploadLogo();
          this.indexLogo = true;
        }
      },
      googleAutoComplete() {
        let place = document.getElementById('place');
        let placeId = document.getElementById('placeId');
        let autocomplete = new google.maps.places.Autocomplete(place);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          placeId.value = place.place_id;
          this.groupLocation = place.formatted_address;
          this.groupLocationId = place.place_id;
          this.$modal.hide('location');
        });
      },

      uploadBanner() {
        let uploadId = '';
        axios.get('v1/uploads/create?type=user-post')
          .then(
            res => {
              uploadId = res.data.upload_id;
              let dataBanner = new FormData;
              dataBanner.append('upload_id', uploadId);
              dataBanner.append('file', this.fileUploadBanner);
              axios.post('v1/uploads/load', dataBanner)
                .then(
                  res => {
                    this.bannerObj = {
                      id: uploadId,
                      items: [res.data.file_id],
                    }
                  }
                )
            }
          )
      },

      uploadLogo() {
        let uploadId = '';

        axios.get('v1/uploads/create?type=user-post')
          .then(
            res => {
              uploadId = res.data.upload_id;
              let dataLogo = new FormData;
              dataLogo.append('upload_id', uploadId);
              dataLogo.append('file', this.fileUploadLogo);
              axios.post('v1/uploads/load', dataLogo)
                .then(
                  res => {
                    this.logoObj = {
                      id: uploadId,
                      items: [res.data.file_id],
                    }
                  }
                )
            }
          )
      },
      async createGroup() {
        let timeData = new Date();
        let timeDay = timeData.getDay();
        let timeMonth = timeData.getMonth();
        let timeYear = timeData.getFullYear();

        let access = '';

        if (this.accessibility === 'fee') {
          access = 'closed';
        }
        else {
          access = this.accessibility;
        }
        let data = new FormData;
        if (this.groupName && this.groupTheme && this.groupDesc && this.groupLocationId && this.fee && this.typeOfCreate && this.logoObj.id && this.bannerObj.id) {
          data.append('name', this.groupName);
          data.append('subject', this.groupTheme);
          data.append('description', this.groupDesc);
          data.append('accessibility', access);
          data.append('place_geo_id', this.groupLocationId);
          data.append('type', this.typeOfCreate);
          data.append('fee', this.fee);
          data.append('website', this.groupWeb);
          data.append('phone', this.groupPhone);
          data.append('logo', JSON.stringify(this.logoObj));
          data.append('banner', JSON.stringify(this.bannerObj));
          if (this.typeOfCreate === 'event') {
            data.append('start_date', this.startDate.split('-').reverse().join('-') + ' ' + this.startTime);
            data.append('end_date', this.endDate.split('-').reverse().join('-') + ' ' + this.endTime);
            console.log(this.startDate.split('-').reverse().join('-'), this.endDate.split('-').reverse().join('-'));
          }

          await this.createCurrentGroup(data);
          if(this.creatingError) {
            this.$notify({
              group: 'action-error',
              duration: 3000,
              speed: 300,
            });
          }
        }
        else {
          this.$notify({
            group: 'not-allfields-group',
            duration: 3000,
            speed: 300,
          })
        }
      },
      goBack() {
        history.go(-1);
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/groupcreate.less';

  .status-item.active {
    color: #0cb4be;
  }

  .pac-container {
    width: 100% !important;

    left: 0 !important;
  }

  .croppa-container {
    margin-top: 31px;
    text-align: center;
    margin-bottom: 26px;
  }

  .modal-title {
    font-size: 4.5vw;
  }

  .group-subj {
    width: 95%;
    margin: auto;
    margin-bottom: 20px;
  }

  .logo-buttons-cropp {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: auto;
  }

  #groupCreate {
    .modal-title {
      color: @white;
    }
  }
</style>
