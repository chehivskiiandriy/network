import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

/**
 * Types
 * */
export const moduleName = 'groupAlbums/';

/** Actions types*/
export const FETCH_GROUP_ALBUMS = 'FETCH_GROUP_ALBUMS';
export const FETCH_GROUP_ALBUMS_NEXT_PAGE = 'FETCH_GROUP_ALBUMS_NEXT_PAGE';
export const CREATE_GROUP_ALBUM = 'CREATE_GROUP_ALBUM';
export const UPDATE_GROUP_ALBUM = 'UPDATE_GROUP_ALBUM';
export const DELETE_GROUP_ALBUM = 'DELETE_GROUP_ALBUM';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const ALBUM_ACTION = 'ALBUM_ACTION';
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const LOADING = 'LOADING';
export const GROUP_ALBUMS = 'GROUP_ALBUMS';

const module = {
  namespaced: true,
  state: {
    groupAlbums: {},
    groupAlbumsMeta: {},
    groupAlbumsIds: [],
    maxCount: 5,
    loading: false,
    showLoading: true,
    error: null,
    waitingForAlbumAction: false,
    albumActionError: null,
    newAlbumId: null,
  },
  mutations: {
    [FETCH_GROUP_ALBUMS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_ALBUMS + SUCCESS](state, payload) {
      state.loading = false;
      state.groupAlbums = {
        ...payload.groupAlbumsTemp,
        [payload.groupSlug]: payload.res.data
      };
      state.groupAlbumsMeta = {
        ...payload.groupAlbumsMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupAlbumsIds = [...payload.groupAlbumsIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_ALBUMS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_GROUP_ALBUMS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUP_ALBUMS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.groupAlbums[payload.groupSlug].push(...payload.res.data);
      state.groupAlbumsMeta = {
        ...payload.groupAlbumsMetaTemp,
        [payload.groupSlug]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.groupAlbumsIds = [...payload.groupAlbumsIdsOrder, payload.groupSlug];
    },
    [FETCH_GROUP_ALBUMS_NEXT_PAGE + ERROR](state, error) {
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
    [ALBUM_ACTION + REQUEST](state) {
      state.waitingForAlbumAction = true;
      state.albumActionError = null;
    },
    [ALBUM_ACTION + ERROR](state, payload) {
      state.waitingForAlbumAction = false;
      state.albumActionError = payload && payload.error || true;
    },
    [CREATE_GROUP_ALBUM + SUCCESS](state, { id }) {
      state.waitingForAlbumAction = false;
      state.groupAlbums = {};
      state.newAlbumId = id;
      state.albumActionError = null;
    },
    [ALBUM_ACTION + SUCCESS](state) {
      state.waitingForAlbumAction = false;
      state.groupAlbums = {};
      state.albumActionError = null;
    },
  },
  actions: {
    async [FETCH_GROUP_ALBUMS]({commit, state}, payload) {
      if(state.groupAlbums[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_GROUP_ALBUMS + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);

      try {
        let res = await api.groups.getGroupAlbums(data);

        if(state.groupAlbums[payload] && state.groupAlbums[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.groupAlbums[payload][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let groupAlbumsIdsOrder = state.groupAlbumsIds.filter(id => id !== payload);
        let groupAlbumsTemp = {...state.groupAlbums};
        let groupAlbumsMetaTemp = {...state.groupAlbumsMeta};

        if(groupAlbumsIdsOrder.length >= state.maxCount) {
          delete groupAlbumsTemp[groupAlbumsIdsOrder[0]];
          delete groupAlbumsMetaTemp[groupAlbumsIdsOrder[0]];
          groupAlbumsIdsOrder = groupAlbumsIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupAlbumsIdsOrder,
          groupAlbumsTemp,
          groupAlbumsMetaTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_ALBUMS + SUCCESS, result);
      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_GROUP_ALBUMS + ERROR, e.response);
      }
    },
    async [FETCH_GROUP_ALBUMS_NEXT_PAGE]({commit, state}, payload) {
      if(state.groupAlbumsMeta[payload].lastPage < state.groupAlbumsMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_GROUP_ALBUMS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('group_slug', payload);
      data.append('page', state.groupAlbumsMeta[payload].nextPage);

      try {
        let res = await api.groups.getGroupAlbums(data);

        let groupAlbumsIdsOrder = state.groupAlbumsIds.filter(id => id !== payload);
        let groupAlbumsTemp = {...state.groupAlbums};
        let groupAlbumsMetaTemp = {...state.groupAlbumsMeta};

        if(groupAlbumsIdsOrder.length >= state.maxCount) {
          delete groupAlbumsTemp[groupAlbumsIdsOrder[0]];
          delete groupAlbumsMetaTemp[groupAlbumsIdsOrder[0]];
          groupAlbumsIdsOrder = groupAlbumsIdsOrder.slice(1);
        }

        let result = {
          groupSlug: payload,
          res: res.data,
          groupAlbumsIdsOrder,
          groupAlbumsTemp,
          groupAlbumsMetaTemp,
        };

        commit(FETCH_GROUP_ALBUMS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_GROUP_ALBUMS_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [CREATE_GROUP_ALBUM] ({commit, state}, { group_id, title, description }) {
      commit(ALBUM_ACTION + REQUEST);

      const data = new FormData();
      data.append('group_id', group_id);
      data.append('title', title);
      data.append('description', description);
      try {
        const response = await api.albums.createAlbum(data),
          { id } = response.data;
        commit(CREATE_GROUP_ALBUM + SUCCESS, { id });
      } catch (error) {
        commit(ALBUM_ACTION + ERROR);
      }
    },
    async [UPDATE_GROUP_ALBUM] ({commit, state}, { id, title, description }) {
      commit(ALBUM_ACTION + REQUEST);

      const data = new FormData();
      data.append('id', id);
      data.append('title', title);
      data.append('desc', description);
      try {
        const response = await api.albums.updateAlbum(data),
          { state } = response.data;
        if(state) {
          commit(ALBUM_ACTION + SUCCESS);
        } else {
          commit(ALBUM_ACTION + ERROR);
        }
      } catch (error) {
        commit(ALBUM_ACTION + ERROR);
      }
    },
    async [DELETE_GROUP_ALBUM] ({commit, state}, { groupSlug, albumId }) {
      commit(ALBUM_ACTION + REQUEST);

      const data = new FormData();
      data.append('id', albumId);
      try {
        const response = await api.albums.deleteAlbum(data),
          { state } = response.data;
        if(state) {
          commit(ALBUM_ACTION + SUCCESS);
        } else {
          commit(ALBUM_ACTION + ERROR);
        }
      } catch (error) {
        commit(ALBUM_ACTION + ERROR);
      }
    },
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [GROUP_ALBUMS]: state => slug => {
      return state.groupAlbums[slug]
    }
  }
};

export default module;
