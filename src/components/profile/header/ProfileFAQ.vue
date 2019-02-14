<template>
  <div class="profile-faq">
    <div class="profile-faq-item">
      <router-link to="/public-offer-and-confidentiality">{{$lang.variables.aboutUs}}</router-link>
    </div>
    <div class="profile-faq-item">
      <router-link to="/rule-page">{{$lang.profile.network_rules}}</router-link>
    </div>
    <div class="profile-faq-item">
      <router-link to="/settings/common">{{$lang.profile.support}}</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ProfileFAQ",
    props: {
      user: Object
    }
  }
</script>

<style lang="less">
  .profile-faq {
    width: 100%;
    display: flex;

    &-item {
      width: 33vw;

      &:not(:last-child) {
        border-right: 1px solid #ccc;
      }

      a {
        color: #2c3e50;
      }
    }
  }
</style>
