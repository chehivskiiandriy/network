import Vue from 'vue'
import event from 'JsLib/emit.js'


Vue.prototype.$userStatus = (_user) =>{
    switch (_user.status) {
      case 'banned': {
        event.$emit('bannedUser');
        return false;
      }
      case 'banned_avatar': {
        event.$emit('bannedUserAvatar');
        return false;
      }
      case 'active': {
        return true;
      }
      case 'admin': {
        return true;
      }
      case 'guest': {
        event.$emit('guestUser');
        return false;
      }
      case 'no_chat_user': {
        event.$emit('noChatUser');
        return false;
      }
      case 'official_page': {
        return true;
      }
    }
};
