import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'chats/';

/** Actions types*/
export const FETCH_CHAT = 'FETCH_CHAT';
export const CHECK_CHAT = 'CHECK_CHAT';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const READ_CHAT_MESSAGES = 'READ_CHAT_MESSAGES';
export const UPDATE_CHAT = 'UPDATE_CHAT';

/** Getters types*/
export const LOADING = 'LOADING';
export const CHAT = 'CHAT';

const module = {
  namespaced: true,
  state: {
    chats: {},
    chatIds: [],
    maxCount: 200,
    loading: false,
    showLoading: true,
    error: null,
    searchResultsList: [],
    searchString: '',
  },
  mutations: {
    [FETCH_CHAT + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_CHAT + SUCCESS](state, payload) {
      state.loading = false;
      state.chats = {
        ...payload.chatsTemp,
        [payload.id]: payload.res
      };
      state.chatIds = [...payload.chatIdsOrder, payload.id];
    },
    [FETCH_CHAT + ERROR](state, error) {
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
    [CHECK_CHAT + REQUEST](state) {

    },
    [CHECK_CHAT + SUCCESS](state) {

    },
    [READ_CHAT_MESSAGES](state, payload) {
      state.chats[payload].unread_message_count = 0;
    },
    [UPDATE_CHAT + SUCCESS](state, payload) {
      state.chats[payload.chat_id] = payload;
    }
  },
  actions: {
    async [FETCH_CHAT]({commit, state, rootState}, payload) {
      const { id, chat } = payload;

      if (state.chats[id]) {
        commit(CHANGE_SHOW_LOADING, false);
      }

      commit(FETCH_CHAT + REQUEST);

      try {
        let res;

        if(chat) {
          res = chat;
        } else {
          const data = new FormData();
          data.append('id', id);
          data.append('type', 'without_me');

          let result = await api.chat.getChat(data);
          res = result.data;
        }

        let chatIdsOrder = state.chatIds.filter(item => item !== id);
        let chatsTemp = {...state.chats};

        if (chatIdsOrder.length >= state.maxCount) {
          delete chatsTemp[chatIdsOrder[0]];
          chatIdsOrder = chatIdsOrder.slice(1);
        }

        let result = {
          id,
          res,
          chatIdsOrder,
          chatsTemp
        };

        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_CHAT + SUCCESS, result);

      } catch (e) {
        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_CHAT + ERROR, e);
      }
    },
    async [CHECK_CHAT]({commit}, payload) {
      commit(CHECK_CHAT + REQUEST);
      const { id, onSuccess, onFail } = payload;
      const data = new FormData();
      data.append('id', id);

      try {
        let res = await api.user.checkChat(data);

        if(res.data.state) {
          onSuccess(res.data.id);
        } else {
          onFail(id);
        }
        commit(CHECK_CHAT + SUCCESS);

      } catch (e) {
        console.log(e);
      }
    },
    [UPDATE_CHAT]({commit, state, rootState}, payload) {
      let newChat = {...state.chats[payload.chat_id]};
      newChat.last_message = {...payload};

      if(payload.sender_id !== rootState.user.user.id) {
        newChat.unread_message_count += 1;
      }

      commit(UPDATE_CHAT + SUCCESS, newChat);
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [CHAT]: state => id => {
      return state.chats[id]
    }
  }
};

export default module;
