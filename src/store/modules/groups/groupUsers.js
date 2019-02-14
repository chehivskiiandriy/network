import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

/**
 * Types
 * */
export const moduleName = 'groupUsers/';

/** Actions types*/
export const FETCH_GROUP_USERS = 'FETCH_GROUP_USERS';
export const FETCH_GROUP_USERS_NEXT_PAGE = 'FETCH_GROUP_USERS_NEXT_PAGE';
export const DELETE_GROUP_USER = 'DELETE_GROUP_USER';
export const APPOINT_AS_A_MODERATOR = 'APPOINT_AS_A_MODERATOR';
export const REMOVE_FROM_MODERATORS = 'REMOVE_FROM_MODERATORS';
export const REMOVE_FROM_GROUP = 'REMOVE_FROM_GROUP';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const ADD_USER_TO_GROUP = 'ADD_USER_TO_GROUP';
export const CHANGE_IS_FETCH_NEW = 'CHANGE_IS_FETCH_NEW';
export const RESET_GROUP_USERS = 'RESET_GROUP_USERS';

/** Getters types*/
export const LOADING = 'LOADING';
export const GROUP_USERS = 'GROUP_USERS';
export const REMOVE_ERROR = 'REMOVE_ERROR';

const module = {
  namespaced: true,
  state: {
    groupUsers: {},
    groupUsersMeta: {},
    groupUsersIds: [],
    maxCount: 5,
    loading: false,
    showLoading: true,
    error: null,
    appointAsAModeratorAction: {
      loading: false,
      error: null,
    },
    removeFromModeratorsAction: {
      loading: false,
      error: null,
    },
    removeFromGroupAction: {
      loading: false,
      error: null,
    },
  },
  mutations: {
    [FETCH_GROUP_USERS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_USERS + SUCCESS](state, payload) {
      state.loading = false;
      state.groupUsers = {
        ...payload.groupUsersTemp,
        [payload.groupSlug]: payload.res.data
      };
      state.groupUsersMeta = {
        ...payload.groupUsersMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          isFetchNew: false
        }
      };
      state.groupUsersIds = [...payload.groupUsersIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_USERS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_GROUP_USERS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_USERS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.groupUsers[payload.groupSlug].push(...payload.res.data);
      state.groupUsersMeta = {
        ...payload.groupUsersMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          isFetchNew: state.groupUsersMeta[payload.groupSlug].isFetchNew
        }
      };
      state.groupUsersIds = [...payload.groupUsersIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_USERS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    },
    [ADD_USER_TO_GROUP](state, payload) {
      const {data, groupSlug} = payload;

      if(state.groupUsers[groupSlug]) {
        state.groupUsers = {
          ...state.groupUsers,
          [groupSlug]: [...data, ...state.groupUsers[groupSlug]]
        };
      }
    },
    [DELETE_GROUP_USER + SUCCESS](state, payload) {
      state.groupUsers[payload.groupSlug] = state.groupUsers[payload.groupSlug].filter(item =>
        item.id !== payload.post_id
      );
    },
    [CHANGE_IS_FETCH_NEW](state, payload) {
      if(state.groupUsersMeta[payload.groupSlug]) {
        state.groupUsersMeta[payload.groupSlug].isFetchNew = payload.state;
      }
    },
    [RESET_GROUP_USERS](state, payload) {
      if(state.groupUsers[payload]) {
        state.groupUsers[payload] = [];
      }
    },
    [APPOINT_AS_A_MODERATOR + REQUEST] (state) {
      state.appointAsAModeratorAction.loading = true;
      state.appointAsAModeratorAction.error = null;
    },
    [APPOINT_AS_A_MODERATOR + SUCCESS] (state, {
      groupSlug,
      userId,
    }) {
      state.appointAsAModeratorAction.loading = false;
      state.appointAsAModeratorAction.error = null;
      for(const user of state.groupUsers[groupSlug]) {
        if (user.id === userId) {
          user.group_user.role = 'moderator';
        }
      }
    },
    [APPOINT_AS_A_MODERATOR + ERROR] (state, error) {
      state.appointAsAModeratorAction.loading = false;
      state.appointAsAModeratorAction.error = error;
    },
    [REMOVE_FROM_MODERATORS + REQUEST] (state) {
      state.removeFromModeratorsAction.loading = true;
      state.removeFromModeratorsAction.error = null;
    },
    [REMOVE_FROM_MODERATORS + SUCCESS] (state, {
      groupSlug,
      userId,
    }) {
      state.removeFromModeratorsAction.loading = false;
      state.removeFromModeratorsAction.error = null;
      for(const user of state.groupUsers[groupSlug]) {
        if (user.id === userId) {
          user.group_user.role = 'participant';
        }
      }
    },
    [REMOVE_FROM_MODERATORS + ERROR] (state, error) {
      state.removeFromModeratorsAction.loading = false;
      state.removeFromModeratorsAction.error = error;
    },
    [REMOVE_FROM_GROUP + REQUEST] (state) {
      state.removeFromGroupAction.loading = true;
      state.removeFromGroupAction.error = null;
    },
    [REMOVE_FROM_GROUP + SUCCESS] (state, {
      groupSlug,
      userId,
    }) {
      state.removeFromGroupAction.loading = false;
      state.removeFromGroupAction.error = null;
      state.groupUsers[groupSlug] = state.groupUsers[groupSlug].filter(({ id }) => id !== userId);
    },
    [REMOVE_FROM_GROUP + ERROR] (state, error) {
      state.removeFromGroupAction.loading = false;
      state.removeFromGroupAction.error = error;
    },
  },
  actions: {
    async [FETCH_GROUP_USERS]({commit, state}, payload) {
      if(state.groupUsers[payload] && state.groupUsersMeta[payload] && !state.groupUsersMeta[payload].isFetchNew) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
        commit(RESET_GROUP_USERS, payload)
      }
      commit(FETCH_GROUP_USERS + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);

      try {
        let res = await api.groups.getGroupUsers(data);

        if(state.groupUsersMeta[payload] && !state.groupUsersMeta[payload].isFetchNew && state.groupUsers[payload] && state.groupUsers[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.groupUsers[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let groupUsersIdsOrder = state.groupUsersIds.filter(id => id !== payload);
        let groupUsersTemp = {...state.groupUsers};
        let groupUsersMetaTemp = {...state.groupUsersMeta};

        if(groupUsersIdsOrder.length >= state.maxCount) {
          delete groupUsersTemp[groupUsersIdsOrder[0]];
          delete groupUsersMetaTemp[groupUsersIdsOrder[0]];
          groupUsersIdsOrder = groupUsersIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupUsersIdsOrder,
          groupUsersTemp,
          groupUsersMetaTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_USERS + SUCCESS, result);
      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_USERS + ERROR, e.response);
      }
    },
    async [FETCH_GROUP_USERS_NEXT_PAGE]({commit, state}, payload) {
      if(state.groupUsersMeta[payload].lastPage < state.groupUsersMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_GROUP_USERS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);
      data.append('page', state.groupUsersMeta[payload].nextPage);

      try {
        let res = await api.groups.getGroupUsers(data);

        let groupUsersIdsOrder = state.groupUsersIds.filter(id => id !== payload);
        let groupUsersTemp = {...state.groupUsers};
        let groupUsersMetaTemp = {...state.groupUsersMeta};

        if(groupUsersIdsOrder.length >= state.maxCount) {
          delete groupUsersTemp[groupUsersIdsOrder[0]];
          delete groupUsersMetaTemp[groupUsersIdsOrder[0]];
          groupUsersIdsOrder = groupUsersIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupUsersIdsOrder,
          groupUsersTemp,
          groupUsersMetaTemp
        };

        commit(FETCH_GROUP_USERS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_GROUP_USERS_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [DELETE_GROUP_USER]({commit}, payload) {
      commit(DELETE_GROUP_USER + REQUEST);

      const data = new FormData();
      data.append('group_id', payload.group_id);
      data.append('post_id', payload.post_id);

      try {
        await api.groups.deletePost(data);

        commit(DELETE_GROUP_USER + SUCCESS, payload);
        if(payload.onSuccess) payload.onSuccess();
      } catch (e) {
        console.log(e);
        commit(DELETE_GROUP_USER + ERROR, e);
      }
    },
    async [APPOINT_AS_A_MODERATOR]({commit}, {
      groupSlug,
      userId,
    }) {
      commit(APPOINT_AS_A_MODERATOR + REQUEST);

      try {
        await api.groups.setRoleForUser({
          group_slug: groupSlug,
          user_id: userId,
          role: 'moderator',
        });

        commit(APPOINT_AS_A_MODERATOR + SUCCESS, {
          groupSlug,
          userId,
        });
      } catch (e) {
        commit(APPOINT_AS_A_MODERATOR + ERROR, e);
      }
    },
    async [REMOVE_FROM_MODERATORS]({commit}, {
      groupSlug,
      userId,
    }) {
      commit(REMOVE_FROM_MODERATORS + REQUEST);

      try {
        await api.groups.setRoleForUser({
          group_slug: groupSlug,
          user_id: userId,
          role: 'participant',
        });

        commit(REMOVE_FROM_MODERATORS + SUCCESS, {
          groupSlug,
          userId,
        });
      } catch (e) {
        console.log(e);
        commit(REMOVE_FROM_MODERATORS + ERROR, e);
      }
    },
    async [REMOVE_FROM_GROUP]({commit}, {
      groupSlug,
      userId,
    }) {
      commit(REMOVE_FROM_GROUP + REQUEST);

      try {
        await api.groups.kickUserFromGroup({
          group_slug: groupSlug,
          user_id: userId,
        });

        commit(REMOVE_FROM_GROUP + SUCCESS, {
          groupSlug,
          userId,
        });
      } catch (e) {
        console.log(e);
        commit(REMOVE_FROM_GROUP + ERROR, e);
      }
    },
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [GROUP_USERS]: state => slug => {
      return state.groupUsers[slug]
    },
    [REMOVE_ERROR](state) {
      return state.removeFromGroupAction.error
    },
  }
};

export default module;
