import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */

export const moduleName = 'feeds/';

/** Actions types*/
export const FETCH_USER_FEEDS = 'FETCH_USER_FEEDS';
export const FETCH_USER_FEEDS_NEXT_PAGE = 'FETCH_USER_FEEDS_NEXT_PAGE';
export const CHANGE_FILTERS = 'CHANGE_FILTERS';
export const VIEW_FEEDS = 'VIEW_FEEDS';
export const VIEW_ALL_FEEDS = 'VIEW_ALL_FEEDS';
export const SHOW_FILTERS = 'SHOW_FILTERS';
export const HIDE_FILTERS = 'HIDE_FILTERS';
export const UNWATCHED_FEEDS = 'UNWATCHED_FEEDS';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const CHANGE_ACTIVE_FILTERS = 'CHANGE_ACTIVE_FILTERS';
export const ADD_FILTER = 'ADD_FILTER';
export const REMOVE_FILTER = 'REMOVE_FILTER';
export const ADD_CHANGE_FILTER = 'ADD_CHANGE_FILTER';
export const REMOVE_CHANGE_FILTER = 'REMOVE_CHANGE_FILTER';
export const CHANGE_SHOW_FILTERS = 'CHANGE_SHOW_FILTERS';
export const RESET_CHANGE_FILTER = 'RESET_CHANGE_FILTER';
export const RESET_USER_FEEDS = 'RESET_USER_FEEDS';
export const CHANGE_SUBSCRIBE_USER_FEEDS = 'CHANGE_SUBSCRIBE_USER_FEEDS';
export const FETCH = 'FETCH';
export const ADD_UNWATCHED_FEEDS = 'ADD_UNWATCHED_FEEDS';
export const ADD_UNWATCHED_GIFTS = 'ADD_UNWATCHED_GIFTS';
export const VIEW_GIFT_FEEDS = 'VIEW_GIFT_FEEDS';
export const SET_GIFT_FEEDS_COUNT = 'SET_GIFT_FEEDS_COUNT';

/** Getters types*/
export const MY_FEEDS = 'MY_FEEDS';
export const LOADING = 'LOADING';
export const ACTIVE_FILTERS = 'ACTIVE_FILTERS';
export const IS_SHOW_FILTERS = 'SHOW_FILTERS';
export const UNWATCHED_FEEDS_COUNT = 'UNWATCHED_FEEDS_COUNT';
export const UNWATCHED_GIFTS_COUNT = 'UNWATCHED_GIFTS_COUNT';

