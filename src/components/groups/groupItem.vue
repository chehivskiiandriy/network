<template>
  <div
    class="group-my"
    @click="goToGroup">
    <div class="group-my-status">
      <div class="group-my-status--item">
        <span
          v-if="group.accessibility === 'open'"
          class="group-my-status--item-body">
          <i class="icon-lock_open"></i>
          <span>{{$lang.variables.open}}</span>
        </span>
        <span
          v-else
          class="group-my-status--item-body">
          <i class="icon-lock_close"></i>
          <span>{{$lang.variables.closed}}</span>
        </span>
      </div>
      <div class="group-my-status--item">
        <i class="icon-human-f"></i>
        <span>{{group.users_count}}</span>
      </div>
    </div>
    <div class="group-my-info">
      <span class="group-my-info--item group-my-name">{{group.name}}</span>
      <span class="group-my-info--item group-my-description">{{group.desc}}</span>
      <span
        v-if="group.location"
        class="group-my-info--item group-my-location">
        <i class="icon-location-f"></i>
        <span>{{group.location.location}}</span>
      </span>
      <div
        v-if="group.group_user && group.group_user.role === 'admin'"
        class="group-my-info--is-avatar">
        <i class="icon-check-f"></i>
      </div>
    </div>
    <div
      class="group-my-avatar"
      :style="{backgroundImage: `url(${group.logo.url_small})`}">
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      group: {
        type: Object,
        required: true
      }
    },
    methods: {
      goToGroup() {
        this.$router.push('/group/' + this.group.slug);
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .group-my {
    width: calc(~'97vw - 10px');
    height: calc(~'20vw - 10px');
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-bottom: 1vw;
    display: flex;

    &-status {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      border-right: 1px solid #ccc;
      font-size: 3.5vw;

      &--item {
        padding-bottom: 3px;

        &-body {
          display: flex;
          align-items: center;
          justify-content: flex-start;

          span {
            width: 80%;
            .truncate();
          }
        }
      }
    }

    &-info {
      width: calc(~'80% - 20vw + 10px - 5px');
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      padding-right: 5px;
      position: relative;

      &--item {
        width: 90%;
        text-align: right;
        .truncate();
      }

      &--is-avatar {
        position: absolute;
        top: 0;
        left: 5px;

        i {
          .text-grad();
        }
      }
    }

    &-avatar {
      width: calc(~'20vw - 10px');
      height: calc(~'20vw - 10px');
      border-radius: 3px;
    }

    &-name {
      color: @dark_grey;
      font-size: 4.2vw;
    }

    &-description {
      color: #2c3e50;
      font-size: 3.2vw;
    }

    &-location {
      color: #2c3e50;
      font-size: 3vw;
    }
  }

  .icon-user-group {
    i {
      .text-grad();
    }
  }

  .group-avatar {
    width: 23%;
  }

  .groups-location {
    font-size: 8px;
    color: #d3d3d3;
    text-align: right;
  }

  .group-name {
    font-weight: 600;
    color: #777;
  }

  .group-item--about i {
    font-size: 14px;
  }

  .group-link {
    text-decoration: none;
    color: #000;
  }

  .group-my-avatar {
    background-size: cover;
  }
</style>
