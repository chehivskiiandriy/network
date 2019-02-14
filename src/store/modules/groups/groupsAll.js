import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

/**
 * Types
 * */
export const moduleName = 'groupsAll/';

/** Actions types*/
export const FETCH_MY_GROUPS = 'FETCH_MY_GROUPS';
export const FETCH_MY_GROUPS_NEXT_PAGE = 'FETCH_MY_GROUPS_NEXT_PAGE';
export const FETCH_RECOMMENDATIONS = 'FETCH_RECOMMENDATIONS';
export const FETCH_RECOMMENDATIONS_NEXT_PAGE = 'FETCH_RECOMMENDATIONS_NEXT_PAGE';
export const FETCH_SEARCH_GROUPS = 'FETCH_SEARCH_GROUPS';
export const FETCH_SEARCH_GROUPS_NEXT_PAGE = 'FETCH_SEARCH_GROUPS_NEXT_PAGE';
export const FETCH_GROUP_SUBJECTS = 'FETCH_GROUP_SUBJECTS';
export const FETCH_GROUP_SUBJECTS_NEXT_PAGE = 'FETCH_GROUP_SUBJECTS_NEXT_PAGE';

/** Mutation types*/
export const FETCH = 'FETCH';
export const CHANGE_TYPE = 'CHANGE_TYPE';
export const CHANGE_ACTIVE_MENU = 'CHANGE_ACTIVE_MENU';
export const CHANGE_CATEGORY = 'CHANGE_CATEGORY';
export const CHANGE_MY_SHOW_LOADING = 'CHANGE_MY_SHOW_LOADING';
export const CHANGE_RECOMMENDATIONS_SHOW_LOADING = 'CHANGE_RECOMMENDATIONS_SHOW_LOADING';
export const CHANGE_SEARCH_SHOW_LOADING = 'CHANGE_SEARCH_SHOW_LOADING';
export const RESET_MY = 'RESET_MY';
export const RESET_RECOMMENDATION = 'RESET_RECOMMENDATION';
export const RESET_SEARCH = 'RESET_SEARCH';
export const FETCH_MY = 'FETCH_MY';
export const FETCH_RECOMMENDATION = 'FETCH_RECOMMENDATION';
export const FETCH_SEARCH = 'FETCH_SEARCH';
export const CHANGE_GROUP_SUBJECTS_SHOW_LOADING = 'CHANGE_GROUP_SUBJECTS_SHOW_LOADING';
export const FETCH_SUBJECTS = 'FETCH_SUBJECTS';
export const CHANGE_ACTIVE_SEARCH = 'CHANGE_ACTIVE_SEARCH';
export const FETCH_SEARCH_FROM_STATE = 'FETCH_SEARCH_FROM_STATE';
export const CHANGE_SEARCH_INPUT = 'CHANGE_SEARCH_INPUT';

/** Getters types*/
export const MY_GROUPS = 'MY_GROUPS';
export const RECOMMENDATIONS = 'RECOMMENDATIONS';
export const SEARCH_GROUPS = 'SEARCH_GROUPS';
export const LOADING_MY = 'LOADING_MY';
export const LOADING_RECOMMENDATION = 'LOADING_RECOMMENDATION';
export const TYPE = 'TYPE';
export const ACTIVE_MENU = 'ACTIVE_MENU';
export const CATEGORY = 'CATEGORY';
export const GROUP_SUBJECTS = 'GROUP_SUBJECTS';
export const ACTIVE_SEARCH = 'ACTIVE_SEARCH';
export const LOADING_SEARCH = 'LOADING_SEARCH';
export const SEARCH_INPUT = 'SEARCH_INPUT';

