<template>
  <div class="registration-page">
    <in-bg-scroll-block :scroll="isScroll"/>
    <div class="registration">
      <div class="login-header">
        <h3 class="login-title"> {{$lang.variables.newUniqueSocialNetwork}} </h3>
        <img
          class="login-logo"
          src="https://media.inrating.top/storage/img/logo/Inrating_logo_white_tifany.png">
        <h2 class="form-title">{{$lang.variables.welcomeToTheWorld}}</h2>
      </div>
      <form class="publicOffer">
        <div class="row">
          <div class="col-12"><p>Rules and description of the procedure for holding contests.</p>
            Any user of network can create his own contest, event or voting in the InRating social network.
            <p></p>
            To create a contest, an event or voting you need to fill in the online application (brief) in the contests
            section in the social network InRating.
            <p></p>
            Also you can contact us by phone number 0 800 50 36 99.
            <br><br>
            After the completed application for the contest, Administration of the social network InRating will contact
            and consult you on all matters related to visual design and voting that use the E-Voting system.
            <p></p>

            User must be registered in the social network InRating to vote in the contest, event or voting (we do not
            provide the opportunity for voting activity using the "guest entry" function in order to avoid unfair voting
            results).<br>
            <p></p>
            <span class="info">Voting tools:</span><br>
            <p></p>
            1. Voting in the contest using the likes on the contest page<br>
            2. Voting in the contest with rating rising on the contest page<br>
            3. Voting in the contest with using INCoin internal coin on the contest page<br>
            4. Mixed type of voting, which uses a several number of tools for the vote, with the summation of the
            overall result (such as likes and rating rasing on the contest page)<br>
            <p></p>

            All official start and end dates of competitions, information of prizes and partners of the competition - is
            highlighted on the page (tab) of each contest
            <p></p>

            Administration of InRating is not responsible for the failure to comply with the conditions stated by the
            organizers of the contests.
            Administration of InRating provides only technical and visual support in contests, events, and also
            automatically counts votes in ongoing contests, events within the InRating social network.
            We also inform you that Apple Inc. is not a sponsor of the competitions and has no direct or indirect
            relation to the events that take place within the InRating social network.

          </div>
        </div>
      </form>
      <template v-if="$route.fullPath === '/contest-rules'">
        <div class="login-item concat-item">
          <div ><a href="tel:0800503699" >0 800 50 36 99</a></div>
          <div ><a href="mailto:info@inrating.club">info@inrating.club</a></div>
        </div>
        <div class="login-item concat-item">
          <img @click="goToAppStore" src="https://media.inrating.top/images/logo/iso_3.png">
          <img @click="goToGooglePlay" src="https://media.inrating.top/images/logo/gp_3.png">
        </div>
      </template>
      <p class="login-information">{{$lang.variables.privacyPolicy}}</p>
      <p class="login-information">{{$lang.variables.networkRules}}</p>
      <p class="login-information"><b>InRating Group FZC © 2018</b></p>
      <button
        class="animation-button"
        @click="guestCome">{{$lang.variables.toTheMain}}</button>
    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex';
  import BgScrollBlock from 'ComponentsVue/login/BgScrollBlock';
  import {
    AUTHENTICATE_AS_A_GUEST,
    moduleName as authenticationModuleName
  } from 'Store/modules/authentication';

  export default {
    components: {
      inBgScrollBlock: BgScrollBlock
    },
    data() {
      return {
        isScroll: false,
      }
    },
    methods: {
      ...mapActions({
        authenticateAsAGuest: authenticationModuleName + AUTHENTICATE_AS_A_GUEST,
      }),
      goToGooglePlay() {
        window.location.href='https://play.google.com/store/apps/details?id=com.inrating.android';
      },
      goToAppStore() {
        window.location.href='https://itunes.apple.com/us/app/inrating/id1336983710'
      },
      async guestCome() {
        await this.authenticateAsAGuest();
        this.$router.replace('/');
      },
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/variables.less';

  .registration-page {
    margin-top: 0 !important;

    .registration {
      background: rgba(0, 0, 0, 0.75);
      margin: 5vh auto 0 auto;
      animation: opa 1s ease-out forwards;
      padding-bottom: 40px;
    }

    @keyframes opa {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes trY {
      from {
        transform: translateY(100vh);
        opacity: 0.5;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .login-header {
      opacity: 0;
      animation: trY 0.5s ease-out 1s forwards;
    }

    .publicOffer {
      opacity: 0;
      animation: trY 0.5s ease-out 1s forwards;
    }

    .login-item {
      opacity: 0;
      animation: trY 0.5s ease-out 1s forwards;
    }

    .login-information {
      opacity: 0;
      animation: trY 0.5s ease-out 1s forwards;
    }

    .animation-button {
      opacity: 0;
      animation: trY 0.5s ease-out 1s forwards;
      padding: 10px 15px;
    }

  }

  .publicoffer-body p {
    text-align: left;
    padding: 10px;
  }

  .col-12 {
    text-align: left;
    padding: 10px;
  }

  form.publicOffer {
    text-align: left;
    padding: 0 15px;
    .row > .col-12 p.title {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    ol {
      padding: 0;
      margin: 0;
      li {
        position: relative;
        margin-bottom: 5px;
        &:before {
          content: '✓';
          font-size: 18px;
          position: absolute;
          top: -5px;
          left: -15px;
          color: @contest-list-text-color;
        }
      }
    }
  }
</style>
