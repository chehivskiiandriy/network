import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {CHANGE_SHOW_LOADING, FETCH} from "Store/modules/albumPosts";
import {moduleName as chatsAllModule, DELETE_CHAT, RESET_CHATS, CHANGE_UNREAD_MESSAGES_COUNT} from "Store/modules/chats/chatsAll";
import {moduleName as chatsAllSearchModule, DELETE_SEARCH_CHAT, RESET_SEARCH_CHATS} from "Store/modules/chats/chatsAllSearch";

/**
 * Types
 * */
export const moduleName = 'chatsArchive/';

/** Actions types*/
export const FETCH_ARCHIVE_CHATS = 'FETCH_ARCHIVE_CHATS';
export const FETCH_ARCHIVE_CHATS_NEXT_PAGE = 'FETCH_ARCHIVE_CHATS_NEXT_PAGE';
export const DELETE_FROM_ARCHIVE_CHAT = 'DELETE_FROM_ARCHIVE';
export const ADD_TO_ARCHIVE_CHAT = 'ADD_TO_ARCHIVE_CHAT';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_IS_NOT_FETCH_NEW = 'CHANGE_IS_NOT_FETCH_NEW';
export const UPDATE_ONLINE_ARCHIVE_CHAT = 'UPDATE_ONLINE_ARCHIVE_CHAT';
export const DELETE_ARCHIVE_CHAT = 'DELETE_ARCHIVE_CHAT';

/** Getters types*/
export const ARCHIVE_CHATS = 'ARCHIVE_CHATS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    archiveChats: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    isNotFetchNew: false
  },
  mutations: {
    [FETCH_ARCHIVE_CHATS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_ARCHIVE_CHATS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.archiveChats = payload.data;
    },
    [FETCH_ARCHIVE_CHATS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_ARCHIVE_CHATS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_ARCHIVE_CHATS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.archiveChats = [...state.archiveChats.slice(0, payload.meta.from - 1), ...payload.data];
    },
    [FETCH_ARCHIVE_CHATS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [DELETE_FROM_ARCHIVE_CHAT + REQUEST](state) {

    },
    [DELETE_FROM_ARCHIVE_CHAT + SUCCESS](state, payload) {
      state.archiveChats = state.archiveChats.filter(item => item.id !== payload);
    },
    [DELETE_FROM_ARCHIVE_CHAT + ERROR](state, error) {

    },
    [ADD_TO_ARCHIVE_CHAT + REQUEST](state) {

    },
    [ADD_TO_ARCHIVE_CHAT + SUCCESS](state) {
      state.archiveChats = [];
    },
    [ADD_TO_ARCHIVE_CHAT + ERROR](state, error) {

    },
    [UPDATE_ONLINE_ARCHIVE_CHAT](state, payload) {
      state.archiveChats.forEach(chat => {
        chat.users.forEach(user => {
          if(user.nickname === payload.nickname) {
            user.is_online = payload.status;
          }
        })
      })
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    },
    [CHANGE_IS_NOT_FETCH_NEW](state, payload) {
      state.isNotFetchNew = payload;
    },
    [DELETE_ARCHIVE_CHAT](state, payload) {
      state.archiveChats = state.archiveChats.filter(item => item.id !== payload);
    }
  },
  actions: {
    async [FETCH_ARCHIVE_CHATS]({commit, state}) {
      if(state.isNotFetchNew && state.archiveChats.length > 0) {
        commit(CHANGE_IS_NOT_FETCH_NEW, false);
        return;
      }

      if(state.archiveChats.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_ARCHIVE_CHATS + REQUEST);

      const data = new FormData();
      data.append('type', 'without_me');

      try {
        let res = await api.chat.getArchive(data);

        if(state.archiveChats.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.archiveChats[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_ARCHIVE_CHATS + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_ARCHIVE_CHATS + ERROR, e);
      }
    },
    async [FETCH_ARCHIVE_CHATS_NEXT_PAGE]({commit, state}) {
      if (state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_ARCHIVE_CHATS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('page', state.nextPage);
      data.append('type', 'without_me');

      try {
        let res = await api.chat.getArchive(data);

        commit(FETCH_ARCHIVE_CHATS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_ARCHIVE_CHATS_NEXT_PAGE + ERROR, e);
      }
    },
    async [DELETE_FROM_ARCHIVE_CHAT]({commit}, payload) {
      commit(DELETE_FROM_ARCHIVE_CHAT + REQUEST);

      const data = new FormData();
      data.append('id', payload.id);
      data.append('delete', 'true');

      try {
        await api.chat.addToArchive(data);

        commit(DELETE_FROM_ARCHIVE_CHAT + SUCCESS, payload.id);
        commit(chatsAllModule + RESET_CHATS, null, { root: true });
        commit(chatsAllSearchModule + RESET_SEARCH_CHATS, null, { root: true });
        if(payload.unread_message_count) {
          commit(chatsAllModule + CHANGE_UNREAD_MESSAGES_COUNT, payload.unread_message_count, { root: true });
        }
      } catch (e) {
        console.log(e);
        commit(DELETE_FROM_ARCHIVE_CHAT + ERROR, e);
      }
    },
    async [ADD_TO_ARCHIVE_CHAT]({commit}, payload) {
      commit(ADD_TO_ARCHIVE_CHAT + REQUEST);

      const data = new FormData();
      data.append('id', payload.id);

      try {
        await api.chat.addToArchive(data);

        commit(ADD_TO_ARCHIVE_CHAT + SUCCESS);
        commit(chatsAllModule + DELETE_CHAT + SUCCESS, payload.id, { root: true });
        commit(chatsAllSearchModule + DELETE_SEARCH_CHAT, payload.id, { root: true });
        if(payload.unread_message_count) {
          commit(chatsAllModule + CHANGE_UNREAD_MESSAGES_COUNT, -payload.unread_message_count, { root: true });
        }
      } catch (e) {
        console.log(e);
        commit(ADD_TO_ARCHIVE_CHAT + ERROR, e);
      }
    }
  },
  getters: {
    [ARCHIVE_CHATS](state) {
      return state.archiveChats
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