const module = {
  namespaced: true,
  state: {
    activeMenu: 'my',
    activeSearch: false,
    type: 'group',
    category: 0,
    my: {
      group: [],
      community: [],
      event: [],
    },
    myMeta: {
      group: {
        nextPage: 2,
        lastPage: 1,
        loading: false,
        showLoading: true,
      },
      event: {
        nextPage: 2,
        lastPage: 1,
        loading: false,
        showLoading: true,
      },
      community: {
        nextPage: 2,
        lastPage: 1,
        loading: false,
        showLoading: true,
      },
    },
    recommendations: {
      group: [],
      event: [],
      community: [],
    },
    recommendationsMeta: {
      group: {
        nextPage: 2,
        lastPage: 1,
        loading: false,
        showLoading: true,
      },
      event: {
        nextPage: 2,
        lastPage: 1,
        loading: false,
        showLoading: true,
      },
      community: {
        nextPage: 2,
        lastPage: 1,
        loading: false,
        showLoading: true,
      },
    },
    search: [],
    searchMeta: {
      nextPage: 2,
      lastPage: 1,
      loading: false,
      showLoading: true,
    },
    groupSubjects: [],
    groupSubjectsMeta: {
      nextPage: 2,
      lastPage: 1
    },
    groupSubjectsLoading: false,
    groupSubjectsShowLoading: true,
    searchInput: '',
    isChangedSearch: true,
    isUpdateInputSearch: false
  },
  mutations: {
    [FETCH_MY_GROUPS + REQUEST](state, payload) {
      state.myMeta[payload].loading = true;
    },
    [FETCH_MY_GROUPS + SUCCESS](state, payload) {
      state.my[payload.type] = payload.data.data;
      state.myMeta[payload.type].nextPage = payload.data.meta.current_page + 1;
      state.myMeta[payload.type].lastPage = payload.data.meta.last_page;
      state.myMeta[payload.type].loading = false;
      state.myMeta[payload.type].showLoading = true;
    },
    [FETCH_MY_GROUPS + ERROR](state, payload) {
      state.myMeta[payload].loading = false;
      state.myMeta[payload].showLoading = true;
    },
    [FETCH_MY_GROUPS_NEXT_PAGE + REQUEST](state, payload) {
      state.myMeta[payload].loading = true;
    },
    [FETCH_MY_GROUPS_NEXT_PAGE + SUCCESS](state, payload) {
      state.my[payload.type].push(...payload.data.data);
      state.myMeta[payload.type].nextPage = payload.data.meta.current_page + 1;
      state.myMeta[payload.type].loading = false;
    },
    [FETCH_MY_GROUPS_NEXT_PAGE + ERROR](state, payload) {
      state.myMeta[payload].loading = false;
    },
    [FETCH_RECOMMENDATIONS + REQUEST](state, payload) {
      state.recommendationsMeta[payload].loading = true;
    },
    [FETCH_RECOMMENDATIONS + SUCCESS](state, payload) {
      state.recommendations[payload.type] = payload.data.data;
      state.recommendationsMeta[payload.type].nextPage = payload.data.meta.current_page + 1;
      state.recommendationsMeta[payload.type].lastPage = payload.data.meta.last_page;
      state.recommendationsMeta[payload.type].loading = false;
      state.recommendationsMeta[payload.type].showLoading = true;
    },
    [FETCH_RECOMMENDATIONS + ERROR](state, payload) {
      state.recommendationsMeta[payload].loading = false;
      state.recommendationsMeta[payload].showLoading = true;
    },
    [FETCH_RECOMMENDATIONS_NEXT_PAGE + REQUEST](state, payload) {
      state.recommendationsMeta[payload].loading = true;
    },
    [FETCH_RECOMMENDATIONS_NEXT_PAGE + SUCCESS](state, payload) {
      state.recommendations[payload.type].push(...payload.data.data);
      state.recommendationsMeta[payload.type].nextPage = payload.data.meta.current_page + 1;
      state.recommendationsMeta[payload.type].loading = false;
    },
    [FETCH_RECOMMENDATIONS_NEXT_PAGE + ERROR](state, payload) {
      state.recommendationsMeta[payload].loading = false;
    },
    [FETCH_SEARCH_GROUPS + REQUEST](state) {
      state.searchMeta.loading = true;
    },
    [FETCH_SEARCH_GROUPS + SUCCESS](state, payload) {
      state.search = payload.data.data;
      state.searchMeta.nextPage = payload.data.meta.current_page + 1;
      state.searchMeta.lastPage = payload.data.meta.last_page;
      state.searchMeta.loading = false;
      state.searchMeta.showLoading = true;
      state.isChangedSearch = false;
      state.isUpdateInputSearch = false;
    },
    [FETCH_SEARCH_GROUPS + ERROR](state, e) {
      state.searchMeta.loading = false;
    },
    [FETCH_SEARCH_GROUPS_NEXT_PAGE + REQUEST](state) {
      state.searchMeta.loading = true;
    },
    [FETCH_SEARCH_GROUPS_NEXT_PAGE + SUCCESS](state, payload) {
      state.search.push(...payload.data.data);
      state.searchMeta.nextPage = payload.data.meta.current_page + 1;
      state.searchMeta.lastPage = payload.data.meta.last_page;
      state.searchMeta.loading = false;
    },
    [FETCH_SEARCH_GROUPS_NEXT_PAGE + ERROR](state, e) {
      state.searchMeta.loading = false;
    },
    [RESET_MY](state, payload) {
      state.my[payload] = [];
    },
    [RESET_RECOMMENDATION](state, payload) {
      state.recommendations[payload] = [];
    },
    [RESET_SEARCH](state) {
      state.search = [];
    },
    [FETCH_MY + SUCCESS](state, payload) {
      state.myMeta[payload].loading = false;
      state.myMeta[payload].showLoading = true;
    },
    [FETCH_RECOMMENDATION + SUCCESS](state, payload) {
      state.recommendationsMeta[payload].loading = false;
      state.recommendationsMeta[payload].showLoading = true;
    },
    [FETCH_SEARCH + SUCCESS](state) {
      state.searchMeta.loading = false;
      state.searchMeta.showLoading = true;
    },
    [CHANGE_MY_SHOW_LOADING](state, payload) {
      state.myMeta[payload.type].showLoading = payload.showLoading;
    },
    [CHANGE_RECOMMENDATIONS_SHOW_LOADING](state, payload) {
      state.recommendationsMeta[payload.type].showLoading = payload.showLoading;
    },
    [CHANGE_SEARCH_SHOW_LOADING](state, payload) {
      state.searchMeta.showLoading = payload.showLoading;
    },
    [CHANGE_TYPE](state, payload) {
      if(state.activeSearch) {
        state.search = [];
      }
      state.type = payload;
    },
    [CHANGE_ACTIVE_MENU](state, payload) {
      state.activeMenu = payload;
      state.searchInput = '';
      state.isUpdateInputSearch = true;
    },
    [CHANGE_CATEGORY](state, payload) {
      state.category = payload;
      state.recommendations.group = [];
      state.recommendations.event = [];
      state.recommendations.community = [];
      state.isChangedSearch = true;
    },
    [FETCH_GROUP_SUBJECTS + REQUEST](state) {
      state.groupSubjectsLoading = true;
    },
    [FETCH_GROUP_SUBJECTS + SUCCESS](state, payload) {
      state.groupSubjects = payload.data;
      state.groupSubjectsMeta.nextPage = payload.meta.current_page + 1;
      state.groupSubjectsMeta.lastPage = payload.meta.last_page;
      state.groupSubjectsLoading = false;
      state.groupSubjectsShowLoading = true;
    },
    [FETCH_GROUP_SUBJECTS + ERROR](state, error) {
      state.groupSubjectsLoading = false;
    },
    [FETCH_GROUP_SUBJECTS_NEXT_PAGE + REQUEST](state) {
      state.groupSubjectsLoading = true;
    },
    [FETCH_GROUP_SUBJECTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.groupSubjects.push(...payload.data);
      state.groupSubjectsMeta.nextPage = payload.meta.current_page + 1;
      state.groupSubjectsLoading = false;
    },
    [FETCH_GROUP_SUBJECTS_NEXT_PAGE + ERROR](state, error) {
      state.groupSubjectsLoading = false;
    },
    [CHANGE_GROUP_SUBJECTS_SHOW_LOADING](state, payload) {
      state.groupSubjectsShowLoading = payload;
    },
    [FETCH_SUBJECTS + SUCCESS](state) {
      state.groupSubjectsLoading = false;
      state.groupSubjectsShowLoading = true;
    },
    [CHANGE_ACTIVE_SEARCH](state) {
      if(state.activeSearch) {
        state.search = [];
      } else {
        state.search = [...state[state.activeMenu][state.type].slice(0, 24)];
      }
      state.activeSearch = !state.activeSearch;
      state.searchInput = '';
      state.isUpdateInputSearch = true;
    },
    [FETCH_SEARCH_FROM_STATE](state, payload) {
      state.search = payload;
    },
    [CHANGE_SEARCH_INPUT](state, payload) {
      state.searchInput = payload;
      state.isUpdateInputSearch = true;
    }
  },
  actions: {
    async [FETCH_MY_GROUPS]({commit, state}) {
      const type = state.type;

      if (state.my[type].length > 0) {
        const changePayload = {
          type,
          showLoading: false
        };
        commit(CHANGE_MY_SHOW_LOADING, changePayload);
      }
      commit(FETCH_MY_GROUPS + REQUEST, type);

      try {
        let data = new FormData();
        data.append('type', type);
        data.append('query', '');
        data.append('where', 'my');
        data.append('shortList', '1');
        data.append('without_user_groups', 'true');

        let res = await api.groups.getGroupSearch(data);

        if (state.my[type].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.my[type][0].id) {
          commit(FETCH_MY + SUCCESS, type);
          return;
        }

        const payload = {
          type,
          data: res.data
        };
        commit(FETCH_MY_GROUPS + SUCCESS, payload);
      }
      catch (e) {
        console.log(e);
        commit(FETCH_MY_GROUPS + ERROR, type);
      }
    },
    async [FETCH_MY_GROUPS_NEXT_PAGE]({commit, state}) {
      const type = state.type;

      if (state.myMeta[type].lastPage < state.myMeta[type].nextPage || state.myMeta[type].loading) {
        return;
      }

      commit(FETCH_MY_GROUPS_NEXT_PAGE + REQUEST, type);

      try {
        let data = new FormData();
        data.append('type', type);
        data.append('query', '');
        data.append('where', 'my');
        data.append('shortList', '1');
        data.append('without_user_groups', 'true');
        data.append('page', state.myMeta[type].nextPage);

        let res = await api.groups.getGroupSearch(data);

        const payload = {
          type,
          data: res.data
        };

        commit(FETCH_MY_GROUPS_NEXT_PAGE + SUCCESS, payload);
      }
      catch (e) {
        console.log(e);
        commit(FETCH_MY_GROUPS_NEXT_PAGE + ERROR, type);
      }
    },
    async [FETCH_RECOMMENDATIONS]({commit, state}) {
      const type = state.type;
      const category = state.category;

      if (state.recommendations[type].length > 0) {
        const changePayload = {
          type,
          showLoading: false
        };
        commit(CHANGE_RECOMMENDATIONS_SHOW_LOADING, changePayload);
      }

      commit(FETCH_RECOMMENDATIONS + REQUEST, type);

      try {
        let data = new FormData();
        data.append('type', type);
        data.append('query', '');
        data.append('where', 'recommended');
        data.append('limit', '24');
        data.append('shortList', '1');
        data.append('without_user_groups', 'true');
        data.append('id_category', category);

        let res = await api.groups.getGroupSearch(data);

        if (!state.isUpdateInputSearch && state.recommendations[type].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.recommendations[type][0].id) {
          commit(FETCH_RECOMMENDATION + SUCCESS, type);
          return;
        }

        const payload = {
          type,
          data: res.data
        };

        commit(FETCH_RECOMMENDATIONS + SUCCESS, payload);
      } catch (e) {
        console.log(e);
        commit(FETCH_RECOMMENDATIONS + ERROR, type);
      }
    },
    async [FETCH_RECOMMENDATIONS_NEXT_PAGE]({commit, state}) {
      const type = state.type;
      const category = state.category;

      if (state.recommendationsMeta[type].lastPage < state.recommendationsMeta[type].nextPage || state.recommendationsMeta[type].loading) {
        return;
      }

      commit(FETCH_RECOMMENDATIONS_NEXT_PAGE + REQUEST, type);

      try {
        let data = new FormData();
        data.append('type', type);
        data.append('query', '');
        data.append('where', 'recommended');
        data.append('limit', '24');
        data.append('shortList', '1');
        data.append('without_user_groups', 'true');
        data.append('page', state.recommendationsMeta[type].nextPage);
        data.append('id_category', category);

        let res = await api.groups.getGroupSearch(data);

        const payload = {
          type,
          data: res.data
        };
        commit(FETCH_RECOMMENDATIONS_NEXT_PAGE + SUCCESS, payload);
      }
      catch (e) {
        console.log(e);
        commit(FETCH_RECOMMENDATIONS_NEXT_PAGE + ERROR, type);
      }
    },
    async [FETCH_SEARCH_GROUPS]({commit, state}, payload) {
      const type = state.type, activeMenu = state.activeMenu, category = state.category;

      if(payload === '') {
        commit(FETCH_SEARCH_FROM_STATE, state[activeMenu][type].slice(0, 24));
      } else if(state.isChangedSearch) {
        commit(RESET_SEARCH);
      }

      if(state.search.length > 0) {
        commit(CHANGE_SEARCH_SHOW_LOADING, false);
      }

      commit(FETCH_SEARCH_GROUPS + REQUEST);

      const where = activeMenu === 'my' ? 'my' : 'recommended';

      try {
        let data = new FormData();
        data.append('type', type);
        data.append('query', payload);
        data.append('limit', '24');
        data.append('where', where);
        if(where === 'recommended') data.append('id_category', category);
        data.append('shortList', '1');

        let res = await api.groups.getGroupSearch(data);

        if (state.search.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.search[0].id) {
          commit(FETCH_SEARCH + SUCCESS, type);
          return;
        }

        let result = {
          data: res.data
        };

        commit(FETCH_SEARCH_GROUPS + SUCCESS, result);
      } catch (e) {
        console.log(e);
        commit(FETCH_SEARCH_GROUPS + ERROR, e);
      }
    },
    async [FETCH_SEARCH_GROUPS_NEXT_PAGE]({commit, state}, payload) {
      const type = state.type, activeMenu = state.activeMenu, category = state.category;

      const where = activeMenu === 'my' ? 'my' : 'recommended';

      try {
        let data = new FormData();
        data.append('type', type);
        data.append('query', payload);
        data.append('limit', '24');
        data.append('where', where);
        if(where === 'recommended') data.append('id_category', category);
        data.append('shortList', '1');
        data.append('page', state.searchMeta.nextPage);

        let res = await api.groups.getGroupSearch(data);

        commit(FETCH_SEARCH_GROUPS_NEXT_PAGE + SUCCESS, res);
      } catch (e) {

      }
    },
    async [FETCH_GROUP_SUBJECTS]({commit, state}) {
      if (state.groupSubjects.length > 0) {
        commit(CHANGE_GROUP_SUBJECTS_SHOW_LOADING, false);
      }
      commit(FETCH_GROUP_SUBJECTS + REQUEST);

      const data = new FormData();
      data.append('subject_all', '1');

      try {
        let res = await api.groups.getGroupSubjects(data);

        if (state.groupSubjects.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.groupSubjects[0].id) {
          commit(FETCH_SUBJECTS + SUCCESS);
          return;
        }

        commit(FETCH_GROUP_SUBJECTS + SUCCESS, res.data);
      } catch (e) {
        commit(FETCH_GROUP_SUBJECTS + ERROR, e);
      }
    },
    async [FETCH_GROUP_SUBJECTS_NEXT_PAGE]({commit, state}) {
      if (state.groupSubjectsMeta.lastPage < state.groupSubjectsMeta.nextPage || state.groupSubjectsLoading) {
        return;
      }

      commit(FETCH_GROUP_SUBJECTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('page', state.groupSubjectsMeta.nextPage);
      data.append('subject_all', '1');

      try {
        let res = await api.groups.getGroupSubjects();

        commit(FETCH_GROUP_SUBJECTS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        commit(FETCH_GROUP_SUBJECTS_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [MY_GROUPS](state) {
      return state.my[state.type];
    },
    [RECOMMENDATIONS](state) {
      return state.recommendations[state.type];
    },
    [LOADING_MY](state) {
      return state.myMeta[state.type].loading && state.myMeta[state.type].showLoading;
    },
    [LOADING_RECOMMENDATION](state) {
      return state.recommendationsMeta[state.type].loading && state.recommendationsMeta[state.type].showLoading;
    },
    [LOADING_SEARCH](state) {
      return state.searchMeta.loading && state.searchMeta.showLoading
    },
    [SEARCH_GROUPS](state) {
      return state.search;
    },
    [TYPE](state) {
      return state.type
    },
    [ACTIVE_MENU](state) {
      return state.activeMenu
    },
    [CATEGORY](state) {
      return state.category
    },
    [GROUP_SUBJECTS](state) {
      return state.groupSubjects;
    },
    [ACTIVE_SEARCH](state) {
      return state.activeSearch
    },
    [SEARCH_INPUT](state) {
      return state.searchInput
    }
  }
};

export default module;
