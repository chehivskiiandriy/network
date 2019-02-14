import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'postNavigation/';

/** Actions types*/
export const FETCH_PREV_POSTS = 'FETCH_PREV_POSTS';
export const FETCH_NEXT_POSTS = 'FETCH_NEXT_POSTS';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const RESET_POST_NAVIGATION = 'RESET_POST_NAVIGATION';
export const SET_POST_ID = 'SET_POST_ID';
export const SET_PREV_TIMESTAMP = 'SET_PREV_TIMESTAMP';
export const SET_NEXT_TIMESTAMP = 'SET_NEXT_TIMESTAMP';

/** Getters types*/
export const PREV_POSTS = 'PREV_POSTS';
export const NEXT_POSTS = 'NEXT_POSTS';
export const LOADING_PREV = 'LOADING_PREV';
export const LOADING_NEXT = 'LOADING_NEXT';
export const POST_NAVIGATION_ID = 'POST_NAVIGATION_ID';

const module = {
  namespaced: true,
  state: {
    prevPosts: [],
    nextPosts: [],
    lastPagePrev: 1,
    nextPagePrev: 1,
    lastPageNext: 1,
    nextPageNext: 1,
    loadingPrev: false,
    loadingNext: false,
    postId: null,
    prevTimestamp: null,
    nextTimestamp: null
  },
  mutations: {
    [FETCH_PREV_POSTS + REQUEST](state) {
      state.loadingPrev = true;
    },
    [FETCH_PREV_POSTS + SUCCESS](state, payload) {
      state.loadingPrev = false;
      state.lastPagePrev = payload.meta.last_page;
      state.nextPagePrev = payload.meta.current_page + 1;
      state.prevPosts.unshift(...payload.data.reverse());
    },
    [FETCH_PREV_POSTS + ERROR](state) {
      state.loadingPrev = false;
    },
    [FETCH_NEXT_POSTS + REQUEST](state) {
      state.loadingNext = true;
    },
    [FETCH_NEXT_POSTS + SUCCESS](state, payload) {
      state.loadingNext = false;
      state.lastPageNext = payload.meta.last_page;
      state.nextPageNext = payload.meta.current_page + 1;
      state.nextPosts.push(...payload.data);
    },
    [FETCH_NEXT_POSTS + ERROR](state) {
      state.loadingNext = false;
    },
    [RESET_POST_NAVIGATION](state) {
      state.prevPosts = [];
      state.nextPosts = [];
      state.lastPagePrev = 1;
      state.nextPagePrev = 1;
      state.lastPageNext = 1;
      state.nextPageNext = 1;
      state.loadingPrev = false;
      state.loadingNext = false;
    },
    [SET_POST_ID](state, payload) {
      state.postId = payload;
    },
    [SET_PREV_TIMESTAMP](state, payload) {
      state.prevTimestamp = payload;
    },
    [SET_NEXT_TIMESTAMP](state, payload) {
      state.nextTimestamp = payload;
    }
  },
  actions: {
    async [FETCH_PREV_POSTS]({commit, state}, payload) {
      const { id, nickname } = payload;

      if(state.postId && id !== state.postId) {
        commit(RESET_POST_NAVIGATION);
        commit(SET_POST_ID, id);
      }

      if(state.loadingPrev || state.lastPagePrev < state.nextPagePrev || state.nextPageNext === 1) {
        return;
      }

      commit(FETCH_PREV_POSTS + REQUEST);


      let timestamp = state.prevTimestamp ? state.prevTimestamp : Math.ceil(Date.now() / 1000) + 5;

      const data = new FormData();
      data.append('author_nickname', nickname);
      data.append('limit', '7');
      data.append('timestamp', timestamp);
      data.append('post_id', id);
      data.append('direction', 'next');
      data.append('page', state.nextPagePrev);

      try {
        const res = await api.users.getPosts(data);

        commit(FETCH_PREV_POSTS + SUCCESS, res.data);

        if(!state.prevTimestamp) {
          commit(SET_PREV_TIMESTAMP, timestamp);
        }
        if(!state.postId) {
          commit(SET_POST_ID, id);
        }
      } catch (e) {
        console.log(e);
        commit(FETCH_PREV_POSTS + ERROR);
      }
    },
    async [FETCH_NEXT_POSTS]({commit, state}, payload) {
      const { id, nickname } = payload;

      if(state.postId && id !== state.postId) {
        commit(RESET_POST_NAVIGATION);
        commit(SET_POST_ID, id);
      }

      if(state.loadingNext || state.lastPageNext < state.nextPageNext) {
        return;
      }

      commit(FETCH_NEXT_POSTS + REQUEST);


      let timestamp = state.nextTimestamp ? state.nextTimestamp : Math.ceil(Date.now() / 1000) + 5;

      const data = new FormData();
      data.append('author_nickname', nickname);
      data.append('limit', '7');
      data.append('timestamp', timestamp);
      data.append('post_id', id);
      data.append('direction', 'prev');
      data.append('page', state.nextPageNext);

      try {
        const res = await api.users.getPosts(data);

        commit(FETCH_NEXT_POSTS + SUCCESS, res.data);

        if(!state.nextTimestamp) {
          commit(SET_NEXT_TIMESTAMP, timestamp);
        }
        if(!state.postId) {
          commit(SET_POST_ID, id);
        }
      } catch (e) {
        console.log(e);
        commit(FETCH_NEXT_POSTS + ERROR);
      }
    }
  },
  getters: {
    [PREV_POSTS](state) {
      return state.prevPosts
    },
    [NEXT_POSTS](state) {
      return state.nextPosts
    },
    [LOADING_PREV](state) {
      return state.loadingPrev
    },
    [LOADING_NEXT](state) {
      return state.loadingNext
    },
    [POST_NAVIGATION_ID](state) {
      return state.postId
    }
  }
};

export default module;