const module = {
  namespaced: true,
  state: {
    feeds: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null,
    activeFilters: [
      "like",
      "comment",
      "chin-chin",
      "follow",
      "gift",
      "rating-vote",
      "registration",
      // contest-vote,
      "group-invite",
      "mention",
      // new-contest,
      // gift-storage,
      "coins-received",
      "nick-mention-comment",
      "nick-mention-post",
      "nick-mention-status",
    ],

    showFilters: false,
    changeFilters: [], // for check if user change filters
    unwatchedFeedsCount: 0,
    unwatchedGiftsCount: 0
  },
  mutations: {
    [FETCH_USER_FEEDS + REQUEST](state) {
      state.loading = true;
      state.error = false;
    },
    [FETCH_USER_FEEDS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.feeds = payload.data;
    },
    [FETCH_USER_FEEDS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_USER_FEEDS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = false;
    },
    [FETCH_USER_FEEDS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.feeds.push(...payload.data);
    },
    [FETCH_USER_FEEDS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [CHANGE_ACTIVE_FILTERS](state, payload) {
      state.activeFilters = payload;
    },
    [VIEW_FEEDS + REQUEST](state) {

    },
    [VIEW_FEEDS + SUCCESS](state) {

    },
    [VIEW_FEEDS + ERROR](state, error) {
      state.error = payload;
    },
    [VIEW_ALL_FEEDS + REQUEST](state) {

    },
    [VIEW_ALL_FEEDS + SUCCESS](state) {
      state.unwatchedFeedsCount = 0;
      state.unwatchedGiftsCount = 0;
    },
    [VIEW_GIFT_FEEDS](state) {
      state.unwatchedFeedsCount -= state.unwatchedGiftsCount;
      state.unwatchedGiftsCount = 0;
    },
    [SET_GIFT_FEEDS_COUNT](state, { count }) {
      state.unwatchedGiftsCount = count;
      state.unwatchedFeedsCount += state.unwatchedGiftsCount;
    },
    [VIEW_ALL_FEEDS + ERROR](state, error) {
      state.error = error;
    },
    [ADD_FILTER](state, payload) {
      state.activeFilters.push(payload);
    },
    [REMOVE_FILTER](state, index) {
      state.activeFilters.splice(index, 1);
    },
    [ADD_CHANGE_FILTER](state, payload) {
      state.changeFilters.push(payload);
    },
    [REMOVE_CHANGE_FILTER](state, index) {
      state.changeFilters.splice(index, 1);
    },
    [RESET_CHANGE_FILTER](state) {
      state.changeFilters = [];
    },
    [RESET_USER_FEEDS](state) {
      state.feeds = [];
    },
    [CHANGE_SHOW_FILTERS](state, payload) {
      state.showFilters = payload;
    },
    [CHANGE_SUBSCRIBE_USER_FEEDS](state, payload) {
      state.feeds.forEach((item, i) => {
        if (state.feeds[i].entity.user.nickname === payload.nickname) {
          state.feeds[i].entity.user.is_subscribed = payload.state;
        }
      })
    },
    [UNWATCHED_FEEDS + REQUEST](state) {

    },
    [UNWATCHED_FEEDS + SUCCESS](state, payload) {
      state.unwatchedFeedsCount = payload.count;
      if (payload.by_type.gift) state.unwatchedGiftsCount = payload.by_type.gift;
    },
    [UNWATCHED_FEEDS + ERROR](state, error) {
      state.error = error;
    },
    [ADD_UNWATCHED_FEEDS](state) {
      state.unwatchedFeedsCount = state.unwatchedFeedsCount + 1;
    },
    [ADD_UNWATCHED_GIFTS](state) {
      state.unwatchedGiftsCount = state.unwatchedGiftsCount + 1;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    }
  },
  actions: {
    async [FETCH_USER_FEEDS]({commit, state, dispatch}) {
      if (state.feeds.length > 0 && state.unwatchedFeedsCount === 0 && state.changeFilters.length === 0) {
        commit(CHANGE_SHOW_LOADING, false);
      } else if (state.changeFilters.length > 0 || state.unwatchedFeedsCount > 0) {
        commit(RESET_USER_FEEDS);
      } else {
        let userFilters = JSON.parse(localStorage.getItem('feedFilters'));
        if (userFilters) commit(CHANGE_ACTIVE_FILTERS, userFilters);
      }
      commit(FETCH_USER_FEEDS + REQUEST);

      const data = new FormData();
      data.append('filter', JSON.stringify(state.activeFilters));

      try {
        let res = await api.user.getUserFeeds(data);

        if (state.feeds.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.feeds[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_USER_FEEDS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);

        dispatch(VIEW_ALL_FEEDS);
      } catch (e) {
        commit(FETCH_USER_FEEDS + ERROR, e.response.data);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_USER_FEEDS_NEXT_PAGE]({commit, state}) {
      if (state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_USER_FEEDS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('page', state.nextPage);
      data.append('filter', JSON.stringify(state.activeFilters));

      try {
        let res = await api.user.getUserFeeds(data);

        commit(FETCH_USER_FEEDS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_USER_FEEDS_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [VIEW_FEEDS]({commit}, payload) {
      commit(VIEW_FEEDS + REQUEST);
      const data = new FormData();
      data.append('ids', JSON.stringify(payload));

      try {
        await api.user.viewFeeds(data);

        commit(VIEW_FEEDS + SUCCESS);
      } catch (e) {
        commit(VIEW_FEEDS + ERROR, e.response);
      }
    },
    async [VIEW_ALL_FEEDS]({commit}) {
      commit(VIEW_ALL_FEEDS + REQUEST);
      const data = new FormData();
      data.append('all', '1');

      try {
        await api.user.viewFeeds(data);

        commit(VIEW_ALL_FEEDS + SUCCESS);
      } catch (e) {
        commit(VIEW_ALL_FEEDS + ERROR, e.response);
      }
    },
    [SHOW_FILTERS]({commit}) {
      commit(CHANGE_SHOW_FILTERS, true);
      commit(RESET_CHANGE_FILTER);
      document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    },
    [HIDE_FILTERS]({commit, state, dispatch}) {
      commit(CHANGE_SHOW_FILTERS, false);
      document.getElementsByTagName('html')[0].style.overflow = 'auto';

      if (state.changeFilters.length > 0) {
        dispatch(FETCH_USER_FEEDS);
      }
    },
    [CHANGE_FILTERS]({commit, state}, payload) {
      const index = state.activeFilters.indexOf(payload);

      if (index === -1) {
        commit(ADD_FILTER, payload);
      } else {
        commit(REMOVE_FILTER, index);
      }

      const indexChange = state.changeFilters.indexOf(payload);

      if (indexChange === -1) {
        commit(ADD_CHANGE_FILTER, payload);
      } else {
        commit(REMOVE_CHANGE_FILTER, index);
      }

      localStorage.setItem('feedFilters', JSON.stringify(state.activeFilters));
    },
    async [UNWATCHED_FEEDS]({commit}) {
      commit(UNWATCHED_FEEDS + REQUEST);

      try {
        const res = await api.user.unwatchedFeeds();

        commit(UNWATCHED_FEEDS + SUCCESS, res.data);
      } catch (e) {
        commit(UNWATCHED_FEEDS + ERROR, e.response);
      }
    }
  },
  getters: {
    [MY_FEEDS](state) {
      return state.feeds
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [ACTIVE_FILTERS](state) {
      return state.activeFilters
    },
    [IS_SHOW_FILTERS](state) {
      return state.showFilters
    },
    [UNWATCHED_FEEDS_COUNT](state) {
      return state.unwatchedFeedsCount
    },
    [UNWATCHED_GIFTS_COUNT](state) {
      return state.unwatchedGiftsCount
    }
  }
};

export default module;
