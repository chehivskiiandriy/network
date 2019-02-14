import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {CHANGE_SHOW_LOADING, FETCH} from "Store/modules/albumPosts";
import {moduleName as chatsModule, READ_CHAT_MESSAGES, FETCH_CHAT} from "Store/modules/chats/chats";
import {
  DELETE_SEARCH_CHAT,
  READ_MESSAGES_SEARCH_CHAT,
  moduleName as chatsAllSearchModule} from "Store/modules/chats/chatsAllSearch";
import {moduleName as chatsArchiveModule, DELETE_ARCHIVE_CHAT} from "Store/modules/chats/chatsArchive";

export function compareChatLastMessageTime(a, b) {
  return b.last_message.created_at_timestamp - a.last_message.created_at_timestamp
}

/**
 * Types
 * */
export const moduleName = 'chatsAll/';

/** Actions types*/
export const FETCH_CHATS = 'FETCH_CHATS';
export const FETCH_CHATS_NEXT_PAGE = 'FETCH_CHATS_NEXT_PAGE';
export const DELETE_CHAT = 'DELETE_CHAT';
export const UPDATE_CHATS = 'UPDATE_CHATS';
export const FETCH_UNREAD_MESSAGES_COUNT = 'FETCH_UNREAD_MESSAGES_COUNT';
export const READ_MESSAGES = 'READ_MESSAGES';
export const CREATE_CHAT = 'CREATE_CHAT';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const UPDATE_ONLINE_CHAT = 'UPDATE_ONLINE_CHAT';
export const ADD_CHAT = 'ADD_CHAT';
export const CHANGE_IS_NOT_FETCH_NEW = 'CHANGE_IS_NOT_FETCH_NEW';
export const CHANGE_UNREAD_MESSAGES_COUNT = 'CHANGE_UNREAD_MESSAGES_COUNT';
export const RESET_CHATS = 'RESET_CHATS';
export const UPDATE_LAST_MESSAGE = 'UPDATE_LAST_MESSAGE';
export const SORT_CHATS = 'SORT_CHATS';

/** Getters types*/
export const CHATS = 'CHATS';
export const LOADING = 'LOADING';
export const UNREAD_MESSAGES_COUNT = 'UNREAD_MESSAGES_COUNT';

