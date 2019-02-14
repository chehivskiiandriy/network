<template>
  <div class="member-block">
    <div class="member-place">
      <div>
        <p class="member-place--title">{{$lang.variables.placeInTheRating}}</p>
      </div>
      <p class="chart-place" v-text="'0'"> </p>
      <span v-text="'Имя'"></span>
      <span v-text="'Фамилия'"></span>
      <div class="member-names">
        <router-link  :to="'#'">
          <p class="member-nickname" v-text="'Никнейм'"></p>
        </router-link>
      </div>

    </div>
    <div class=" member-avatar" >
      <a :href="'#'">
        <img class="contest-user-photo" src="https://media.inrating.top/storage/img/backgrounds/b.png" alt="">
      </a>
      <div class="member-raiting">
        <i class="icon-logo-f" aria-hidden="true"></i>
        <span v-text="'0'"></span>
      </div>
      <div class="member-placeinlist">
        <span v-text="'№ 0'"></span>
      </div>
    </div>
    <div class="member-vote">
      <div>
        <a href="#" v-text=""></a>
      </div>
      <div>
        <div >
          <p class="member-likes" >
            <i class="icon-heart-f small_heart" aria-hidden="true"  ></i>
            <span v-text="'0'"></span>
          </p>
          <p class="member-allvotes"  >
            <i class="icon-heart-f heart-for-vote"  aria-hidden="true">
              <i class="icon-logo-f r-inheart" aria-hidden="true" ></i>
            </i>
            <span class="member-allvotes--count" v-text="0"></span>
          </p>
        </div>
      </div>
      <div>
        <div class="member-contact">
          <router-link :to="'#'">
            <i class="icon-profile-settings " aria-hidden="true" ></i>
          </router-link>
          <a >
            <i class="icon-speech " aria-hidden="true" ></i>
          </a>
        </div>
      </div >

    </div>
  </div>
</template>

<script>
  export default {
    name: "contestMemberEmpty",

  };
</script>

<style lang="less">
  @import '~LessStyle/contestmember.less';
</style>
