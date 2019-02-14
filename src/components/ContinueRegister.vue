<template>
  <div class="register-modal continue-registration-page">
    <div class="bgc-grad-register"></div>
    <div class="registration">
      <div class="registration-header">
        <h3> {{$lang.variables.step_two}}  </h3>
      </div>
      <div class="registration-body">
        <form ref="secondStep">
          <div class="registration-item registration-gender">
            <p>{{$lang.variables.choose_gender}}*</p>
            <div v-if="gender=='male'" class="gender-item select" @click="gender='male'"  >
              {{$lang.variables.male}}
            </div>
            <div v-else class="gender-item" @click="gender='male'"  >
              {{$lang.variables.male}}
            </div>
            <div v-if="gender=='female'" class="gender-item select" @click="gender='female'"  >
              {{$lang.variables.female}}
            </div>
            <div v-else class="gender-item" @click="gender='female'"  >
              {{$lang.variables.female}}
            </div>
          </div>
          <div class="registration-item">
            <label>{{$lang.variables.enterYourDateOfBirth}}*</label>
            <input type="date" class="registration-input" id="birth_date" min="1950-01-01" max="2002-12-12" placeholder="Выберите дату">
          </div>
          <div class="registration-item">
            <label>{{$lang.variables.location}}</label>
            <input type="text" class="registration-input" v-on:click="googleAutoComplete()"  v-model="changeLocation" value="" placeholder="Укажите место"
                   id="place"
                   name="place" />
            <input type="hidden" name="placeId" id="placeId" value=""/>
          </div>
          <div class="registration-item">
            <label>{{$lang.variables.choose_email}}* </label>
            <input type="email" ref="email" class="registration-input" placeholder="E-mail" >
          </div>

          <div class="registration-item">
            <button  id="chooseAvaButton" type="button" @click="chooseAvatarButton($event)">{{$lang.variables.addAvatar}}*</button>
          </div>
          <div  id="reg-crop" class="registration-item">
            <div class="cropp">
              <croppa v-model="myCroppa"
                      :width="this.imageSize"
                      :height="this.imageSize"
                      :show-remove-button="false"
                      :placeholder="$lang.variables.chooseAvatar"
                      :initial-image="avatarImage"   >
              </croppa>
              <label class="avatar-title">{{$lang.variables.chooseAvatar}}</label>
              <button type="button" @click="myCroppa.remove()">{{$lang.variables.delete}}</button>
              <button type="button" @click="addToCropp()">{{$lang.variables.apply}}</button>
            </div>
            <img class='previewPhoto' @click="newAvatar()" :src="image" />
          </div>
          <div class="registration-item">
            <label>{{$lang.variables.familyStatus}}</label>
            <select v-model="selectedFamily" >
              <option disabled  value="">Выберите один из вариантов</option>
              <option value="married">{{$lang.variables.married}} </option>
              <option value="in_relationship">{{$lang.variables.inRelations}}</option>
              <option value="single">{{$lang.variables.single}} </option>
              <option value="in_search">{{$lang.variables.inSearch}} </option>
              <option value="in_active_search">{{$lang.variables.inActiveSearchInRating}} </option>
            </select>
          </div>
          <div class="registration-item">
            <label>{{$lang.variables.chooseStatus}}</label>
            <select v-model="selectedSocial"  @change="addToSocialStatus()">
              <option v-for="option in socialOptions" v-bind:value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="registration-item">
                            <span class="social-item"  v-for="( social,index) in socialArray">
                                    <span v-text="social"></span><i @click="deleteFromSocial(index)" class="icon-delete-f"></i>
                            </span>
          </div>
          <div class="registration-item">
            <label>{{$lang.variables.chooseActivity}}</label>
            <select v-model="selectedActivity"  @change="addToActivity()">

              <option v-for="option in fieldOfActivity" v-bind:value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
          <div class="registration-item">
                            <span class="activity-item"  v-for="( activity,index) in activityArray">
                                    <span v-text="activity"></span><i  @click="deleteFromActivity(index)" class="icon-delete-f"></i>
                            </span>
          </div>


          <div class="registration-item">
            <button @click="sendRegistration()"> {{$lang.variables.txtContinue}} </button>
          </div>
        </form>
      </div>

    </div>


    <div class="registration-blur"></div>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import Croppa from 'vue-croppa'
  import VueGoogleAutocomplete from 'vue-google-autocomplete'
  import imageHelper from 'JsLib/imageHelper'


  Vue.component('vue-google-autocomplete',VueGoogleAutocomplete );
  Vue.use(Croppa)
  export default {
    data() {
      return {
        changeLocation:'',
        changeLocationId:'',
        myCroppa:{},
        imageSize: '',
        address: '',
        image: '',
        dataUrl:'',
        gender:null,
        imageFile: '',
        showCropp:false,
        avatarImage:'',
        //step_key: '5606253021517418720',
        selectedFamily:[],
        selectedSocial: '',
        selectedActivity: '',
        socialArray:[],
        activityArray:[],
        socialOptions :[
          { text: 'Студент/Студентка', value: 'Student' },
          { text: 'Предприниматель/Бизнес-вумен', value: 'Entrepreneur / Businesswomen' },
          { text: 'Менеджер', value: 'Manager' },
          { text: 'Топ-менеджер', value: 'Top manager' },
          { text: 'Чиновник', value: 'Official' },
          { text: 'Спортсмен', value: 'Athlete' },
          { text: 'Блогер', value: 'Blogger' },
          { text: 'Медиа персона', value: 'Media Person' },
          { text: 'Творческая личность', value: 'Creative person' },
        ],
        fieldOfActivity :[
          { text: 'Образование', value: 'Education' },
          { text: 'Бизнес', value: 'Business' },
          { text: 'Шоу бизнес', value: 'Show Business' },
          { text: 'Политика', value: 'Policy' },
          { text: 'Медецина', value: 'Medicine' },
          { text: 'Искусство', value: 'Art' },
          { text: 'Наука', value: 'Science' },
          { text: 'IT технологии', value: 'IT technology' },
          { text: 'Сфера услуг', value: 'Service secto' },
          { text: 'Спорт', value: 'Sport' },
        ],
        newToken:'',
        phoneImg : 'small/ukraine.png',
        phonePlaceholder : '+38(___)___-__-__',
        phoneMask:'\\+\\3\\8(111)111-11-11',
        countryList: false,

      }
    },
    mounted() {
      this.$root.$on('newBearer', (event)=>{
        this.newToken=event;
      });
      let image=localStorage.getItem('clientWidth');
      this.imageSize=parseInt(image)-parseInt(image)*0.34;
    },

    methods: {
      googleAutoComplete() {
        let place = document.getElementById('place');
        let placeId =  document.getElementById('placeId');

        let autocomplete = new google.maps.places.Autocomplete(place);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          placeId.value=place.place_id;
          this.changeLocation=place.formatted_address;
          this.changeLocationId=place.place_id;
          this.$modal.hide('location');
        });
      },
      hideRegistration() {
        let gender=this.gender;
        let email=this.$refs.email.value;
        let birth_date=document.getElementById('birth_date').value;
        let file = imageHelper.formatPhoto(this.image);
        if (gender && birth_date && file && email ) {
          window.location.href='/';
        }
        else {
          this.$notify({
            group: 'require-fields',
            duration:3000,
            speed:300,
          })
        }

      },
      uploadCroppedImage() {
        this.myCroppa.generateBlob((blob) => {
        }, 'image/jpeg') ;
      },
      addToCropp() {
        this.dataUrl = this.myCroppa.generateDataUrl();
        let inputFile=document.querySelector('input ');
        let file = document.querySelector('input[type=file]').files[0];
        this.imageFile=file;
        if (this.dataUrl!='')  {
          this.image=this.dataUrl,
            this.myCroppa.remove();
          document.querySelector('.cropp').style.display='none';
        }
        else {
          alert('none');
        }
      },
      newAvatar() {
        document.querySelector('.cropp').style.display='block';
        this.image="";
      },
      addToSocialStatus() {
        let temp = this.socialArray.filter(el => el === this.selectedSocial);
        if(temp.length === 0){
          this.socialArray.push(this.selectedSocial)
        }
      },
      addToActivity() {
        let temp = this.activityArray.filter(el => el === this.selectedActivity);
        if(temp.length === 0){
          this.activityArray.push(this.selectedActivity)
        }
      },
      deleteFromSocial(i) {
        this.socialArray.splice(i,1);
      },
      deleteFromActivity(i){
        this.activityArray.splice(i,1);
      },
      getAddressData(addressData, placeResultData, id) {
        let map=document.getElementById('map');
        let country=this.$refs.country;
        this.address = addressData;
        map.value=this.address.locality;
        country.value=this.address.country;
      },
      sendRegistration() {

        this.sendForm();

        let gender=this.gender;
        let birth_date=document.getElementById('birth_date').value;
        let email=this.$refs.email.value;
        //let city=document.getElementById('map').value;
        //let country=this.$refs.country.value;
        if (gender && birth_date && this.image && email  )
        {
          document.getElementById('SpinnerPreload').style.display='block';
          let social_status=JSON.stringify(this.socialArray);
          let activity_status=JSON.stringify(this.activityArray);
          let location=this.changeLocationId;
          //let phone=document.getElementById('telua').value;
          let file = imageHelper.formatPhoto(this.image);
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',

              'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
          };
          axios.get('v1/uploads/create?type=user-post',config)
            .then(
              res=> {
                let upload=res.data.upload_id;
                let params=new FormData();
                params.append('upload_id',upload);
                params.append('file',file);
                axios.post('v1/uploads/load',params,config)
                  .then(
                    res=>{
                      let newFile= {
                        'id': res.data.upload_id,
                        'items': [res.data.file_id]
                      }
                      let uploadFile=JSON.stringify(newFile);
                      let registerData=new FormData();



                      //registerData.append('step_key',this.step_key);
                      registerData.append('gender',gender);
                      registerData.append('birth_date',birth_date);
                      registerData.append('family_status',this.selectedFamily);
                      registerData.append('email',email);
                      registerData.append('social_status',social_status);
                      registerData.append('activity_status',activity_status);
                      registerData.append('upload',uploadFile);
                      axios.post('v1/register-step-2',registerData, config)
                        .then(
                          res=> {
                            axios.get('v1/me',config)
                              .then(
                                res=> {
                                  let user = JSON.stringify(res.data);
                                  localStorage.setItem('user', user);
                                  window.location.href='/';
                                }
                              )


                          }
                        )
                        .catch(err   => {

                        });
                    }
                  )
              }
            )
        }

        else {
          this.$notify({
            group: 'require-fields',
            duration:3000,
            speed:300,
          })

        }


      },
      sendForm() {
        let form = this.$refs.secondStep;
        form.addEventListener('submit', function(e){
          e.preventDefault();
          return false;
        })
      },
      showAllCountries() {
        this.countryList=!this.countryList;
      },
      chooseAvatarButton() {
        document.querySelector('input[type=file]').click();
        document.querySelector('input[type=file]').change = this.changeAvatar();

      },
      changeAvatar() {
        document.getElementById('reg-crop').style.display = 'block';
        document.getElementById('chooseAvaButton').style.display = 'none';

      }

    },


  }
</script>

<style lang="less">
  @import '~LessStyle/login.less';
  @import "~LessStyle/registration.less";

  .registration-gender {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto;
    flex-wrap: wrap;
  }

  .select {
    background: rgba(255, 255, 255, 1);
    font-weight: 600;
    padding: 12px 3px;
  }

  .registration-gender p {
    width: 100%;
  }
  .pac-container {
    border: 0px;
    box-shadow: none;
    width: 76% !important;
    left: 0px !important;
    margin-top: 7px;
    z-index: 111111;
    margin-left: 12%;
  }

  .registration {
    padding-bottom: 100px;
  }
  .register-modal{
    background-image: url(https://media.inrating.top/storage/img/backgrounds/FON_M_NEW_2.png);
    background-size: cover;
  }

  .avatar-title {
    margin: 10px 0px;
    display: block;
  }

  #reg-crop {
    display: none;
    margin: auto;
  }

  .continue-registration-page {
    margin-top: -40px;
    margin-bottom: -70px;
  }
</style>
