import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

import {
  CHANGE_GROUP_REQUESTS_COUNT,
  CHANGE_GROUP_USER_COUNT,
  moduleName as groupsModule
} from "Store/modules/groups/groups"
import {CHANGE_IS_FETCH_NEW, DELETE_GROUP_USER, moduleName as groupUsersModule} from "Store/modules/groups/groupUsers"

/**
 * Types
 * */
export const moduleName = 'groupBlacklist/';

/** Actions types*/
export const FETCH_GROUP_BLACKLIST = 'FETCH_GROUP_BLACKLIST';
export const FETCH_GROUP_BLACKLIST_NEXT_PAGE = 'FETCH_GROUP_BLACKLIST_NEXT_PAGE';
export const ADD_USER_TO_BLACKLIST = 'ADD_USER_TO_BLACKLIST';
export const REMOVE_USER_FROM_BLACKLIST = 'REMOVE_USER_FROM_BLACKLIST';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const LOADING = 'LOADING';
export const BLACKLIST = 'BLACKLIST';
export const ADD_LOADING = 'ADD_LOADING';
export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_LOADING = 'REMOVE_LOADING';
export const REMOVE_ERROR = 'REMOVE_ERROR';

const module = {
  namespaced: true,
  state: {
    blacklist: {},
    blacklistMeta: {},
    blacklistIds: [],
    maxCount: 5,
    loading: false,
    showLoading: true,
    error: null,
    addAction: {
      loading: false,
      error: null,
    },
    removeAction: {
      loading: false,
      error: null,
    },
  },
  mutations: {
    [FETCH_GROUP_BLACKLIST + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_BLACKLIST + SUCCESS](state, payload) {
      state.loading = false;
      state.blacklist = {
        ...payload.blacklistTemp,
        [payload.groupSlug]: payload.res.data
      };
      state.blacklistMeta = {
        ...payload.blacklistMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.blacklistIds = [...payload.blacklistIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_BLACKLIST + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_GROUP_BLACKLIST_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_BLACKLIST_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.blacklist[payload.groupSlug].push(...payload.res.data);
      state.blacklistMeta = {
        ...payload.blacklistMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.blacklistIds = [...payload.blacklistIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_BLACKLIST_NEXT_PAGE + ERROR](state, error) {
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
    [REMOVE_USER_FROM_BLACKLIST + REQUEST](state) {
      state.removeAction.loading = true;
      state.removeAction.error = null;
    },
    [REMOVE_USER_FROM_BLACKLIST + SUCCESS](state, { groupSlug, userId }) {
      state.removeAction.loading = false;
      state.removeAction.error = null;
      state.blacklist[groupSlug] = state.blacklist[groupSlug].filter(item =>
        item.id !== userId
      );
    },
    [REMOVE_USER_FROM_BLACKLIST + ERROR](state, e) {
      state.removeAction.loading = false;
      state.removeAction.error = e;
    },
    [ADD_USER_TO_BLACKLIST + REQUEST](state) {
      state.addAction.loading = true;
      state.addAction.error = null;
    },
    [ADD_USER_TO_BLACKLIST + SUCCESS](state, { groupSlug, userId }) {
      state.addAction.loading = false;
      state.addAction.error = null;
      if(!state.blacklist.hasOwnProperty(groupSlug)) {
        state.blacklist[groupSlug] = [];
      }
      state.blacklist[groupSlug].push(userId);
    },
    [ADD_USER_TO_BLACKLIST + ERROR](state, e) {
      state.addAction.loading = false;
      state.addAction.error = e;
    },
  },
  actions: {
    async [FETCH_GROUP_BLACKLIST]({commit, state}, payload) {
      if(state.blacklist[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_GROUP_BLACKLIST + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);

      try {
        let res = await api.groups.getBlacklist(data);

        if(state.blacklist[payload] && state.blacklist[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.blacklist[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let blacklistIdsOrder = state.blacklistIds.filter(id => id !== payload);
        let blacklistTemp = {...state.blacklist};
        let blacklistMetaTemp = {...state.blacklistMeta};

        if(blacklistIdsOrder.length >= state.maxCount) {
          delete blacklistTemp[blacklistIdsOrder[0]];
          delete blacklistMetaTemp[blacklistIdsOrder[0]];
          blacklistIdsOrder = blacklistIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          blacklistIdsOrder,
          blacklistTemp,
          blacklistMetaTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_BLACKLIST + SUCCESS, result);
      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_BLACKLIST + ERROR, e.response);
      }
    },
    async [FETCH_GROUP_BLACKLIST_NEXT_PAGE]({commit, state}, payload) {
      if(state.blacklistMeta[payload].lastPage < state.blacklistMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_GROUP_BLACKLIST_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);
      data.append('page', state.blacklistMeta[payload].nextPage);

      try {
        let res = await api.groups.getBlacklist(data);

        let blacklistIdsOrder = state.blacklistIds.filter(id => id !== payload);
        let blacklistTemp = {...state.blacklist};
        let blacklistMetaTemp = {...state.blacklistMeta};

        if(blacklistIdsOrder.length >= state.maxCount) {
          delete blacklistTemp[blacklistIdsOrder[0]];
          delete blacklistMetaTemp[blacklistIdsOrder[0]];
          blacklistIdsOrder = blacklistIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          blacklistIdsOrder,
          blacklistTemp,
          blacklistMetaTemp
        };

        commit(FETCH_GROUP_BLACKLIST_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_GROUP_BLACKLIST_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [ADD_USER_TO_BLACKLIST]({commit}, { userId, groupSlug }) {
      commit(ADD_USER_TO_BLACKLIST + REQUEST);

      try {
        let res = await api.groups.addUserToBlackList({
          group_slug: groupSlug,
          user_id: userId,
        });
        console.log(res);

        if(res.data.state) {
          commit(ADD_USER_TO_BLACKLIST + SUCCESS, {
            groupSlug,
            userId,
          });

          const changePayload = {
            state: -1,
            groupSlug
          };

          commit(groupsModule + CHANGE_GROUP_USER_COUNT, changePayload, {root: true});

          const fetchNewPayload = {
            state: true,
            groupSlug
          };
          commit(groupUsersModule + DELETE_GROUP_USER + SUCCESS, {
            post_id: userId,
            groupSlug,
          }, {root: true});
          commit(groupUsersModule + CHANGE_IS_FETCH_NEW, fetchNewPayload, {root: true});
        }
      } catch (e) {
        console.log(e);
        commit(ADD_USER_TO_BLACKLIST + ERROR, e);
      }
    },
    async [REMOVE_USER_FROM_BLACKLIST]({commit}, { userId, groupSlug }) {
      commit(REMOVE_USER_FROM_BLACKLIST + REQUEST);

      try {
        let res = await api.groups.removeUserFromBlackList({
          group_slug: groupSlug,
          user_id: userId,
        });

        if(res.data.state) {
          commit(REMOVE_USER_FROM_BLACKLIST + SUCCESS, { groupSlug, userId });
        }
      } catch (e) {
        console.log(e);
        commit(REMOVE_USER_FROM_BLACKLIST + ERROR, e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [BLACKLIST]: state => slug => {
      return state.blacklist[slug]
    },
    [ADD_LOADING](state) {
      return state.addAction.loading;
    },
    [ADD_ERROR](state) {
      return state.addAction.error;
    },
    [REMOVE_LOADING](state) {
      return state.removeAction.loading
    },
    [REMOVE_ERROR](state) {
      return state.removeAction.error
    },
  }
};

export default module;
