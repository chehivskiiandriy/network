import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {
  moduleName as feedsModuleName,
  UNWATCHED_FEEDS,
  UNWATCHED_GIFTS_COUNT,
  VIEW_GIFT_FEEDS,
  SET_GIFT_FEEDS_COUNT,
} from 'Store/modules/feeds';

/**
 * Types
 * */
export const moduleName = 'gifts/';

/** Actions types*/
export const FETCH_MY_GIFTS = 'FETCH_MY_GIFTS';
export const FETCH_MY_GIFTS_NEXT_PAGE = 'FETCH_MY_GIFTS_NEXT_PAGE';
export const MARK_ALL_GIFTS_AS_SEEN = 'MARK_ALL_GIFTS_AS_SEEN';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const CHANGE_SUBSCRIBE_USER_GIFTS = 'CHANGE_SUBSCRIBE_USER_GIFTS';
export const FETCH = 'FETCH';
export const ACCEPT_USER_GIFT = 'ACCEPT_USER_GIFT';

/** Getters types*/
export const MY_GIFTS = 'MY_GIFTS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    gifts: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_MY_GIFTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MY_GIFTS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.gifts = payload.data;
    },
    [FETCH_MY_GIFTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_MY_GIFTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MY_GIFTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.gifts.push(...payload.data);
      // state.gifts = [...state.gifts, ...payload.data];
    },
    [FETCH_MY_GIFTS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [CHANGE_SUBSCRIBE_USER_GIFTS](state, payload) {
      state.gifts.forEach((item, i) => {
        if(state.gifts[i].sender.nickname === payload.nickname) {
          state.gifts[i].sender.is_subscribed = payload.state;
        }
      })
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    },
    [ACCEPT_USER_GIFT](state, payload) {
      state.gifts.forEach((item, i) => {
        if(state.gifts[i].id === payload) {
          state.gifts[i].is_accepted = true;
        }
      });
    }
  },
  actions: {
    async [FETCH_MY_GIFTS]({commit, state}) {
      if(state.gifts.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_MY_GIFTS + REQUEST);

      try {
        let res = await api.gifts.getMyGifts();

        if(state.gifts.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.gifts[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_MY_GIFTS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_MY_GIFTS + ERROR, e.response.data);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_MY_GIFTS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_MY_GIFTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('page', state.nextPage);

      try {
        let res = await api.gifts.getMyGifts(data);

        commit(FETCH_MY_GIFTS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_MY_GIFTS_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [MARK_ALL_GIFTS_AS_SEEN]({commit, state, rootGetters, dispatch}) {
      await dispatch(feedsModuleName + UNWATCHED_FEEDS, null, { root: true });
      const unwatchedGiftsCount = rootGetters[feedsModuleName + UNWATCHED_GIFTS_COUNT];
      commit(feedsModuleName + VIEW_GIFT_FEEDS, null, {root: true});

      try {
        const ids = [];
        let nextPage = 1;
        while(ids.length < unwatchedGiftsCount) {
          const userFeedsData = new FormData();
          userFeedsData.append('filter', JSON.stringify(['gift']));
          userFeedsData.append('page', JSON.stringify(nextPage));
          const userFeedsResponse = await api.user.getUserFeeds(userFeedsData);
          ids.push(...userFeedsResponse.data.data.map(({id}) => id));
          nextPage++;
        }

        const viewFeedsData = new FormData();
        viewFeedsData.append('ids', JSON.stringify(ids));
        const viewFeedsResponse = await api.user.viewFeeds(viewFeedsData),
          viewFeedsResponseState = viewFeedsResponse.data.state;

        if(viewFeedsResponseState === false) {
          commit(feedsModuleName + SET_GIFT_FEEDS_COUNT, { count: unwatchedGiftsCount }, {root: true});
          console.error('Error during mark all gifts as seen', viewFeedsResponse.data);
        }
      } catch (e) {
        commit(feedsModuleName + SET_GIFT_FEEDS_COUNT, { count: unwatchedGiftsCount }, {root: true});
        console.error('Error during mark all gifts as seen', e);
      }
    },
  },
  getters: {
    [MY_GIFTS](state) {
      return state.gifts
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
