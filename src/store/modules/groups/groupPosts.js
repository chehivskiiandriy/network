import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

/**
 * Types
 * */
export const moduleName = 'groupPosts/';

/** Actions types*/
export const FETCH_GROUP_POSTS = 'FETCH_GROUP_POSTS';
export const FETCH_GROUP_POSTS_NEXT_PAGE = 'FETCH_GROUP_POSTS_NEXT_PAGE';
export const DELETE_GROUP_POST = 'DELETE_GROUP_POST';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const ADD_POST_TO_GROUP = 'ADD_POST_TO_GROUP';
export const LIKE_GROUP_POST = 'LIKE_GROUP_POST';
export const BOOKMARK_GROUP_POST = 'BOOKMARK_GROUP_POST';
export const EDIT_GROUP_POST = 'EDIT_GROUP_POST';

/** Getters types*/
export const LOADING = 'LOADING';
export const GROUP_POSTS = 'GROUP_POSTS';

const module = {
  namespaced: true,
  state: {
    groupPosts: {},
    groupPostsMeta: {},
    groupPostsIds: [],
    maxCount: 5,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_GROUP_POSTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_POSTS + SUCCESS](state, payload) {
      state.loading = false;
      state.groupPosts = {
        ...payload.groupPostsTemp,
        [payload.groupSlug]: payload.res.data
      };
      state.groupPostsMeta = {
        ...payload.groupPostsMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupPostsIds = [...payload.groupPostsIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_POSTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_GROUP_POSTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_POSTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.groupPosts[payload.groupSlug].push(...payload.res.data);
      state.groupPostsMeta = {
        ...payload.groupPostsMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupPostsIds = [...payload.groupPostsIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_POSTS_NEXT_PAGE + ERROR](state, error) {
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
    [ADD_POST_TO_GROUP](state, payload) {
      const {data, groupSlug} = payload;

      if(state.groupPosts[groupSlug]) {
        state.groupPosts = {
          ...state.groupPosts,
          [groupSlug]: [...data, ...state.groupPosts[groupSlug]]
        };
      }
    },
    [LIKE_GROUP_POST](state, payload) {
      if(state.groupPosts[payload.groupSlug]) {
        state.groupPosts[payload.groupSlug].forEach((item, i) => {
          if(item.slug === payload.slug) {
            state.groupPosts[payload.groupSlug][i].is_liked = payload.isLiked;
            if(payload.isLiked) {
              state.groupPosts[payload.groupSlug][i].likes_count = state.groupPosts[payload.groupSlug][i].likes_count + payload.count;
            } else {
              state.groupPosts[payload.groupSlug][i].likes_count = state.groupPosts[payload.groupSlug][i].likes_count - payload.count;
            }
          }
        })
      }
    },
    [BOOKMARK_GROUP_POST](state, payload) {
      if(state.groupPosts[payload.groupSlug]) {
        state.groupPosts[payload.groupSlug].forEach((item, i) => {
          if(item.slug === payload.slug) {
            state.groupPosts[payload.groupSlug][i].is_bookmarked = payload.isBookmarked;
            if(payload.isBookmarked) {
              state.groupPosts[payload.groupSlug][i].bookmarks_count = state.groupPosts[payload.groupSlug][i].bookmarks_count + 1;
            } else {
              state.groupPosts[payload.groupSlug][i].bookmarks_count = state.groupPosts[payload.groupSlug][i].bookmarks_count - 1;
            }
          }
        });
      }
    },
    [EDIT_GROUP_POST](state, payload) {
      for (let posts in state.groupPosts) {
        state.groupPosts[posts].forEach((item, i) => {
          if(item.id === payload.id) {
            state.groupPosts[posts][i] = payload.post;
          }
        })
      }
    },
    [DELETE_GROUP_POST + SUCCESS](state, payload) {
      state.groupPosts[payload.groupSlug] = state.groupPosts[payload.groupSlug].filter(item =>
        item.id !== payload.post_id
      );
    }
  },
  actions: {
    async [FETCH_GROUP_POSTS]({commit, state}, payload) {
      if(state.groupPosts[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_GROUP_POSTS + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);

      try {
        let res = await api.groups.getGroupPosts(data);

        if(state.groupPosts[payload] && state.groupPosts[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.groupPosts[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let groupPostsIdsOrder = state.groupPostsIds.filter(id => id !== payload);
        let groupPostsTemp = {...state.groupPosts};
        let groupPostsMetaTemp = {...state.groupPostsMeta};

        if(groupPostsIdsOrder.length >= state.maxCount) {
          delete groupPostsTemp[groupPostsIdsOrder[0]];
          delete groupPostsMetaTemp[groupPostsIdsOrder[0]];
          groupPostsIdsOrder = groupPostsIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupPostsIdsOrder,
          groupPostsTemp,
          groupPostsMetaTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_POSTS + SUCCESS, result);
      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_POSTS + ERROR, e.response);
      }
    },
    async [FETCH_GROUP_POSTS_NEXT_PAGE]({commit, state}, payload) {
      if(state.groupPostsMeta[payload].lastPage < state.groupPostsMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_GROUP_POSTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);
      data.append('page', state.groupPostsMeta[payload].nextPage);

      try {
        let res = await api.groups.getGroupPosts(data);

        let groupPostsIdsOrder = state.groupPostsIds.filter(id => id !== payload);
        let groupPostsTemp = {...state.groupPosts};
        let groupPostsMetaTemp = {...state.groupPostsMeta};

        if(groupPostsIdsOrder.length >= state.maxCount) {
          delete groupPostsTemp[groupPostsIdsOrder[0]];
          delete groupPostsMetaTemp[groupPostsIdsOrder[0]];
          groupPostsIdsOrder = groupPostsIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupPostsIdsOrder,
          groupPostsTemp,
          groupPostsMetaTemp
        };

        commit(FETCH_GROUP_POSTS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_GROUP_POSTS_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [DELETE_GROUP_POST]({commit}, payload) {
      commit(DELETE_GROUP_POST + REQUEST);

      const data = new FormData();
      data.append('group_id', payload.group_id);
      data.append('post_id', payload.post_id);

      try {
        await api.groups.deletePost(data);

        commit(DELETE_GROUP_POST + SUCCESS, payload);
        if(payload.onSuccess) payload.onSuccess();
      } catch (e) {
        console.log(e);
        commit(DELETE_GROUP_POST + ERROR, e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [GROUP_POSTS]: state => slug => {
      return state.groupPosts[slug]
    }
  }
};

export default module;