const module = {
  namespaced: true,
  state: {
    chats: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    isNotFetchNew: false,
    unreadMessagesCount: 0
  },
  mutations: {
    [FETCH_CHATS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_CHATS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.chats = payload.data;
    },
    [FETCH_CHATS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_CHATS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_CHATS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.chats = [...state.chats.slice(0, payload.meta.from - 1), ...payload.data];
    },
    [FETCH_CHATS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [DELETE_CHAT + REQUEST](state) {

    },
    [DELETE_CHAT + SUCCESS](state, payload) {
      state.chats = state.chats.filter(item => item.id !== payload);
    },
    [DELETE_CHAT + ERROR](state, error) {

    },
    [UPDATE_ONLINE_CHAT](state, payload) {
      state.chats.forEach(chat => {
        chat.users.forEach(user => {
          if(user.nickname === payload.nickname) {
            user.is_online = payload.status;
          }
        })
      })
    },
    [ADD_CHAT](state, payload) {
      state.chats.unshift(payload);
    },
    [UPDATE_CHATS + SUCCESS](state, payload) {
      state.chats = payload;
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
    [FETCH_UNREAD_MESSAGES_COUNT + REQUEST](state) {

    },
    [FETCH_UNREAD_MESSAGES_COUNT + SUCCESS](state, payload) {
      state.unreadMessagesCount = payload;
    },
    [FETCH_UNREAD_MESSAGES_COUNT + ERROR](state, e) {

    },
    [CHANGE_UNREAD_MESSAGES_COUNT](state, payload) {
      state.unreadMessagesCount += payload;
    },
    [READ_MESSAGES + REQUEST](state) {

    },
    [READ_MESSAGES + SUCCESS](state, payload) {
      state.chats.forEach(item => {
        if(item.id === payload) {
          item.unread_message_count = 0;
        }
      })
    },
    [READ_MESSAGES + ERROR](state, e) {

    },
    [CREATE_CHAT + REQUEST](state) {

    },
    [CREATE_CHAT + SUCCESS](state, payload) {
      if(state.chats.length > 0) {
        state.chats.unshift(payload);
      }
    },
    [CREATE_CHAT + ERROR](state, e) {

    },
    [RESET_CHATS](state) {
      state.chats = [];
    },
    [UPDATE_LAST_MESSAGE](state, payload) {
      state.chats.forEach(item => {
        if(item.id === payload.chatId && item.last_message.id !== payload.message.id) {
          item.last_message = {...payload.message};
        }
      })
    },
    [SORT_CHATS](state) {
      state.chats = [...state.chats].sort(compareChatLastMessageTime)
    },
  },
  actions: {
    async [FETCH_CHATS]({commit, state}) {
      if(state.isNotFetchNew && state.chats.length > 0) {
        commit(CHANGE_IS_NOT_FETCH_NEW, false);
        return;
      }

      if(state.chats.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_CHATS + REQUEST);

      const data = new FormData();
      data.append('type', 'without_me');

      try {
        let res = await api.chat.getAll(data);

        if(state.chats.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.chats[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_CHATS + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_CHATS + ERROR, e);
      }
    },
    async [FETCH_CHATS_NEXT_PAGE]({commit, state}) {
      if (state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_CHATS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('page', state.nextPage);
      data.append('type', 'without_me');

      try {
        let res = await api.chat.getAll(data);

        commit(FETCH_CHATS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_CHATS_NEXT_PAGE + ERROR, e);
      }
    },
    async [DELETE_CHAT]({commit}, payload) {
      commit(DELETE_CHAT + REQUEST);

      const data = new FormData();
      data.append('id', payload);

      try {
        await api.chat.deleteChat(data);

        commit(DELETE_CHAT + SUCCESS, payload);
        commit(chatsAllSearchModule + DELETE_SEARCH_CHAT, payload, { root: true });
        commit(chatsArchiveModule + DELETE_ARCHIVE_CHAT, payload, { root: true });
      } catch (e) {
        console.log(e);
        commit(DELETE_CHAT + ERROR, e);
      }
    },
    async [UPDATE_CHATS]({commit, state, rootState}, payload) {
      let index = state.chats.findIndex(chat => chat.id === payload.chat_id);

      if(index === -1) {
        if(state.chats.length === 0) {
          return;
        }

        const data = new FormData();
        data.append('id', payload.chat_id);
        data.append('type', 'without_me');

        try {
          let res = await api.chat.getChat(data);
          console.log(res);
          commit(ADD_CHAT, res.data);

        } catch (e) {
          console.log(e);
        }
      } else {
        let newChats = [...state.chats];
        let [chat] = newChats.splice(index, 1);
        chat.last_message = payload;
        if(payload.sender_id !== rootState.user.user.id) {
          chat.unread_message_count += 1;
        }
        newChats.unshift(chat);

        commit(UPDATE_CHATS + SUCCESS, newChats);
      }
    },
    async [FETCH_UNREAD_MESSAGES_COUNT]({commit}) {
      commit(FETCH_UNREAD_MESSAGES_COUNT + REQUEST);

      try {
        let { data: { count } } = await api.chat.getUnreadMessagesCount();

        commit(FETCH_UNREAD_MESSAGES_COUNT + SUCCESS, count);
      } catch (e) {
        console.log(e);
        commit(FETCH_UNREAD_MESSAGES_COUNT + ERROR, e);
      }
    },
    async [READ_MESSAGES]({commit, rootState}, payload) {
      commit(READ_MESSAGES + REQUEST);

      const data = new FormData();
      data.append('id', payload);

      try {
        const { data: { id } } = await api.chat.readMessages(data);

        const count = -rootState.chats.chats[id].unread_message_count;

        commit(CHANGE_UNREAD_MESSAGES_COUNT, count);
        commit(READ_MESSAGES + SUCCESS, id);
        commit(chatsAllSearchModule + READ_MESSAGES_SEARCH_CHAT, id, { root: true });
        commit(chatsModule + READ_CHAT_MESSAGES, id, { root: true });
      } catch (e) {
        console.log(e);
        commit(READ_MESSAGES + ERROR, e);
      }
    },
    async [CREATE_CHAT]({commit, rootState, dispatch}, payload) {
      commit(CREATE_CHAT + REQUEST);

      const { ids, name, message, file, onSuccess, onFail } = payload;

      try {
        const data = new FormData();
        data.append('name', name);
        data.append('ids', JSON.stringify(ids));

        const res = await api.chat.create(data);
        let chat = {
          ...res.data,
          users: res.data.users.filter(item => item.id !== rootState.user.user.id)
        };
        commit(CREATE_CHAT + SUCCESS, chat);
        dispatch(chatsModule + FETCH_CHAT, { chat, id: chat.id }, { root: true });

        if(onSuccess) onSuccess(res.data.id, message, file);
      } catch (e) {
        console.log(e);
        commit(CREATE_CHAT + ERROR, e);
        if(onFail) onFail();
      }
    }
  },
  getters: {
    [CHATS](state) {
      return state.chats
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [UNREAD_MESSAGES_COUNT](state) {
      return state.unreadMessagesCount
    }
  }
};

export default module;
