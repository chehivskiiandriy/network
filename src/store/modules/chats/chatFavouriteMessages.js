import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";
import {
  moduleName as chatMessagesModule,
  RESET_SELECTED_MESSAGES
} from "Store/modules/chats/chatMessages";

/**
 * Types
 * */
export const moduleName = 'chatFavouriteMessages/';

/** Actions types*/
export const FETCH_FAVOURITE_MESSAGES = 'FETCH_FAVOURITE_MESSAGES';
export const FETCH_FAVOURITE_MESSAGES_NEXT_PAGE = 'FETCH_FAVOURITE_MESSAGES_NEXT_PAGE';
export const ADD_FAVOURITE_MESSAGES = 'ADD_FAVOURITE_MESSAGES';
export const DELETE_FAVOURITE_MESSAGES = 'DELETE_FAVOURITE_MESSAGES';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const LOADING = 'LOADING';
export const FAVOURITE_MESSAGES = 'FAVOURITE_MESSAGES';

const module = {
  namespaced: true,
  state: {
    messages: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
  },
  mutations: {
    [FETCH_FAVOURITE_MESSAGES + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_FAVOURITE_MESSAGES + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.messages = payload.data.reverse();
    },
    [FETCH_FAVOURITE_MESSAGES + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_FAVOURITE_MESSAGES_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_FAVOURITE_MESSAGES_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.messages = [...payload.data.reverse(), ...state.messages.slice(state.messages.length % 30)];
    },
    [FETCH_FAVOURITE_MESSAGES_NEXT_PAGE + ERROR](state, error) {
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
    [ADD_FAVOURITE_MESSAGES + REQUEST](state) {

    },
    [ADD_FAVOURITE_MESSAGES + SUCCESS](state) {
      state.messages = [];
    },
    [ADD_FAVOURITE_MESSAGES + ERROR](state, error) {

    },
    [DELETE_FAVOURITE_MESSAGES + REQUEST](state) {

    },
    [DELETE_FAVOURITE_MESSAGES + SUCCESS](state, payload) {
      state.messages = state.messages.filter(item => !payload.includes(item.id));
    },
    [DELETE_FAVOURITE_MESSAGES + ERROR](state, error) {

    }
  },
  actions: {
    async [FETCH_FAVOURITE_MESSAGES]({commit, state}) {
      if(state.messages.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_FAVOURITE_MESSAGES + REQUEST);

      const data = new FormData();
      data.append('limit', '30');

      try {
        let res = await api.messages.getFavourite(data);

        if(state.messages.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.messages[state.messages.length - 1].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_FAVOURITE_MESSAGES + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_FAVOURITE_MESSAGES + ERROR, e);
      }
    },
    async [FETCH_FAVOURITE_MESSAGES_NEXT_PAGE]({commit, state}) {
      if (state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_FAVOURITE_MESSAGES_NEXT_PAGE + REQUEST);

      let nextPage = Math.floor(state.messages.length / 30) + 1;

      const data = new FormData();
      data.append('page', String(nextPage));
      data.append('limit', '30');

      try {
        let res = await api.messages.getFavourite(data);

        commit(FETCH_FAVOURITE_MESSAGES_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FETCH_FAVOURITE_MESSAGES_NEXT_PAGE + ERROR, e);
      }
    },
    async [ADD_FAVOURITE_MESSAGES]({commit}, payload) {
      commit(ADD_FAVOURITE_MESSAGES + REQUEST);

      try {
        const data = new FormData();
        data.append('ids', JSON.stringify(payload));

        const res = await api.messages.addFavourite(data);
        console.log(res);

        if(res.data.state) {
          commit(ADD_FAVOURITE_MESSAGES + SUCCESS);
          commit(chatMessagesModule + RESET_SELECTED_MESSAGES, null, { root: true });
        } else {
          console.log('something went wrong')
        }
      } catch (e) {
        console.log(e);
        commit(ADD_FAVOURITE_MESSAGES + ERROR, e);
      }
    },
    async [DELETE_FAVOURITE_MESSAGES]({commit}, payload) {
      commit(DELETE_FAVOURITE_MESSAGES + REQUEST);

      const { ids, onSuccess } = payload;

      try {
        const data = new FormData();
        data.append('ids', JSON.stringify(ids));

        const res = await api.messages.deleteFavourite(data);
        console.log(res);

        if(res.data.state) {
          // commit(DELETE_FAVOURITE_MESSAGES + SUCCESS, ids);
          commit(chatMessagesModule + RESET_SELECTED_MESSAGES, null, { root: true });
          if(onSuccess) onSuccess();
        } else {
          console.log('something went wrong')
        }
      } catch (e) {
        console.log(e);
        commit(DELETE_FAVOURITE_MESSAGES + ERROR, e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [FAVOURITE_MESSAGES](state) {
      return state.messages
    }
  }
};

export default module;
