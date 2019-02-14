import api from 'utils/api'
import Vuex from 'vuex'

window.storeBlackList=new Vuex.Store({
  state: {

  },
  actions: {
    ADD_TO_BLACKLIST({}, info){
        let data=info;
        let config=null;
        api.blacklist.addToBlackList({data,config})
          .then(res=>{
          })
    }
  }
});
