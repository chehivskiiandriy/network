<template>
  <div id="group-users">
    <div class="users-header">
      <div class="title">{{title}}</div>
      <i
        @click="goBack()"
        class="icon-left-f icon-back"></i>
      <router-link :to="'/group/'+this.groupSlug+'/invite'">
        <i class="icon-plus-f"></i>
      </router-link>
    </div>
    <div v-if="group" class="margin-top-small">
      <in-tabs
        v-if="shouldShowTabs"
        :active-tab="activeTab" @update:active-tab="changeTab">
        <in-tab name="subscribers">
          <span class="tab-name">{{$lang.variables.subscribers}}</span>
        </in-tab>
        <in-tab
          v-if="shouldShowRequestsTab"
          name="requests">
          <span class="tab-name">{{$lang.variables.requests}}</span>
          <span
            v-if="group.requests_count > 0"
            class="requests-count">({{group.requests_count}})</span>
        </in-tab>
        <in-tab
          v-if="shouldShowBlacklistTab"
          name="blacklist">
          <span class="tab-name">{{$lang.variables.blackList}}</span>
        </in-tab>
      </in-tabs>
    </div>

    <div class="group-users-card">
      <in-user-card
        v-for="user in users"
        :key="user.nickname">
        <div class="user-card">
          <div class="user-card-avatar">
            <img
              class="user-card-avatar-preview"
              :src="user.avatar_image.url_medium"
              @click="goToUser(user.nickname)">
          </div>
          <div class="user-card-info">
            <div class="user-card-info-container">
              <p class="user-card-nickname-wrapper">
                <in-nickname tag="p" class="user-card-nickname user-card-nickname_group" :status="user.status">{{user.nickname}}
                </in-nickname>
                <span class="user-card-role">
                  {{getUserRole(user)}}
                </span>
              </p>
              <p class="user-card-name">
                <span v-text="user.name"></span>
                <span v-text="user.lastname"></span>
              </p>
            </div>
          </div>
          <div class="user-card-actions">
            <i
              v-if="activeTab === 'subscribers' && getShouldShowMenuButton(user)"
              class="icon-actions icon-vvv"
              @click="showSettings(user)"></i>
            <i
              v-if="activeTab === 'requests'"
              class="icon-actions icon-check-f"
              @click="approveUser(user.id, 1)"></i>
            <i
              v-if="activeTab === 'requests'"
              class="icon-actions icon-delete-f"
              @click="approveUser(user.id, 0)"></i>
            <i
              v-if="activeTab === 'blacklist'"
              class="icon-actions icon-delete-f"
              @click="removeUserFromBlackListHandler(user.id)"></i>
          </div>
        </div>
      </in-user-card>
    </div>
    <in-spinner :loading="loading || addLoading" />
    <in-bottom-menu :show.sync="isShowUserSettingsMenu">
      <in-bottom-menu-section>
        <in-bottom-menu-item
          v-if="getShouldShowAppointAsAModeratorMenuItem(activeUser)"
          @action="appointAsAModeratorHandler">
          {{$lang.variables.appointAsAModerator}}
        </in-bottom-menu-item>
        <in-bottom-menu-item
          v-if="getShouldShowRemoveFromModeratorsMenuItem(activeUser)"
          @action="removeFromModeratorsHandler">
          {{$lang.variables.removeFromModerators}}
        </in-bottom-menu-item>
        <in-bottom-menu-item
          v-if="getShouldShowAddToBlacklistMenuItem(activeUser)"
          @action="addToBlackListHandler">
          {{$lang.variables.addToBlackList}}
        </in-bottom-menu-item>
        <in-bottom-menu-item
          v-if="getShouldShowRemoveFromGroupMenuItem(activeUser)"
          @action="removeFromGroupHandler">
          {{$lang.variables.removeFromGroup}}
        </in-bottom-menu-item>
      </in-bottom-menu-section>
    </in-bottom-menu>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'

  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";

  import {
    AUTH_USER,
    moduleName as userModuleName,
  } from 'Store/modules/authUser/user';

  import {CURRENT_GROUP, FETCH_CURRENT_GROUP, moduleName as groupsModule} from "Store/modules/groups/groups";
  import {
    FETCH_GROUP_USERS,
    FETCH_GROUP_USERS_NEXT_PAGE,
    GROUP_USERS,
    APPOINT_AS_A_MODERATOR,
    REMOVE_FROM_MODERATORS,
    REMOVE_FROM_GROUP,
    REMOVE_ERROR as REMOVE_FROM_GROUP_ERROR,
    LOADING as USERS_LOADING,
    moduleName as groupUsersModule
  } from "Store/modules/groups/groupUsers"
  import {
    APPROVE_USER,
    FETCH_GROUP_REQUESTS,
    FETCH_GROUP_REQUESTS_NEXT_PAGE,
    GROUP_REQUESTS,
    LOADING as REQUESTS_LOADING,
    moduleName as groupRequestsModule
  } from "Store/modules/groups/groupRequests"

  import {
    FETCH_GROUP_BLACKLIST,
    FETCH_GROUP_BLACKLIST_NEXT_PAGE,
    ADD_USER_TO_BLACKLIST,
    REMOVE_USER_FROM_BLACKLIST,
    BLACKLIST,
    ADD_LOADING,
    ADD_ERROR,
    REMOVE_LOADING,
    REMOVE_ERROR as REMOVE_FROM_BLACKLIST_ERROR,
    LOADING as BLACKLIST_LOADING,
    moduleName as groupBlacklistModule
  } from 'Store/modules/groups/groupBlacklist';

  import GroupAccess from 'utils/GroupAccess';

  export default {
    name: "groupUsers",
    mixins: [scrollOnBottom],
    data() {
      return {
        groupSlug: this.$route.params.group_slug,
        activeTab: 'subscribers',
        activeUser: null,
        isActiveUser: false,
        isShowUserSettingsMenu: false,
        //groupAccess: null,
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchNext();
        }
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModuleName + AUTH_USER,
        groupInfo: groupsModule + CURRENT_GROUP,
        subscribers: groupUsersModule + GROUP_USERS,
        requests: groupRequestsModule + GROUP_REQUESTS,
        blacklist: groupBlacklistModule + BLACKLIST,
        usersLoading: groupUsersModule + USERS_LOADING,
        requestsLoading: groupRequestsModule + REQUESTS_LOADING,
        blacklistLoading: groupBlacklistModule + BLACKLIST_LOADING,
        addLoading: groupBlacklistModule + ADD_LOADING,
        addError: groupBlacklistModule + ADD_ERROR,
        removeLoading: groupBlacklistModule + REMOVE_LOADING,
        removeFromBlacklistError: groupBlacklistModule + REMOVE_FROM_BLACKLIST_ERROR,
        removeFromGroupError: groupUsersModule + REMOVE_FROM_GROUP_ERROR,
      }),
      users() {
        if(this.activeTab === 'subscribers') {
          return this.subscribers(this.groupSlug).sort(this.subscribersSorter);
        } else if(this.activeTab === 'requests') {
          return this.requests(this.groupSlug);
        } else if(this.activeTab === 'blacklist') {
          return this.blacklist(this.groupSlug);
        }
      },
      loading() {
        if(this.activeTab === 'subscribers') {
          return this.usersLoading;
        } else if(this.activeTab === 'requests') {
          return this.requestsLoading;
        } else if(this.activeTab === 'requests') {
          return this.blacklistLoading;
        }
      },
      group() {
        return this.groupInfo(this.$route.params.group_slug);
      },
      title() {
        return (this.group && this.group.accessibility === 'closed')
          ? this.$lang.variables.subscribers + ' / ' + this.$lang.variables.requests
          : this.$lang.variables.subscribers

      },
      currentUserRole() {
        return this.group && this.group.group_user && this.group.group_user.role;
      },
      currentUserNickname() {
        return this.authUser.nickname;
      },
      isCurrentUserModerator() {
        return this.currentUserRole === 'moderator';
      },
      isCurrentUserAdmin() {
        return this.currentUserRole === 'admin';
      },
      isCurrentUserModeratorOrAdmin() {
        return this.isCurrentUserModerator || this.isCurrentUserAdmin;
      },
      shouldShowTabs() {
        return this.shouldShowRequestsTab || this.shouldShowBlacklistTab;
      },
      shouldShowRequestsTab() {
        const { group } = this;
        return group.accessibility === 'closed' && this.canIDo(null, 'accept-request');
      },
      shouldShowBlacklistTab() {
        const { group } = this;
        return group.accessibility === 'closed' && this.canIDo(null, 'blacklist');
      },
    },
    mounted() {
      // this.$root.$on('deleteFromUserRequest', (index) => {
      //   this.requests[index].group_user.role = null;
      //   this.requests.splice(index, 1);
      //   this.totalRequests--;
      // });
      this.getCurrentGroup(this.groupSlug);
      this.fetch();
    },
    methods: {
      ...mapActions({
        getCurrentGroup: groupsModule + FETCH_CURRENT_GROUP,
        fetchGroupUsers: groupUsersModule + FETCH_GROUP_USERS,
        fetchGroupUsersNextPage: groupUsersModule + FETCH_GROUP_USERS_NEXT_PAGE,
        appointAsAModerator: groupUsersModule + APPOINT_AS_A_MODERATOR,
        removeFromModerators: groupUsersModule + REMOVE_FROM_MODERATORS,
        removeFromGroup: groupUsersModule + REMOVE_FROM_GROUP,
        fetchGroupRequests: groupRequestsModule + FETCH_GROUP_REQUESTS,
        fetchGroupRequestsNextPage: groupRequestsModule + FETCH_GROUP_REQUESTS_NEXT_PAGE,
        approveUserAction: groupRequestsModule + APPROVE_USER,
        fetchGroupBlacklist: groupBlacklistModule + FETCH_GROUP_BLACKLIST,
        fetchGroupBlacklistNextPage: groupBlacklistModule + FETCH_GROUP_BLACKLIST_NEXT_PAGE,
        addUserToBlackList: groupBlacklistModule + ADD_USER_TO_BLACKLIST,
        removeUserFromBlackList: groupBlacklistModule + REMOVE_USER_FROM_BLACKLIST,
      }),
      fetch() {
        if (this.activeTab === 'subscribers') {
          this.fetchGroupUsers(this.groupSlug);
        } else if (this.activeTab === 'requests') {
          this.fetchGroupRequests(this.groupSlug);
        } else if (this.activeTab === 'blacklist') {
          this.fetchGroupBlacklist(this.groupSlug);
        }
      },
      fetchNext() {
        if (this.activeTab === 'subscribers') {
          this.fetchGroupUsersNextPage(this.groupSlug);
        } else if (this.activeTab === 'requests') {
          this.fetchGroupRequestsNextPage(this.groupSlug);
        } else if (this.activeTab === 'blacklist') {
          this.fetchGroupBlacklistNextPage(this.groupSlug);
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      approveUser(userId, approve) {
        const payload = {
          userId,
          approve,
          groupSlug: this.groupSlug
        };

        this.approveUserAction(payload);
      },
      goToUser(nickname) {
        this.$router.push('/u/' + nickname);
      },
      changeTab(tab) {
        this.activeTab = tab;
        this.fetch();
      },
      showSettings(user) {
        this.isShowUserSettingsMenu = true;
        this.activeUser = user;
      },
      async addToBlackListHandler() {
        this.isShowUserSettingsMenu = false;
        await this.addUserToBlackList({
          userId: this.activeUser.id,
          groupSlug: this.groupSlug,
        });
        if(this.addError) {
          this.notifyAboutActionError();
        }
      },
      async removeUserFromBlackListHandler(userId) {
        this.isShowUserSettingsMenu = false;
        await this.removeUserFromBlackList({
          userId,
          groupSlug: this.groupSlug,
        });
        if(this.removeFromBlacklistError) {
          this.notifyAboutActionError();
        }
      },
      async removeFromGroupHandler() {
        this.isShowUserSettingsMenu = false;

        await this.removeFromGroup({
          userId: this.activeUser.id,
          groupSlug: this.groupSlug,
        });
        if(this.removeFromGroupError) {
          this.notifyAboutActionError();
        }
      },
      async appointAsAModeratorHandler() {
        this.isShowUserSettingsMenu = false;
        await this.appointAsAModerator({
          userId: this.activeUser.id,
          groupSlug: this.groupSlug,
        });
      },
      async removeFromModeratorsHandler() {
        this.isShowUserSettingsMenu = false;
        await this.removeFromModerators({
          userId: this.activeUser.id,
          groupSlug: this.groupSlug,
        });
      },
      notifyAboutActionError() {
        this.$notify({
          group: 'action-error',
          duration: 3000,
          speed: 300
        });
      },
      getShouldShowMenuButton(user) {
        return this.getShouldShowAddToBlacklistMenuItem(user) ||
          this.getShouldShowAppointAsAModeratorMenuItem(user) ||
          this.getShouldShowRemoveFromModeratorsMenuItem(user);
      },
      canIDo(user, action) {
        return GroupAccess.canIDo(this.currentUserRole, this.currentUserNickname,
          user && user.group_user.role, user && user.nickname, action);
      },
      getShouldShowAddToBlacklistMenuItem(user) {
        return this.canIDo(user, 'blacklist');
      },
      getShouldShowAppointAsAModeratorMenuItem(user) {
        return this.canIDo(user, 'add-moderator') &&
          user && user.group_user.role !== 'moderator';
      },
      getShouldShowRemoveFromModeratorsMenuItem(user) {
        return this.canIDo(user, 'remove-moderator') &&
          user && user.group_user.role === 'moderator';
      },
      getShouldShowRemoveFromGroupMenuItem(user) {
        return this.canIDo(user, 'remove-from-group');
      },
      getUserRole(user) {
        switch(user && user.group_user && user.group_user.role) {
          case 'admin':
            return this.$lang.variables.admin;
          case 'moderator':
            return this.$lang.variables.moderator;
        }
      },
      subscribersSorter(subscriberLeft, subscriberRight) {
        const leftRole = subscriberLeft && subscriberLeft.group_user && subscriberLeft.group_user.role,
          rightRole = subscriberRight && subscriberRight.group_user && subscriberRight.group_user.role;
        if(leftRole === 'admin') {
          return -1;
        } else if (leftRole === 'moderator' && rightRole !== 'admin') {
          return -1;
        }
      }
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .group-users-card {
    display: flex;
    flex-direction: column;
    padding-top: 2px;
    margin: 5px;
  }

  .margin-top-small {
    margin-top: 5px;
  }

  .users-header {
    text-align: center;
    height: 40px;
    background: @grad;
    color: #fff;
    font-size: 4.5vw;
    padding: 5px 0;
    line-height: 30px;
    box-sizing: border-box;
    position: relative;

    .title {
      text-align: center;
      width: 100%;
    }

    .icon-back {
      position: absolute;
      top: 10px;
      left: 8px;
      color: #fff;
      font-size: 22px;
    }

    .icon-plus-f {
      position: absolute;
      color: #fff;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      font-size: 22px;
    }
  }

  .user-card-role {
    .text-grad();
    font-size: 2.85vw;
    margin-left: 2%;
  }

  .user-card-nickname-wrapper {
    margin: 0;
    display: block;
    text-align: left;
    width: 100%;
  }

  .user-card-nickname_group {
    width: unset !important;
    max-width: 50% !important;
    display: inline-flex !important;
  }
</style>
