<template>
  <div>
    <!-- i know you want to cry when saw this -->
    <div class="group-banner">
      <div class="group-banner__background" :style="bannerStyles">
        <div class="group-banner__black-gradient"></div>
      </div>
      <div :class="bannerListClasses">
        <div class="group-banner-list__column">
          <div v-if="!isEvent" class="group-banner-list-item group-banner-list-item group-banner__count" @click="openGroupUsersPage">
            <i class="group-banner-list-item__icon icon-guy-2-f"></i>
            <span class="group-banner-list-item__text">{{membersCount}}</span>
          </div>
          <div v-if="!isEvent" class="group-banner-list-item group-banner__type">
            <i class="group-banner-list-item__icon" :class="accessibilityIcon"></i>
            <span class="group-banner-list-item__text" v-text="userFriendlyType"></span>
          </div>
        </div>
        <div class="group-banner-list__column">
          <div :class="bannerLocationClasses" v-if="!isEvent && location">
            <i class="group-banner-list-item__icon icon-location-f"></i>
            <span class="group-banner-list-item__text">{{location}}</span>
          </div>
          <div v-if="!isEvent" :class="descriptionClasses" @click="showDescription">
            <i class="group-banner-list-item__icon icon-information"></i>
            <span class="group-banner-list-item__text">{{$lang.variables.description}}</span>
          </div>
          <div v-if="isEvent" class="group-banner-list-item group-banner-list-item_align-right group-banner-list-item_reverse" @click="openGroupUsersPage">
            <i class="group-banner-list-item__icon icon-guy-2-f"></i>
            <span class="group-banner-list-item__text">{{membersCount}}</span>
          </div>
        </div>
      </div>
        <img v-if="!isEvent" :class="logoClasses" :src="logoSource" />
    </div>
    <div :class="subBannerClasses">
      <div class="group-heading-info group-banner__heading-info group-sub-banner__column">
        <span class="group-heading-info__title"> {{ title }}</span>
        <span class="group-heading-info__subject" v-text="shortedSubject" @click="showSubject"></span>
      </div>
      <div class="group-buttons group-sub-banner__column">
        <div class="subscribe-button group-banner__subscribe-button">
          <i class="subscribe-button__icon" :class="subscribeButtonClasses"
             @click="subscribeButtonClickHandler" ></i>
        </div>
        <div class="add-post-button group-banner__add-post-button">
          <template
            v-if="isMember">
            <router-link v-if="(user.status !== 'validating')" :to="'/new-post/'+group.slug">
              <i class="icon-plus-f add-post-button__icon"></i>
            </router-link>
            <span v-else @click="openGroupPostPage"><i class=" icon-photobank "></i></span>
          </template>
          <template v-else>
            <i class="icon-plus-f add-post-button__icon"></i>
          </template>
        </div>
      </div>
      <div v-if="isEvent" class="group-sub-banner__column">
        <div class="group-banner-list-item group-banner-list-item_align-right group-banner-list-item_reverse group-banner-list-item_event-sub-banner" v-if="location">
          <i class="group-banner-list-item__icon icon-location-f"></i>
          <span class="group-banner-list-item__text">{{location}}</span>
        </div>
        <div class="group-banner-list-item group-banner-list-item_align-right group-banner-list-item_reverse group-banner-list-item_event-sub-banner">
          <i class="group-banner-list-item__icon icon-InStory"></i>
          <span class="group-banner-list-item__text">{{startDate}}</span>
        </div>
        <div class="group-banner-list-item group-banner-list-item_align-right group-banner-list-item_reverse group-banner-list-item_event-sub-banner">
          <i class="group-banner-list-item__icon icon-InStory"></i>
          <span class="group-banner-list-item__text">{{endDate}}</span>
        </div>
      </div>
    </div>
    <in-group-description-modal :desc="description"/>
    <in-group-subject-modal :subject="subject"/>
  </div>
</template>

