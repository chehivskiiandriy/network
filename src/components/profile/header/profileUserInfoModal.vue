<template>
  <modal name="profileUserModal"
         width="100%"
         classes=" v--modal group-settings"
         height="auto"
         :scrollable="true">
    <i @click="closeProfileUserModal()" class="icon-delete-f"></i>
    <table cellspacing="0">
      <tr>
        <td>Дата</td>
        <td>Постов  сегодня</td>
        <td>Регистраций  сегодня</td>
        <td>Гостевой вход</td>
        <td>Постов всего</td>
        <td>Регистрации всего</td>


      </tr>
        <tr v-for="(sta,index) in stat">

          <td>{{allformat[index]}}</td>
          <td>{{info[sta].posts}}</td>
          <td>{{info[sta].users_reg}}</td>
          <td>{{info[sta].users-info[sta].users_reg}}</td>
          <td>{{info[sta].posts_inc}}</td>
          <td>{{info[sta].user_inc_without_guests}}</td>

        </tr>
    </table>
    <!--<span>Family status:</span>
    <p>-{{family}}</p>
    <span>Social status:</span>
    <p v-for="socialItem in social">-{{socialItem}}</p>
    <span>Activity status:</span>
    <p>-{{activity}}</p>-->
  </modal>
</template>
<script>
  import axios from 'axios';

  export default  {
    props:['stat','info','allformat'],
    data() {
      return {
        familyStatus:'',
        socialStatus:[],
        activityStatus:[],
        family:'',
        activity:'',
        social:'',
        user:{},
      }
    },
    mounted() {
      let author_id =this.$route.params.nickname;
      axios
        .get('v1/users/get?nickname='+author_id)
        .then(
          res => {
            this.user=res.data;
            let family=this.user.family_status;
            switch (family) {
              case'in_search' : {
                this.family='В поиске';
              }
                break;
              case'in_active_search' : {
                this.family='В поиске';
              }
                break;
              case'in_relationship' : {
                this.family='В поиске';
              }
                break;
              case'single' : {
                this.family='В поиске';
              }
                break;
              case'married' : {
                this.family='В поиске';
              }
                break;

            };
            let activity=this.user.activity_statuses.map(function (obj) {
              return obj.value
            });
            this.activity=activity.join(',');
            let social=this.user.social_statuses.map(function (obj) {
              return obj.value
            });
            this.social=social;
          }
        )


    },
    methods: {
      closeProfileUserModal() {
        this.$modal.hide('profileUserModal');
      }
    }
  }
</script>
<style>
    .group-settings {
      padding:10px 3%;
    }
    td {
      font-size: 12px;
      border: 1px solid;
      text-align: center;
    }


</style>
