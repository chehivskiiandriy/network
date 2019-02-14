<template>
  <div class="profile-rating">
    <div class="profile-rating-item">
      <span><i class="icon-logo-f"></i> {{$lang.variables.ofDay}}</span>
      <span v-text="user.typed_rating.day">  </span>
    </div>
    <div class="profile-rating-item">
      <span><i class="icon-logo-f"></i> {{$lang.variables.ofWeek}}</span>
      <span v-text="user.typed_rating.week">  </span>
    </div>
    <div class="profile-rating-item">
      <span><i class="icon-logo-f"></i> {{$lang.variables.ofMonth}}</span>
      <span v-text="user.typed_rating.month">  </span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ProfileRating',
    props: {
      user: [Object, undefined]
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .profile-rating {
    width: 100vw;
    display: flex;

    &-item {
      width: 33vw;
      box-sizing: border-box;
      font-size: 4vw;

      &:not(:last-child) {
        border-right: 1px solid #ccc;
      }

      .icon-logo-f {
        padding-right: 5px;
        .text-grad();
      }
    }
  }
</style>


