import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {CHANGE_SHOW_LOADING, FETCH} from "Store/modules/albumPosts";
import {compareChatLastMessageTime} from "Store/modules/chats/chatsAll";

/**
 * Types
 * */
export const moduleName = 'chatsAllSearch/';

/** Actions types*/
export const FETCH_SEARCH_CHATS = 'FETCH_SEARCH_CHATS';
export const FETCH_SEARCH_CHATS_NEXT_PAGE = 'FETCH_SEARCH_CHATS_NEXT_PAGE';
export const UPDATE_SEARCH_CHATS = 'UPDATE_SEARCH_CHATS';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const UPDATE_ONLINE_SEARCH_CHAT = 'UPDATE_ONLINE_SEARCH_CHAT';
export const CHANGE_IS_NOT_FETCH_NEW = 'CHANGE_IS_NOT_FETCH_NEW';
export const CHANGE_SEARCH_INPUT = 'CHANGE_SEARCH_INPUT';
export const CHANGE_ACTIVE_SEARCH = 'CHANGE_ACTIVE_SEARCH';
export const DELETE_SEARCH_CHAT = 'DELETE_SEARCH_CHAT';
export const READ_MESSAGES_SEARCH_CHAT = 'READ_MESSAGES_SEARCH_CHAT';
export const RESET_SEARCH_CHATS = 'RESET_SEARCH_CHATS';
export const UPDATE_SEARCH_LAST_MESSAGE = 'UPDATE_SEARCH_LAST_MESSAGE';
export const SORT_SEARCH_CHATS = 'SORT_SEARCH_CHATS';

/** Getters types*/
export const SEARCH_CHATS = 'SEARCH_CHATS';
export const LOADING = 'LOADING';
export const SEARCH_INPUT = 'SEARCH_INPUT';
export const IS_ACTIVE_SEARCH = 'IS_ACTIVE_SEARCH';

const module = {
  namespaced: true,
  state: {
    searchChats: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    isNotFetchNew: false,
    unreadMessagesCount: 0,
    searchInput: '',
    isUpdateInputSearch: false,
    isActiveSearch: false
  },
  mutations: {
    [FETCH_SEARCH_CHATS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_SEARCH_CHATS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.searchChats = payload.data;
      state.isUpdateInputSearch = false;
    },
    [FETCH_SEARCH_CHATS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_SEARCH_CHATS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_SEARCH_CHATS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.searchChats = [...state.searchChats.slice(0, payload.meta.from - 1), ...payload.data];
    },
    [FETCH_SEARCH_CHATS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [UPDATE_ONLINE_SEARCH_CHAT](state, payload) {
      state.searchChats.forEach(chat => {
        chat.users.forEach(user => {
          if(user.nickname === payload.nickname) {
            user.is_online = payload.status;
          }
        })
      })
    },
    [UPDATE_SEARCH_CHATS + SUCCESS](state, payload) {
      state.searchChats = payload;
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
    [CHANGE_SEARCH_INPUT](state, payload) {
      state.searchInput = payload;
      state.isUpdateInputSearch = true;
    },
    [CHANGE_ACTIVE_SEARCH](state) {
      state.isActiveSearch = !state.isActiveSearch;
    },
    [DELETE_SEARCH_CHAT](state, payload) {
      state.searchChats = state.searchChats.filter(item => item.id !== payload);
    },
    [READ_MESSAGES_SEARCH_CHAT](state, payload) {
      state.searchChats.forEach(item => {
        if(item.id === payload) {
          item.unread_message_count = 0;
        }
      })
    },
    [UPDATE_SEARCH_CHATS + SUCCESS](state, payload) {
      state.searchChats = payload;
    },
    [RESET_SEARCH_CHATS](state) {
      state.searchChats = [];
    },
    [UPDATE_SEARCH_LAST_MESSAGE](state, payload) {
      state.searchChats.forEach(item => {
        if(item.id === payload.chatId && item.last_message.id !== payload.message.id) {
          item.last_message = {...payload.message};
        }
      })
    },
    [SORT_SEARCH_CHATS](state) {
      state.searchChats = [...state.searchChats].sort(compareChatLastMessageTime)
    },
  },
  actions: {
    async [FETCH_SEARCH_CHATS]({commit, state}) {
      if(state.isNotFetchNew && state.searchChats.length > 0) {
        commit(CHANGE_IS_NOT_FETCH_NEW, false);
        return;
      }

      if(state.searchChats.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_SEARCH_CHATS + REQUEST);

      const data = new FormData();
      data.append('type', 'without_me');
      data.append('search_string', state.searchInput);

      try {
        let res = await api.chat.search(data);

        if(state.searchChats.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.searchChats[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_SEARCH_CHATS + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_SEARCH_CHATS + ERROR, e);
      }
    },
    async [FETCH_SEARCH_CHATS_NEXT_PAGE]({commit, state}) {
      if (state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_SEARCH_CHATS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('page', state.nextPage);
      data.append('type', 'without_me');
      data.append('search_string', state.searchInput);

      try {
        let res = await api.chat.search(data);

        commit(FETCH_SEARCH_CHATS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_SEARCH_CHATS_NEXT_PAGE + ERROR, e);
      }
    },
    async [UPDATE_SEARCH_CHATS]({commit, state, rootState}, payload) {
      let index = state.searchChats.findIndex(chat => chat.id === payload.chat_id);

      if(index !== -1) {
        let newChats = [...state.searchChats];
        let [chat] = newChats.splice(index, 1);
        chat.last_message = payload;
        if(payload.sender_id !== rootState.user.user.id) {
          chat.unread_message_count += 1;
        }
        newChats.unshift(chat);

        commit(UPDATE_SEARCH_CHATS + SUCCESS, newChats);
      }
    },
  },
  getters: {
    [SEARCH_CHATS](state) {
      return state.searchChats
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [SEARCH_INPUT](state) {
      return state.searchInput
    },
    [IS_ACTIVE_SEARCH](state) {
      return state.isActiveSearch
    }
  }
};

export default module;
