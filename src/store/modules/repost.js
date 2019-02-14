import {SUCCESS} from "Store/types";
import api from "utils/api";
import {ADD_IS_REPOSTED, ADD_POST_TO_MAIN_PAGE, moduleName as mainPostsModule} from "Store/modules/mainPosts";
import {ADD_POST_TO_PROFILE, moduleName as userProfilePostsModule} from "Store/modules/users/usersProfilePosts";

/**
 * Types
 * */
export const moduleName = 'repost/';

/** Actions types*/
export const FETCH_REPOST = 'FETCH_REPOST';

/** mutation types */
export const MAKE_REPOST = 'MAKE_REPOST';

const module = {
  namespaced: true,
  state: {
    authUser: {},
  },
  mutations: {
    [MAKE_REPOST + SUCCESS](state) {

    },
  },
  actions: {
    async [FETCH_REPOST]({commit, state, rootState}, payload) {

      const {id, title, intags, onSuccess} = payload;

      let data = new FormData();
      data.append('id', id);
      data.append('title', title);
      data.append('intags', intags);

      try {
        let res = await api.post.makeRepost(data);
        console.log(res);

        const result = {
          nickname: rootState.user.user.nickname,
          data: [res.data.post]
        };

        if (res.data.state) {
          commit(mainPostsModule + ADD_POST_TO_MAIN_PAGE, res.data.post, { root: true });
          commit(userProfilePostsModule + ADD_POST_TO_PROFILE, result, { root: true });
          commit(mainPostsModule + ADD_IS_REPOSTED, { id, isReposted: true } , { root: true });
          onSuccess();
        }

      }
      catch (e) {

      }
    }
  },
  getters: {}

};

export default module;
