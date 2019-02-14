import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import Vue from "vue";

/**
 * Types
 * */
export const moduleName = 'mainPosts/';

/** Actions types*/
export const FETCH_MAIN_POSTS = 'FETCH_MAIN_POSTS';
export const FETCH_MAIN_POSTS_NEXT_PAGE = 'FETCH_MAIN_POSTS_NEXT_PAGE';
export const FETCH_NEW_POSTS = 'FETCH_NEW_POST';
export const GET_AUDIENCE = 'GET_AUDIENCE';
export const CHANGE_AUDIENCE = 'CHANGE_AUDIENCE';
export const CHECK_NEW_POSTS = 'CHECK_NEW_POSTS';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const CHANGE_IS_CHANGED_FILTERS = 'CHANGE_IS_CHANGED_FILTERS';
export const RESET_POSTS = 'RESET_POSTS';
export const CHANGE_IS_FETCH_NEW_POSTS = 'CHANGE_IS_NEW_POSTS';
export const RESET_MAIN_PAGE = 'RESET_MAIN_PAGE';
export const DELETE_POST_FROM_MAIN_PAGE = 'DELETE_POST_FROM_MAIN_PAGE';
export const LIKE_POST_MAIN_PAGE = 'LIKE_POST_MAIN_PAGE';
export const BOOKMARK_POST_MAIN_PAGE = 'BOOKMARK_POST_MAIN_PAGE';
export const ADD_GIFT_TO_POST = 'ADD_GIFT_TO_POST';
export const CHANGE_SUBSCRIBE_MAIN_POSTS = 'CHANGE_SUBSCRIBE_MAIN_POSTS';
export const ADD_POST_TO_MAIN_PAGE = 'ADD_POST_TO_MAIN_PAGE';
export const ADD_IS_REPOSTED = 'ADD_IS_REPOSTED';
export const CHANGE_VOTE_USER = 'CHANGE_VOTE_USER';
export const EDIT_POST_MAIN_PAGE = 'EDIT_POST_MAIN_PAGE';
export const CHANGE_CHECK_NEW_POSTS = 'CHANGE_CHECK_NEW_POSTS';

/** Getters types*/
export const LOADING = 'LOADING';
export const MAIN_POSTS = 'MAIN_POSTS';
export const AUDIENCE = 'AUDIENCE';
export const IS_NEW_POSTS = 'IS_NEW_POSTS';

