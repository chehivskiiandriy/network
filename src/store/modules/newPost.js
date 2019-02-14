/**
 * Types
 * */
export const moduleName = 'newPost/';

/** Actions types*/


/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const ADD_TEMPORARY_FILES = 'ADD_TEMPORARY_FILES';
export const RESET_TEMPORARY_FILES = 'RESET_TEMPORARY_FILES';
export const CHANGE_METADATA = 'CHANGE_METADATA';
export const DELETE_FILE = 'DELETE_FILE';
export const SORT_TEMPORARY_FILES = 'SORT_TEMPORARY_FILES';
export const CHANGE_LOADING = 'CHANGE_LOADING';
export const ADD_POST_PREVIEW = 'ADD_POST_PREVIEW';
export const ADD_LOADING_FILES = 'ADD_LOADING_FILES';

/** Getters types*/
export const TEMPORARY_FILES = 'TEMPORARY_FILES';
export const LOADING = 'LOADING';
export const PREVIEW = 'PREVIEW';
export const LOADING_FILES = 'LOADING_FILES';

const module = {
  namespaced: true,
  state: {
    temporaryAddPostFiles: [],
    loading: false,
    preview: null,
    addLoadingFiles: false
  },
  mutations: {
    [ADD_TEMPORARY_FILES](state, payload) {
      state.temporaryAddPostFiles.push(...payload);
    },
    [RESET_TEMPORARY_FILES](state) {
      state.temporaryAddPostFiles = [];
    },
    [DELETE_FILE](state, payload) {
      state.temporaryAddPostFiles = state.temporaryAddPostFiles.splice(payload, 1);
    },
    [CHANGE_METADATA](state, payload) {
      if(state.temporaryAddPostFiles[payload.index]) {
        state.temporaryAddPostFiles[payload.index].metadata = payload.metadata;
        state.temporaryAddPostFiles[payload.index].cropped = payload.cropped;
      }
    },
    [SORT_TEMPORARY_FILES](state, payload) {
      state.temporaryAddPostFiles = payload;
    },
    [CHANGE_LOADING](state, payload) {
      state.loading = payload;
      if(!payload) {
        state.preview = null;
      }
    },
    [ADD_POST_PREVIEW](state, payload) {
      state.preview = payload;
    },
    [ADD_LOADING_FILES](state, payload) {
      state.addLoadingFiles = payload;
    }
  },
  actions: {

  },
  getters: {
    [TEMPORARY_FILES](state) {
      return state.temporaryAddPostFiles
    },
    [LOADING](state) {
      return state.loading
    },
    [PREVIEW](state) {
      return state.preview
    },
    [LOADING_FILES](state) {
      return state.addLoadingFiles
    }
  }
};

export default module;
