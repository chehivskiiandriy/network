import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

/**
 * Types
 * */
export const moduleName = 'albumPosts/';

/** Actions types*/
export const FETCH_ALBUM_POSTS = 'FETCH_ALBUM_POSTS';
export const FETCH_ALBUM_POSTS_NEXT_PAGE = 'FETCH_ALBUM_POSTS_NEXT_PAGE';
export const FETCH_ALBUM = 'FETCH_ALBUM';
export const DELETE_ALBUM_POST = 'DELETE_ALBUM_POST';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const ADD_POST_TO_ALBUM = 'ADD_POST_TO_ALBUM';

/** Getters types*/
export const LOADING = 'LOADING';
export const ALBUM_POSTS = 'ALBUM_POSTS';
export const ALBUM = 'ALBUM';

const module = {
  namespaced: true,
  state: {
    albumPosts: {},
    albumPostsMeta: {},
    albumsForIds: {},
    albumIds: [],
    maxCount: 5,
    loading: false,
    showLoading: true,
    error: null,
    waitingPostAction: false,
    postActionError: null,
  },
  mutations: {
    [FETCH_ALBUM_POSTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_ALBUM_POSTS + SUCCESS](state, payload) {
      state.loading = false;
      state.albumPosts = {
        ...payload.albumTempPosts,
        [payload.albumId]: payload.res.data
      };
      state.albumPostsMeta = {
        ...payload.albumTempPostsMeta,
        [payload.albumId]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.albumsForIds = {
        ...payload.albumsTempForIds
      };
      state.albumIds = [...payload.albumIdsOrder, payload.albumId];
    },
    [FETCH_ALBUM_POSTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_ALBUM_POSTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_ALBUM_POSTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.albumPosts[payload.albumId].push(...payload.res.data);
      state.albumPostsMeta = {
        ...payload.albumTempPostsMeta,
        [payload.albumId]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.albumsForIds = {
        ...payload.albumsTempForIds
      };
      state.albumIds = [...payload.albumIdsOrder, payload.albumId];
    },
    [FETCH_ALBUM_POSTS_NEXT_PAGE + ERROR](state, error) {
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
    [FETCH_ALBUM + REQUEST](state) {
      state.error = null;
    },
    [FETCH_ALBUM + SUCCESS](state, payload) {
      state.albumsForIds = {
        ...state.albumsForIds,
        [payload.albumId]: payload.data
      }
    },
    [FETCH_ALBUM + ERROR](state, error) {
      state.error = error;
    },
    [ADD_POST_TO_ALBUM](state, payload) {
      const {data, albumId} = payload;

      if(state.albumPosts[albumId]) {
        state.albumPosts = {
          ...state.albumPosts,
          [albumId]: [...data, ...state.albumPosts[albumId]]
        };
      }
    },
    [DELETE_ALBUM_POST + REQUEST](state, payload) {
      state.waitingPostAction = true;
      state.postActionError = null;
    },
    [DELETE_ALBUM_POST + ERROR](state, payload) {
      state.waitingPostAction = false;
      state.postActionError = payload && payload.error || true;
    },
    [DELETE_ALBUM_POST + SUCCESS](state, payload) {
      state.waitingPostAction = false;
      state.postActionError = null;
    },
  },
  actions: {
    async [FETCH_ALBUM_POSTS]({commit, state}, payload) {
      if(state.albumPosts[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_ALBUM_POSTS + REQUEST);

      const data = new FormData();
      data.append('album_id', payload);
      data.append('limit', '31');

      try {
        let res = await api.albums.getAlbumPosts(data);

        if(state.albumPosts[payload] && state.albumPosts[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.albumPosts[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let albumIdsOrder = state.albumIds.filter(id => id !== payload);
        let albumTempPosts = {...state.albumPosts};
        let albumTempPostsMeta = {...state.albumPostsMeta};
        let albumsTempForIds = {...state.albumsForIds};

        if(albumIdsOrder.length >= state.maxCount) {
          delete albumTempPosts[albumIdsOrder[0]];
          delete albumTempPostsMeta[albumIdsOrder[0]];
          delete albumsTempForIds[albumIdsOrder[0]];
          albumIdsOrder = albumIdsOrder.slice(1);
        }

        let result = {
          albumId: payload,
          res: res.data,
          albumIdsOrder,
          albumTempPosts,
          albumTempPostsMeta,
          albumsTempForIds
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_ALBUM_POSTS + SUCCESS, result);

      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_ALBUM_POSTS + ERROR, e.response);
      }
    },
    async [FETCH_ALBUM_POSTS_NEXT_PAGE]({commit, state}, payload) {
      if(state.albumPostsMeta[payload].lastPage < state.albumPostsMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_ALBUM_POSTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('album_id', payload);
      data.append('page', state.albumPostsMeta[payload].nextPage);
      data.append('limit', '31');

      try {
        let res = await api.albums.getAlbumPosts(data);

        let albumIdsOrder = state.albumIds.filter(id => id !== payload);
        let albumTempPosts = {...state.albumPosts};
        let albumTempPostsMeta = {...state.albumPostsMeta};
        let albumsTempForIds = {...state.albumsForIds};

        if(albumIdsOrder.length >= state.maxCount) {
          delete albumTempPosts[albumIdsOrder[0]];
          delete albumTempPostsMeta[albumIdsOrder[0]];
          delete albumsTempForIds[albumIdsOrder[0]];
          albumIdsOrder = albumIdsOrder.slice(1);
        }

        let result = {
          albumId: payload,
          res: res.data,
          albumIdsOrder,
          albumTempPosts,
          albumTempPostsMeta,
          albumsTempForIds
        };

        commit(FETCH_ALBUM_POSTS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_ALBUM_POSTS_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [FETCH_ALBUM]({commit}, payload) {
      commit(FETCH_ALBUM + REQUEST);

      try {
        const data = new FormData();
        data.append('id', payload);
        let res = await api.albums.getAlbum(data);

        let result = {
          albumId: payload,
          data: res.data
        };

        commit(FETCH_ALBUM + SUCCESS, result);
      } catch (e) {
        commit(FETCH_ALBUM + ERROR, e.response);
      }
    },
    async [DELETE_ALBUM_POST] ({commit, dispatch}, { albumId, postId }) {
      commit(DELETE_ALBUM_POST + REQUEST);
      try {
        const response = await api.albums.deleteAlbumPost({
          album_id: albumId,
          ids: JSON.stringify([postId]),
        });
        if(response.state === undefined || response.state === true) {
          commit(DELETE_ALBUM_POST + SUCCESS, { albumId, postId });
          dispatch(FETCH_ALBUM_POSTS, albumId );
        } else {
          commit(DELETE_ALBUM_POST + ERROR);
        }
      } catch (error) {
        commit(DELETE_ALBUM_POST + ERROR, { error });
      }
    },
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [ALBUM_POSTS]: state => id => {
      return state.albumPosts[id]
    },
    [ALBUM]: state => id => {
      return state.albumsForIds[id]
    }
  }
};

export default module;
