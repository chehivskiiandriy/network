<template>
  <div id="groupCreate">
    <div class="modal-title">
      Редактирование группы
      <span @click="goBack" class="go-back">
        <i class="icon-left-f"></i>
      </span>
    </div>
    <div class="group-previewimg">
      <img class="group-bannerimg" :src="getGroup.banner && getGroup.banner.url_large"/>
      <img class="group-logoimg" :src="getGroup.banner && getGroup.logo.url_large"/>
    </div>
    <div class="group-createfields">
      <div class="group-photos">
        <button @click="groupBannerOpen" class="action-post-button">
          <span>{{$lang.variables.selectABanner}}</span>
        </button><br>
        <button @click="groupLogoOpen" class="action-post-button">
          <span>{{$lang.variables.selectAvatar}}</span>
        </button>
      </div>
      <p class="group-create-title">{{$lang.variables.name}}</p>
      <div class=" group-name">
        <input class="group-input--item" type="text" :placeholder="$lang.variables.name" v-model="getGroup.name" >
      </div>
      <p class="group-create-title">{{$lang.variables.subject}}</p>
      <template v-for="subject in groupSubjects">
        <div v-show="subject.id !== 0" class="status-item" @click="groupTheme = subject.id">
              <span>
                 <in-contestdot :vote="groupTheme" :string="subject.id"></in-contestdot>

                  <p>{{subject.name}}</p>
              </span>
        </div>
      </template>
      <p class="group-create-title">{{$lang.variables.location}}</p>
      <div class="group-location">
        <input type="text" class="modal-location group-input--item" v-on:click="googleAutoComplete()" v-model="groupLocation"
               :placeholder="$lang.variables.location"
               id="place"
               name="place"/>
        <input type="hidden" name="placeId"  v-model="groupLocationId" id="placeId" value=""/>
      </div>
      <p class="group-create-title">{{$lang.variables.desc}}</p>
      <div class=" group-descr">
        <textarea class="group-input--item" type="text" :placeholder="$lang.variables.desc" v-model="getGroup.desc" id="group-desc"></textarea>
      </div>
      <p class="group-create-title">{{$lang.variables.siteOptional}}</p>
      <div class=" group-web">
        <input class="group-input--item" type="text" :placeholder="$lang.variables.siteOptional" v-model="getGroup.website" id="group-web"/>
      </div>
      <p class="group-create-title">{{$lang.variables.phone}}</p>
      <div class=" group-phone">
        <input class="group-input--item" type="text" :placeholder="$lang.variables.phone" v-model="getGroup.phone" id="group-phone"/>
      </div>
    </div>
    <template v-if="getGroup.accessibility === 'closed' && isExist(getGroup.fee)">
      <p class="group-create-title">{{$lang.variables.amountOfIncoinForEntry}}</p>
      <input class="group-input--item" type="number" min="1" max="10000" v-model="getGroup.fee" :placeholder="$lang.variables.amountOfIncoinForEntry">
      <p class="group-create-title">{{$lang.variables.balance}}: {{getGroup.coins}} </p>
    </template>
    <button @click="createGroup()"> {{$lang.variables.update}}</button>
    <modal name="groupBanner"
           width="100%"
           classes=" v--modal"
           :scrollable="true"
           height="100%">
      <div class="modal-title">
        <i @click="closeBanner" class="icon-left-f go-back"></i>
        {{$lang.variables.selectABanner}}
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
        {{$lang.variables.chooseAvatar}}
      </div>

      <croppa
        v-model="myCroppaLogo"
        :width=300
        :height=300
        :quality=1
        :placeholder="$lang.variables.chooseAvatar"
        :placeholder-font-size="10"
        :disabled="false"
        :prevent-white-space="true"
        :show-remove-button="false"
        placeholder-color="#000">
      </croppa>
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
  import {mapActions, mapGetters} from 'vuex'
  import {FETCH_GROUP_SUBJECTS, GROUP_SUBJECTS, moduleName as groupsAllModule,} from "Store/modules/groups/groupsAll";

  Vue.component('in-contestdot',contestDot);
  Vue.component('in-spinner-load',spinnerLoad);
  export default {
    computed: {
      ...mapGetters({
        groupSubjects: groupsAllModule + GROUP_SUBJECTS
      }),
      getGroup() {
        return  window.storeGroup.getters.getGroup;
      },
      groupLocation: {
        get() {
          return this.values.groupLocation !== null
            ? this.values.groupLocation
            : this.getGroup.location && this.getGroup.location.location;
        },
        set(nextGroupLocation) {
          this.values.groupLocation = nextGroupLocation;
        },
      },
      groupLocationId: {
        get() {
          return this.values.groupLocationId !== null
            ? this.values.groupLocationId
            : this.getGroup.location && this.getGroup.location.google_place_id;
        },
        set(nextGroupLocationId) {
          this.values.groupLocationId = nextGroupLocationId;
        },
      },
      groupTheme: {
        get() {
          return (this.values.groupTheme !== null
            ? this.values.groupTheme
            : this.getGroup.subject_instance && this.getGroup.subject_instance.id)
        },
        set(nextSubject) {
          this.values.groupTheme = nextSubject;
          console.log(this.values.groupTheme)
        },
      },
    },
    data() {
      return {
        logoObj: {},
        logoIndex:false,
        bannerIndex:false,
        bannerObj: {},
        typeOfCreate: 'group',
        accessibility: 'open',
        imageSize: localStorage.getItem('clientWidth'),
        myCroppa:{},
        myCroppaLogo:{},
        imageBanner:'https://media.inrating.top/images/Fon_350x150.png',
        fileUploadBanner:'',
        imageLogo:'https://media.inrating.top/images/Fon_60x60.png',
        fileUploadLogo:'',
        qualityImage:'',
        imageWidth: '',
        imageHeigth: '',
        groupName:'',
        values: {
          groupTheme: null,
          groupLocation: null,
          groupLocationId: null,
        },
        groupDesc:'',
        groupWeb:'',
        groupPhone:'',
        dataUrlBanner:'',
        dataUrlLogo:'',
        fee:'1',
        loading: false,
      }
    },
    mounted() {
      let image = localStorage.getItem('clientWidth');
      this.imageWidth = parseInt(image) - 10;
      this.imageHeigth = this.imageWidth * 315 / 760;
      this.qualityImage = Math.ceil(1080 / this.imageWidth);
      window.storeGroup.dispatch('LOAD_GROUP_INFO',{group:this.$route.params.group_slug});
      this.getGroupSubjects();
    },
    methods: {
      ...mapActions({
        getGroupSubjects: groupsAllModule + FETCH_GROUP_SUBJECTS,
      }),
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
        this.bannerIndex = true;
        this.getGroup.banner.url_large = this.myCroppa.generateDataUrl();
        if (this.getGroup.banner.url_large != '') {
          this.imageBanner = this.getGroup.banner.url_large;
          this.fileUploadBanner = imageHelper.formatPhoto(this.imageBanner);
          this.$modal.hide('groupBanner');
          this.uploadBanner();
        }
      },
      addToCroppLogo() {
        this.logoIndex = true;
        this.getGroup.logo.url_large = this.myCroppaLogo.generateDataUrl();
        if (this.getGroup.logo.url_large != '') {
          this.imageLogo = this.getGroup.logo.url_large;
          this.fileUploadLogo = imageHelper.formatPhoto(this.imageLogo);
          this.$modal.hide('groupLogo');
          this.uploadLogo();
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
      // TODO: NOTE: this method might be an util
      isExist(value) {
        return value !== null && value !== undefined;
      },
      createGroup() {
        let data = new FormData;
        data.append('group_slug', this.getGroup.slug);
        data.append('name', this.getGroup.name);
        data.append('subject', this.groupTheme);
        data.append('description', this.getGroup.desc);
        data.append('accessibility', this.getGroup.accessibility);
        this.isExist(this.getGroup.website) && data.append('website', this.getGroup.website);
        this.isExist(this.getGroup.phone) && data.append('phone', this.getGroup.phone);
        this.isExist(this.groupLocationId) && data.append('place_geo_id', this.groupLocationId);
        this.isExist(this.getGroup.fee) && data.append('fee', this.getGroup.fee);
        if (this.logoIndex)
          data.append('logo', JSON.stringify(this.logoObj));
        if (this.bannerIndex)
          data.append('banner', JSON.stringify(this.bannerObj));
        this.loading = true;
        axios.post('v1/groups/edit', data)
          .then(res => {
            this.$router.push('/group/' + this.getGroup.slug)
          })
          .catch(e => {
          })

      },

      goBack() {
        history.go(-1);
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/groupcreate.less';
  @import '~LessStyle/variables.less';
  .status-item.active {
    color: #0cb4be;
  }

  .modal-title {
    font-size: 4.5vw;
  }

  .go-back {
    position: absolute;
    left: -6px;
    top: 1px;
    font-size: 22px;
    color: #fff;
  }


  .croppa-container {
    margin-top: 10px;
    text-align: center;
  }

</style>