<script>
  import groupDescModal from 'ComponentsVue/groups/groupComponents/groupDescModal';
  import groupSubjectModal from 'ComponentsVue/groups/groupComponents/groupSubjectModal';
  import moment from 'moment';

  export default {
    components: {
      inGroupDescriptionModal: groupDescModal,
      inGroupSubjectModal: groupSubjectModal,
    },
    props: {
      group: Object,
      user: Object,
    },
    computed: {
      isSubscribed() {
        return this.isSub || this.firstTime;
      },
      isAdmin() {
        const { group } = this;
        return group && group.group_user && group.group_user.role === 'admin';
      },
      /* I don't know how this method can be named else */
      isAtLeastRequestedParticipation() {
        const { group } = this;
        return group && group.group_user !== null && group.group_user.role !== null;
      },
      isMember() {
        const { group } = this;
        return group && group.group_user && (['admin', 'moderator', 'participant'].indexOf(group.group_user.role) !==  -1);
      },
      isGroup() {
        const { group } = this;
        return group && group.type === 'group';
      },
      isCommunity() {
        const { group } = this;
        return group && group.type === 'community';
      },
      isEvent() {
        const { group } = this;
        return group && group.type === 'event';
      },
      membersCount() {
        const { group } = this;
        let count = group && group.users_count;
        if(this.isAdmin) {
          count += `/(${group.requests_count})`;
        }
        return count;
      },
      userFriendlyType() {
        const { group } = this;

        switch(group && group.type) {
          case 'group':
            return this.$lang.variables.group;
          case 'community':
            return this.$lang.variables.community;
        }
        return this.$lang.variables.event;
      },
      accessibilityIcon() {
        const { group } = this;
        return group && group.accessibility === 'open'
          ? 'icon-lock_open'
          : 'icon-lock_close';
      },
      location() {
        const { group } = this;
        return group && group.location && group.location.location;
      },
      bannerStyles() {
        const { group } = this;
        return group && group.banner && group.banner.url && {
          'backgroundImage': `url(${group.banner.url})`,
        };
      },
      title() {
        const { group } = this;
        return group && group.name;
      },
      description() {
        const { group } = this;
        return group && group.desc;
      },
      shortedDescription() {
        const { description } = this;
        return description && this.$textLength(description, 20);
      },
      subject() {
        const { group } = this;
        return group && group.subject;
      },
      shortedSubject() {
        const { subject } = this;
        return subject && this.$textLength(subject, 20);
      },
      startDate() {
        const { group } = this;
        return group && group.event_dates && group.event_dates.start_date && this.formatDate(group.event_dates.start_date);
      },
      endDate() {
        const { group } = this;
        return group && group.event_dates && group.event_dates.end_date && this.formatDate(group.event_dates.end_date);
      },
      logoSource() {
        const { group } = this;
        return group && group.logo && group.logo.url_medium;
      },
      subscribeButtonClasses() {
        const { user, isAtLeastRequestedParticipation } = this;

        return {
          'icon-plus-guy-f': isAtLeastRequestedParticipation,
          'icon-plus-guy': !isAtLeastRequestedParticipation,
          disabled : user && user.status === 'guest',
        };
      },
      bannerLocationClasses() {
        return {
          'group-banner-list-item': true,
          'group-banner-list-item_align-right': this.isGroup,
          'group-banner-list-item_reverse': this.isGroup,
          'group-banner-list-item_align-left': this.isCommunity,
        };
      },
      descriptionClasses() {
        return {
          'group-banner-list-item': true,
          'group-banner-list-item_align-right': this.isGroup,
          'group-banner-list-item_reverse': this.isGroup,
          'group-banner-list-item_align-left': this.isCommunity,
        };
      },
      logoClasses() {
        return {
          'group-banner__logo': true,
          'group-banner__logo_community': this.isCommunity,
        };
      },
      subBannerClasses() {
        return {
          'group-sub-banner': true,
          'group-sub-banner_community': this.isCommunity,
          'group-sub-banner_event': this.isEvent,
        };
      },
      bannerListClasses() {
        return {
          'group-banner-list': true,
          'group-banner-list_community': this.isCommunity,
          'group-banner-list_event': this.isEvent,
        };
      },
    },
    methods: {
      subscribeButtonClickHandler() {
        if(this.isAtLeastRequestedParticipation) {
          this.$emit('request:unsubscribe');
        } else {
          this.$emit('request:subscribe');
        }
      },
      openGroupUsersPage() {
        const { group } = this;
        group && this.$router.push('/group/' + group.slug + '/user');
      },
      openGroupPostPage() {
        const { group } = this;
        group && this.$router.push('/groups/' + group.slug);
      },
      showDescription() {
        this.$modal.show('groupDescModal');
      },
      showSubject() {
        this.$modal.show('groupSubjectModal');
      },
      formatDate(timeStamp) {
        const date = new Date(timeStamp);
        return moment(date).format('DD:MM:YYYY / hh:mm')
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  @logo-size: 25vw;

  .group-banner {
    position: relative;
    height: 35vw;
    &__background {
      position: absolute;
      background-position: center;
      background-size: cover;
      text-align: center;
      z-index: -1;
      height: 100%;
      width: 100%;
    }

    &__black-gradient {
      background: linear-gradient(transparent, #000);
      opacity: .7;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      content: "";
      z-index: -1;
    }
  }

  .group-banner-list {
    display: flex;
    flex-flow: row;
    position: absolute;
    width: 100%;
    bottom: 5px;
    justify-content: space-between;
  }

  .group-banner-list__column {
    width: 50vw - @logo-size/2 - 2vw;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
  }

  .group-banner-list_community {
    width: calc(100% - @logo-size - 7vw);
    padding-left: @logo-size + 7vw;
  }

  .group-banner-list-item {
    display: flex;
    align-items: center;
    padding: 0 0 6px 0;
  }

  .group-banner-list-item__icon {
    padding: 0 5px;
    .text-grad();
    font-size: 20px;
  }

  .group-banner-list-item__text {
    color: #f4f4f4;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .group-banner-list-item_align-right {
    justify-content: flex-end;
  }
  .group-banner-list-item_align-left {
    justify-content: flex-start;
  }
  .group-banner-list-item_align-right.group-banner-list-item_reverse {
    justify-content: flex-start;
  }
  .group-banner-list-item_align-left.group-banner-list-item_reverse {
    justify-content: flex-end;
  }
  .group-banner-list-item_reverse {
    flex-flow: row-reverse;
  }

  .group-banner-list-item_event-sub-banner {
    padding: 1px 0;

    .group-banner-list-item__text {
      color: black;
      font-size: 13px;
      font-weight: bold;
    }
    .group-banner-list-item__icon {
      .disable-text-grad();
      color: black;
      font-size: 15px;
    }
  }

  .group-banner__logo {
    position: absolute;
    bottom: -@logo-size / 2;
    left: 50vw - @logo-size / 2;
    width: @logo-size;
    height: @logo-size;
    margin: auto;
    border-radius: 5px;
    border: 1px solid #fff;
  }

  .group-banner__logo_community {
    left: 5vw;
  }

  .group-sub-banner {
    height: @logo-size / 2;
    padding: 4px 0;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
  }

  .group-sub-banner__column {
    width: 50vw - @logo-size/2 - 2vw;
  }

  .group-sub-banner_event .group-sub-banner__column {
    @firstAndLastColumnsWidth: 38vw;

    &:nth-child(1), &:nth-child(3) {
      width: @firstAndLastColumnsWidth;
    }
    &:nth-child(2) {
      width: 100vw - @firstAndLastColumnsWidth * 2;
    }
  }

  .group-sub-banner_community {
    padding-left: @logo-size + 7vw;
  }

  .group-heading-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    color: @middle_grey;
    position: relative;
    padding: 3px 0 0 7px;
    width: 50vw - @logo-size/2 - 2vw;
  }

  .group-heading-info__title {
    color: @black;
  }

  .group-heading-info__subject, .group-heading-info__title {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
  }

  .group-buttons {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 50vw - @logo-size/2 - 2vw;
  }

  .subscribe-button {
    display: flex;
    justify-content: center;
    align-items: center;
    &__icon {
      .text-grad();
      font-size: 29px;
    }
  }

  .add-post-button {
    display: flex;
    justify-content: center;
    align-items: center;
    &__icon {
      .text-grad();
      font-size: 22px;
    }
  }

  .banner-settings {
    position: absolute;
    bottom: 0;
    width: 44%;

    .sub-banner {

      .solo--logo {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 12;
        width: 20vw;
      }

      .banner-solo--info {
        width: 40vw;
        align-items: center;

        p {
          color: @black;
          margin: 2px 0;
        }
      }

      .banner-logo {
        width: 100%;
        border-radius: 5px;
        border: 1px solid #fff;
      }

      .banner-subscribe {
        display: flex;
        width: 40vw;
        justify-content: space-evenly;
        align-items: center;
      }
    }
  }
</style>
