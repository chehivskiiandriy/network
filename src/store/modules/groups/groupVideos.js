import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

/**
 * Types
 * */
export const moduleName = 'groupVideos/';

/** Actions types*/
export const FETCH_GROUP_VIDEOS = 'FETCH_GROUP_VIDEOS';
export const FETCH_GROUP_VIDEOS_NEXT_PAGE = 'FETCH_GROUP_VIDEOS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const LOADING = 'LOADING';
export const GROUP_VIDEOS = 'GROUP_VIDEOS';
export const ERRORS = 'ERRORS';

const module = {
  namespaced: true,
  state: {
    groupVideos: {},
    groupVideosMeta: {},
    groupVideosIds: [],
    maxCount: 5,
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_GROUP_VIDEOS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_VIDEOS + SUCCESS](state, payload) {
      state.loading = false;
      state.groupVideos = {
        ...payload.groupVideosTemp,
        [payload.groupSlug]: payload.res.data
      };
      state.groupVideosMeta = {
        ...payload.groupVideosMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupVideosIds = [...payload.groupVideosIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_VIDEOS + ERROR](state, error) {
      state.loading = false;
      console.error(error);
      state.error = error.data.message;
    },
    [FETCH_GROUP_VIDEOS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_VIDEOS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.groupVideos[payload.groupSlug].push(...payload.res.data);
      state.groupVideosMeta = {
        ...payload.groupVideosMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupVideosIds = [...payload.groupVideosIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_VIDEOS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      console.error(error);
      state.error = error.data.message;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    }
  },
  actions: {
    async [FETCH_GROUP_VIDEOS]({commit, state}, payload) {
      if(state.groupVideos[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_GROUP_VIDEOS + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);

      try {
        let res = await api.groups.getGroupVideos(data);

        if(state.groupVideos[payload] && state.groupVideos[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.groupVideos[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let groupVideosIdsOrder = state.groupVideosIds.filter(id => id !== payload);
        let groupVideosTemp = {...state.groupVideos};
        let groupVideosMetaTemp = {...state.groupVideosMeta};

        if(groupVideosIdsOrder.length >= state.maxCount) {
          delete groupVideosTemp[groupVideosIdsOrder[0]];
          delete groupVideosMetaTemp[groupVideosIdsOrder[0]];
          groupVideosIdsOrder = groupVideosIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupVideosIdsOrder,
          groupVideosTemp,
          groupVideosMetaTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_VIDEOS + SUCCESS, result);
      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_VIDEOS + ERROR, e.response);
      }
    },
    async [FETCH_GROUP_VIDEOS_NEXT_PAGE]({commit, state}, payload) {
      if(state.groupVideosMeta[payload].lastPage < state.groupVideosMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_GROUP_VIDEOS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);
      data.append('page', state.groupVideosMeta[payload].nextPage);

      try {
        let res = await api.groups.getGroupVideos(data);

        let groupVideosIdsOrder = state.groupVideosIds.filter(id => id !== payload);
        let groupVideosTemp = {...state.groupVideos};
        let groupVideosMetaTemp = {...state.groupVideosMeta};

        if(groupVideosIdsOrder.length >= state.maxCount) {
          delete groupVideosTemp[groupVideosIdsOrder[0]];
          delete groupVideosMetaTemp[groupVideosIdsOrder[0]];
          groupVideosIdsOrder = groupVideosIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupVideosIdsOrder,
          groupVideosTemp,
          groupVideosMetaTemp
        };

        commit(FETCH_GROUP_VIDEOS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_GROUP_VIDEOS_NEXT_PAGE + ERROR, e.response);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [GROUP_VIDEOS]: state => slug => {
      return state.groupVideos[slug]
    },
    [ERRORS](state) {
      return state.error;
    }
  }
};

export default module;
