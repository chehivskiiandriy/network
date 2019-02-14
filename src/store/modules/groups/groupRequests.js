import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

import {
  CHANGE_GROUP_REQUESTS_COUNT,
  CHANGE_GROUP_USER_COUNT,
  moduleName as groupsModule
} from "Store/modules/groups/groups"
import {CHANGE_IS_FETCH_NEW, moduleName as groupUsersModule} from "Store/modules/groups/groupUsers"

/**
 * Types
 * */
export const moduleName = 'groupRequests/';

/** Actions types*/
export const FETCH_GROUP_REQUESTS = 'FETCH_GROUP_REQUESTS';
export const FETCH_GROUP_REQUESTS_NEXT_PAGE = 'FETCH_GROUP_REQUESTS_NEXT_PAGE';
export const DELETE_GROUP_REQUEST = 'DELETE_GROUP_REQUEST';
export const APPROVE_USER = 'APPROVE_USER';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const LOADING = 'LOADING';
export const GROUP_REQUESTS = 'GROUP_REQUESTS';

const module = {
  namespaced: true,
  state: {
    groupRequests: {},
    groupRequestsMeta: {},
    groupRequestsIds: [],
    maxCount: 5,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_GROUP_REQUESTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_REQUESTS + SUCCESS](state, payload) {
      state.loading = false;
      state.groupRequests = {
        ...payload.groupRequestsTemp,
        [payload.groupSlug]: payload.res.data
      };
      state.groupRequestsMeta = {
        ...payload.groupRequestsMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupRequestsIds = [...payload.groupRequestsIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_REQUESTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_GROUP_REQUESTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_REQUESTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.groupRequests[payload.groupSlug].push(...payload.res.data);
      state.groupRequestsMeta = {
        ...payload.groupRequestsMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupRequestsIds = [...payload.groupRequestsIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_REQUESTS_NEXT_PAGE + ERROR](state, error) {
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
    [DELETE_GROUP_REQUEST + SUCCESS](state, payload) {
      state.groupRequests[payload.groupSlug] = state.groupRequests[payload.groupSlug].filter(item =>
        item.id !== payload.post_id
      );
    },
    [APPROVE_USER + REQUEST](state) {

    },
    [APPROVE_USER + SUCCESS](state, payload) {
      state.groupRequests[payload.groupSlug] = state.groupRequests[payload.groupSlug].filter(item =>
        item.id !== payload.userId
      );
    },
    [APPROVE_USER + ERROR](state, e) {

    }
  },
  actions: {
    async [FETCH_GROUP_REQUESTS]({commit, state}, payload) {
      if(state.groupRequests[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_GROUP_REQUESTS + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);

      try {
        let res = await api.groups.getGroupRequests(data);

        if(state.groupRequests[payload] && state.groupRequests[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.groupRequests[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let groupRequestsIdsOrder = state.groupRequestsIds.filter(id => id !== payload);
        let groupRequestsTemp = {...state.groupRequests};
        let groupRequestsMetaTemp = {...state.groupRequestsMeta};

        if(groupRequestsIdsOrder.length >= state.maxCount) {
          delete groupRequestsTemp[groupRequestsIdsOrder[0]];
          delete groupRequestsMetaTemp[groupRequestsIdsOrder[0]];
          groupRequestsIdsOrder = groupRequestsIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupRequestsIdsOrder,
          groupRequestsTemp,
          groupRequestsMetaTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_REQUESTS + SUCCESS, result);
      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_REQUESTS + ERROR, e.response);
      }
    },
    async [FETCH_GROUP_REQUESTS_NEXT_PAGE]({commit, state}, payload) {
      if(state.groupRequestsMeta[payload].lastPage < state.groupRequestsMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_GROUP_REQUESTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);
      data.append('page', state.groupRequestsMeta[payload].nextPage);

      try {
        let res = await api.groups.getGroupRequests(data);

        let groupRequestsIdsOrder = state.groupRequestsIds.filter(id => id !== payload);
        let groupRequestsTemp = {...state.groupRequests};
        let groupRequestsMetaTemp = {...state.groupRequestsMeta};

        if(groupRequestsIdsOrder.length >= state.maxCount) {
          delete groupRequestsTemp[groupRequestsIdsOrder[0]];
          delete groupRequestsMetaTemp[groupRequestsIdsOrder[0]];
          groupRequestsIdsOrder = groupRequestsIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupRequestsIdsOrder,
          groupRequestsTemp,
          groupRequestsMetaTemp
        };

        commit(FETCH_GROUP_REQUESTS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_GROUP_REQUESTS_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [APPROVE_USER]({commit}, payload) {
      commit(APPROVE_USER + REQUEST);

      const { userId, approve, groupSlug } = payload;

      const data = new FormData();
      data.append('group_slug', groupSlug);
      data.append('user_id', userId);
      data.append('apply', approve);

      try {
        let res = await api.groups.approveGroupUser(data);
        console.log(res);

        if(res.data.state) {
          commit(APPROVE_USER + SUCCESS, payload);

          const changePayload = {
           state: 1,
           groupSlug
          };

          commit(groupsModule + CHANGE_GROUP_REQUESTS_COUNT, groupSlug, { root: true });

          if(approve) {
            commit(groupsModule + CHANGE_GROUP_USER_COUNT, changePayload, { root: true });

            const fetchNewPayload = {
              state: true,
              groupSlug
            };
            commit(groupUsersModule + CHANGE_IS_FETCH_NEW, fetchNewPayload, { root: true });
          }
        }
      } catch (e) {
        console.log(e);
        commit(APPROVE_USER + ERROR, e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [GROUP_REQUESTS]: state => slug => {
      return state.groupRequests[slug]
    }
  }
};

export default module;