const module = {
  namespaced: true,
  state: {
    mainPosts: [],
    lastPage: 1,
    nextPage: 2,
    timestamp: null,
    loading: false,
    showLoading: true,
    error: null,
    isChangedFilters: false,
    fetchNew: true,
    audience: '',
    isNewPosts: false
  },
  mutations: {
    [FETCH_MAIN_POSTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MAIN_POSTS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.res.meta.last_page;
      state.nextPage = payload.res.meta.current_page + 1;
      state.mainPosts = payload.res.data;
      state.timestamp = payload.timestamp;
      state.fetchNew = false;
    },
    [FETCH_MAIN_POSTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_MAIN_POSTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MAIN_POSTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.mainPosts.push(...payload.data);
    },
    [FETCH_MAIN_POSTS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
      state.fetchNew = false;
    },
    [CHANGE_IS_CHANGED_FILTERS](state, payload) {
      state.isChangedFilters = payload;
      state.fetchNew = true;
    },
    [RESET_POSTS](state) {
      state.mainPosts = [];
    },
    [CHANGE_IS_FETCH_NEW_POSTS](state, payload) {
      state.fetchNew = payload;
    },
    [RESET_MAIN_PAGE](state) {
      state.mainPosts = [];
      state.fetchNew = true;
    },
    [ADD_POST_TO_MAIN_PAGE](state, payload) {
      state.mainPosts.unshift(payload);
    },
    [ADD_IS_REPOSTED](state, {id, slug, isReposted}) {
      state.mainPosts.forEach((item, i) => {
        if (item.id === id) {
          state.mainPosts[i].is_reposted = isReposted;
          state.mainPosts[i].reposts_count = state.mainPosts[i].reposts_count + (isReposted ? 1 : (-1));
        }
      });
      if (!isReposted) {
        for (const iterate_slug in state.mainPosts) {
          if (state.mainPosts.hasOwnProperty(iterate_slug)) {
            const post = state.mainPosts[iterate_slug];
            console.log(post);
            if (post.is_repost && post.attachments.posts[0].slug === slug) {
              Vue.delete(state.mainPosts, iterate_slug);
              break;
            }
          }
        }
      }
    },
    [DELETE_POST_FROM_MAIN_PAGE](state, payload) {
      state.mainPosts = state.mainPosts.filter(item => item.id !== payload);
    },
    [LIKE_POST_MAIN_PAGE](state, payload) {
      state.mainPosts.forEach((item, i) => {
        if (item.slug === payload.slug) {
          state.mainPosts[i].is_liked = payload.isLiked;
          if (payload.isLiked) {
            state.mainPosts[i].likes_count = state.mainPosts[i].likes_count + payload.count;
          } else {
            state.mainPosts[i].likes_count = state.mainPosts[i].likes_count - payload.count;
          }
        }
      });
    },
    [BOOKMARK_POST_MAIN_PAGE](state, payload) {
      state.mainPosts.forEach((item, i) => {
        if (item.slug === payload.slug) {
          state.mainPosts[i].is_bookmarked = payload.isBookmarked;
          if (payload.isBookmarked) {
            state.mainPosts[i].bookmarks_count = state.mainPosts[i].bookmarks_count + 1;
          } else {
            state.mainPosts[i].bookmarks_count = state.mainPosts[i].bookmarks_count - 1;
          }
        }
      });
    },
    [ADD_GIFT_TO_POST](state, payload) {
      state.mainPosts.forEach((item, i) => {
        if (state.mainPosts[i].author.nickname === payload.nickname) {
          state.mainPosts[i].author.active_gift = payload.gift;
        }
      });
    },
    [CHANGE_SUBSCRIBE_MAIN_POSTS](state, payload) {
      state.mainPosts.forEach((item, i) => {
        if (state.mainPosts[i].author.nickname === payload.nickname) {
          state.mainPosts[i].author.is_subscribed = payload.state;
        }
      });
    },
    [CHANGE_VOTE_USER](state, payload) {
      state.mainPosts.forEach((item, i) => {
        if (item.author.nickname === payload) {
          state.mainPosts[i].author.is_voted = true;
        }
      });
    },
    [EDIT_POST_MAIN_PAGE](state, payload) {
      state.mainPosts.forEach((item, i) => {
        if (item.id === payload.id) {
          state.mainPosts[i] = payload.post;
        }
      });
    },
    [CHANGE_AUDIENCE + SUCCESS](state, payload) {
      state.audience = payload;
    },
    [CHECK_NEW_POSTS + SUCCESS](state) {
      state.isNewPosts = true;
    },
    [CHANGE_CHECK_NEW_POSTS](state, payload) {
      state.isNewPosts = payload;
    }
  },
  actions: {
    async [FETCH_MAIN_POSTS]({commit, state, rootState}) {
      if (!state.fetchNew || state.loading || !rootState.user.user.nickname) {
        return;
      }

      if (state.mainPosts.length > 0 && !state.isChangedFilters) {
        commit(CHANGE_SHOW_LOADING, false);
      }

      if (state.isChangedFilters) {
        commit(RESET_POSTS);
      }
      commit(FETCH_MAIN_POSTS + REQUEST);

      const timestamp = Math.ceil(Date.now() / 1000) + 5;
      const data = new FormData();
      data.append('timestamp', timestamp);
      data.append('limit', '16');

      try {
        let res;

        if (state.audience === 'all') {
          res = await api.users.getPosts(data);
        } else {
          res = await api.user.getAllSubscribtionsPosts(data);
        }

        if (state.mainPosts.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.mainPosts[0].id && !state.isChangedFilters) {
          commit(FETCH + SUCCESS);
          return;
        }

        let result = {
          res: res.data,
          timestamp
        };

        commit(FETCH_MAIN_POSTS + SUCCESS, result);
        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        if (state.isChangedFilters) commit(CHANGE_IS_CHANGED_FILTERS, false)
      } catch (e) {
        commit(FETCH_MAIN_POSTS + ERROR, e);
        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_MAIN_POSTS_NEXT_PAGE]({commit, state}, payload) {
      if (state.lastPage < state.nextPage || state.loading) {
        return;
      }

      const {onSuccess} = payload;

      commit(FETCH_MAIN_POSTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('timestamp', state.timestamp);
      data.append('page', state.nextPage);
      data.append('limit', '16');

      try {
        let res;

        if (state.audience === 'all') {
          res = await api.users.getPosts(data);
        } else {
          res = await api.user.getAllSubscribtionsPosts(data);
        }

        commit(FETCH_MAIN_POSTS_NEXT_PAGE + SUCCESS, res.data);
        onSuccess();
      } catch (e) {

        commit(FETCH_MAIN_POSTS_NEXT_PAGE + ERROR, e.response);
      }
    },
    [FETCH_NEW_POSTS]({commit, dispatch}) {
      commit(CHANGE_IS_FETCH_NEW_POSTS, true);
      dispatch(FETCH_MAIN_POSTS);
    },
    [GET_AUDIENCE]({commit}) {
      let audience = localStorage.getItem('audience');

      if (!audience) {
        localStorage.setItem('audience', 'all');
        audience = 'all';
      }

      commit(CHANGE_AUDIENCE + SUCCESS, audience);
    },
    [CHANGE_AUDIENCE]({commit}, payload) {
      localStorage.setItem('audience', payload);
      commit(CHANGE_AUDIENCE + SUCCESS, payload);
    },
    async [CHECK_NEW_POSTS]({commit, state}) {
      if(state.isNewPosts) {
        return;
      }

      const data = new FormData();
      data.append('limit', '1');

      try {
        let res;

        if (state.audience === 'all') {
          res = await api.users.getPosts(data);
        } else {
          res = await api.user.getAllSubscribtionsPosts(data);
        }
        if (state.mainPosts.length > 0 && res.data.data.length > 0 && res.data.data[0].id !== state.mainPosts[0].id) {
          commit(CHECK_NEW_POSTS + SUCCESS);
        }
      } catch (e) {
        console.log(e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [MAIN_POSTS](state) {
      return state.mainPosts
    },
    [AUDIENCE](state) {
      return state.audience
    },
    [IS_NEW_POSTS](state) {
      return state.isNewPosts
    }
  }
};

export default module;
