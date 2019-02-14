import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {DELETE_POST_FROM_AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
import {DELETE_POST_FROM_USER, moduleName as usersModule} from "Store/modules/users/users";
import {DELETE_POST_FROM_MAIN_PAGE, moduleName as mainPostsModule} from "Store/modules/mainPosts";

/**
 * Types
 * */
export const moduleName = 'usersProfilePosts/';

/** Actions types*/
export const FETCH_USER_PROFILE_POSTS = 'FETCH_USER_PROFILE_POSTS';
export const FETCH_USER_PROFILE_POSTS_NEXT_PAGE = 'FETCH_USER_PROFILE_POSTS_NEXT_PAGE';
export const ADD_POST = 'ADD_POST';
export const DELETE_POST = 'DELETE_POST';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const ADD_POST_TO_PROFILE = 'ADD_POST_TO_PROFILE';

/** Getters types*/
export const LOADING = 'LOADING';
export const USER_PROFILE_POSTS = 'USER_PROFILE_POSTS';

const module = {
  namespaced: true,
  state: {
    userProfilePosts: {},
    userProfilePostsMeta: {},
    userProfilePostsIds: [],
    maxCount: 10,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_USER_PROFILE_POSTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USER_PROFILE_POSTS + SUCCESS](state, payload) {
      state.loading = false;
      state.userProfilePosts = {
        ...payload.userProfilePostsTemp,
        [payload.nickname]: payload.res.data
      };
      state.userProfilePostsMeta = {
        ...payload.userProfilePostsMetaTemp,
        [payload.nickname]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          timestamp: payload.timestamp
        }
      };
      state.userProfilePostsIds = [...payload.userProfilePostsIdsOrder, payload.nickname];
    },
    [FETCH_USER_PROFILE_POSTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_USER_PROFILE_POSTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USER_PROFILE_POSTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.userProfilePosts[payload.nickname].push(...payload.res.data);
      state.userProfilePostsMeta = {
        ...payload.userProfilePostsMetaTemp,
        [payload.nickname]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          timestamp: state.userProfilePostsMeta[payload.nickname].timestamp
        }
      };
      state.userProfilePostsIds = [...payload.userProfilePostsIdsOrder, payload.nickname];
    },
    [FETCH_USER_PROFILE_POSTS_NEXT_PAGE + ERROR](state, error) {
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
    [ADD_POST_TO_PROFILE](state, payload) {
      const {data, nickname} = payload;

      if (state.userProfilePosts[nickname]) {
        state.userProfilePosts = {
          ...state.userProfilePosts,
          [nickname]: [...data, ...state.userProfilePosts[nickname]]
        };
      }
    },
    [DELETE_POST + REQUEST](state) {

    },
    [DELETE_POST + SUCCESS](state, payload) {
      state.userProfilePosts = payload;
    },
    [DELETE_POST + ERROR](state, error) {

    }
    // [ADD_POST_TO_GROUP](state, payload) {
    //   const {data, nickname} = payload;
    //
    //   if(state.userProfilePosts[nickname]) {
    //     state.userProfilePosts = {
    //       ...state.userProfilePosts,
    //       [nickname]: [...data, ...state.userProfilePosts[nickname]]
    //     };
    //   }
    // }
  },
  actions: {
    async [FETCH_USER_PROFILE_POSTS]({commit, state}, payload) {
      if (state.userProfilePosts[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_USER_PROFILE_POSTS + REQUEST);

      const timestamp = Math.ceil(Date.now() / 1000) + 5;
      const data = new FormData();
      data.append('author_nickname', payload);
      data.append('limit', '24');
      data.append('timestamp', timestamp);
      data.append('is_shortened', 'true');

      try {
        let res = await api.users.getPosts(data);

        if (state.userProfilePosts[payload] && state.userProfilePosts[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.userProfilePosts[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let userProfilePostsIdsOrder = state.userProfilePostsIds.filter(id => id !== payload);
        let userProfilePostsTemp = {...state.userProfilePosts};
        let userProfilePostsMetaTemp = {...state.userProfilePostsMeta};

        if (userProfilePostsIdsOrder.length >= state.maxCount) {
          delete userProfilePostsTemp[userProfilePostsIdsOrder[0]];
          delete userProfilePostsMetaTemp[userProfilePostsIdsOrder[0]];
          userProfilePostsIdsOrder = userProfilePostsIdsOrder.slice(1);
        }

        let result = {
          nickname: payload,
          res: res.data,
          userProfilePostsIdsOrder,
          userProfilePostsTemp,
          userProfilePostsMetaTemp,
          timestamp
        };

        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_USER_PROFILE_POSTS + SUCCESS, result);
      } catch (e) {
        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_USER_PROFILE_POSTS + ERROR, e.response);
      }
    },
    async [FETCH_USER_PROFILE_POSTS_NEXT_PAGE]({commit, state}, payload) {
      if (!state.userProfilePostsMeta[payload] || state.userProfilePostsMeta[payload].lastPage < state.userProfilePostsMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_USER_PROFILE_POSTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('author_nickname', payload);
      data.append('limit', '24');
      data.append('page', state.userProfilePostsMeta[payload].nextPage);
      data.append('timestamp', state.userProfilePostsMeta[payload].timestamp);
      data.append('is_shortened', 'true');

      try {
        let res = await api.users.getPosts(data);

        let userProfilePostsIdsOrder = state.userProfilePostsIds.filter(id => id !== payload);
        let userProfilePostsTemp = {...state.userProfilePosts};
        let userProfilePostsMetaTemp = {...state.userProfilePostsMeta};

        if (userProfilePostsIdsOrder.length >= state.maxCount) {
          delete userProfilePostsTemp[userProfilePostsIdsOrder[0]];
          delete userProfilePostsMetaTemp[userProfilePostsIdsOrder[0]];
          userProfilePostsIdsOrder = userProfilePostsIdsOrder.slice(1);
        }

        let result = {
          nickname: payload,
          res: res.data,
          userProfilePostsIdsOrder,
          userProfilePostsTemp,
          userProfilePostsMetaTemp
        };

        commit(FETCH_USER_PROFILE_POSTS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_USER_PROFILE_POSTS_NEXT_PAGE + ERROR, e.response);
      }
    },
    [ADD_POST]({commit}, payload) {

    },
    async [DELETE_POST]({commit, state}, payload) {
      commit(DELETE_POST + REQUEST);

      const {id, nickname, onSuccess} = payload;

      const data = new FormData();
      data.append('id', id);

      try {
        let res = await api.users.deletePost(data);
        console.log(res);

        let tempPosts = {...state.userProfilePosts};
        delete tempPosts[nickname];

        commit(DELETE_POST + SUCCESS, tempPosts);
        commit(usersModule + DELETE_POST_FROM_USER, nickname, {root: true});
        commit(userModule + DELETE_POST_FROM_AUTH_USER, null, {root: true});
        commit(mainPostsModule + DELETE_POST_FROM_MAIN_PAGE, id, {root: true});

        onSuccess();
      } catch (e) {
        commit(DELETE_POST + ERROR, e.response);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [USER_PROFILE_POSTS]: state => nickname => {
      return state.userProfilePosts[nickname]
    }
  }
};

export default module;
