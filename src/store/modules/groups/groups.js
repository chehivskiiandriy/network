import api from 'utils/api';
import router from '../../../router'
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {moduleName as groupsAllModule, RESET_MY} from "Store/modules/groups/groupsAll";

/**
 * Types
 * */

export const moduleName = 'groups/';

/** Actions types*/
export const CREATE_GROUP = 'CREATE_GROUP';
export const FETCH_CURRENT_GROUP = 'FETCH_CURRENT_GROUP';
export const SUBSCRIBE_USER = 'SUBSCRIBE_USER';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_GROUP_USER_COUNT = 'CHANGE_GROUP_USER_COUNT';
export const CHANGE_GROUP_REQUESTS_COUNT = 'CHANGE_GROUP_REQUESTS_COUNT';

/** Getters types*/
export const CURRENT_GROUP = 'CURRENT_GROUP';

const module = {
  namespaced: true,
  state: {
    groups: {},
    lastPage: 1,
    nextPage: 2,
    groupAlbums: {},
    loaded: false,
    loading: false,
    creatingError: null,
  },
  mutations: {
    [FETCH_CURRENT_GROUP + REQUEST](state) {
      state.loading = true;
    },
    [FETCH_CURRENT_GROUP + SUCCESS](state, group) {
      state.loading = false;
      state.loaded = true;
      state.groups = {
        ...state.groups,
        [group.slug]: group,
      }
    },
    [FETCH_CURRENT_GROUP + ERROR](state) {
      state.loading = false;
      state.loaded = true;
    },
    [CREATE_GROUP + ERROR](state, error) {
      state.loading = false;
      state.loaded = true;
      state.creatingError = error;
    },
    [SUBSCRIBE_USER + SUCCESS](state, data) {
      state.groups[data.slug].group_user = data.info;
    },
    [CHANGE_GROUP_USER_COUNT](state, payload) {
      state.groups[payload.groupSlug].users_count += payload.state;
    },
    [CHANGE_GROUP_REQUESTS_COUNT](state, payload) {
      state.groups[payload].requests_count = state.groups[payload].requests_count - 1;
    }
  },
  actions: {
    async [CREATE_GROUP]({commit}, payload) {
      commit(FETCH_CURRENT_GROUP + REQUEST);

      const type = payload.getAll('type')[0];

      try {
        let res = await api.groups.createGroup(payload);
        commit(FETCH_CURRENT_GROUP + SUCCESS, res.data);
        commit(groupsAllModule + RESET_MY, type, {root: true});
        router.push('/group/' + res.data.slug);
      } catch (e) {
        console.error(e);
        commit(CREATE_GROUP + ERROR, e.message || e.toString());
      }
    },
    async [FETCH_CURRENT_GROUP]({commit}, payload) {
      commit(FETCH_CURRENT_GROUP + REQUEST);
      const data = new FormData();
      data.append('slug', payload);

      try {
        let res = await api.groups.getGroup(data);
        commit(FETCH_CURRENT_GROUP + SUCCESS, res.data);
      }
      catch (e) {
        console.error(e);
      }
    },
    async [SUBSCRIBE_USER]({commit}, payload) {
      const {data, onSuccess, onFail} = payload;
      try {

        let res = await api.groups.subscribeToGroup(data);
        let sandData = {
          info: res.data,
          slug: data.get('group_slug'),
        };

        onSuccess();
        commit(SUBSCRIBE_USER + SUCCESS, sandData);
      }
      catch(e) {
        console.error(e);
          onFail();
      }
    }
  },
  getters: {
    [CURRENT_GROUP]: state => slug => {
      return state.groups[slug];
    }
  }
};

export default module;
