import axios from 'axios';

function objectToFormData(object) {
  if (object instanceof FormData) {
    return object;
  }
  const result = new FormData();
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const item = object[key];
      let preparedItem;
      if (item instanceof Blob) {
        preparedItem = item;
      } else if (typeof item === 'object') {
        preparedItem = JSON.stringify(item);
      } else {
        preparedItem = item;
      }
      preparedItem && result.append(key.toString(), preparedItem);
    }
  }
  return result;
}

export default {
  auth: {
    register: (data, config) =>
      axios.post('v1/register-without-drotr', objectToFormData(data), config),
    getGuest: (lang, config) =>
      axios.post('v1/guest/get', objectToFormData({lang}), config),
    authenticate: (data, config) =>
      axios.post('oauth/token', objectToFormData(data), config),
    // axios.post('v1/register', objectToFormData(data), config)
  },
  user: {
    getUser: () =>
      axios.get('/v1/me'),
    subscribeUser: ({data, config = null}) =>
      axios.post('v1/users/subscribe', data, config),
    getUserFeeds: data =>
      axios.post('v1/me/feeds/new/all', data),
    viewFeeds: data =>
      axios.post('v1/me/feeds/view', data),
    unwatchedFeeds: () =>
      axios.get('v1/me/feeds/unwatched?by_type=true'),
    changeMySettings: data =>
      axios.post('v1/me/settings/edit', data),
    sendChinChin: data =>
      axios.post('v1/me/chats/messages/chin', data),
    checkChat: data =>
      axios.post('v1/me/chats/check', data),
    acceptGift: data =>
      axios.post('v1/me/gifts/accept', data),
    changeAvatar: data =>
      axios.post('v1/me/settings/avatar/change', data),
    editBaseSettings: data =>
      axios.post('v1/me/settings/base/edit', data),
    editSettings: data =>
      axios.post('v1/me/settings/edit', data),
    createUpload: data =>
      axios.post('v1/uploads/create', data),
    loadUpload: (data, config) =>
      axios.post('v1/uploads/load', data, config),
    loadImageUpload: (data, config) =>
      axios.post('v1/uploads/load-image', data, config),
    getBookmarks: data =>
      axios.post('v1/me/posts/bookmarks/all', data),
    getMentions: data =>
      axios.post('v1/me/posts/mentions/all', data),
    addToBlackList: data =>
      axios.post('v1/me/settings/blacklist/add', data),
    deleteFromBlackList: data =>
      axios.post('v1/me/settings/blacklist/delete', data),
    getRecommendations: data =>
      axios.post('v1/me/recommendations', data),
    getAllSubscribtionsPosts: data =>
      axios.post('v1/me/posts/subscriptions/all', data),
    getOutgoingRequests: data =>
      axios.post('v1/users/subscribers/requests/all', data),
    deleteRequest: data =>
      axios.post('v1/users/subscribers/requests/delete', data),
    getAdminStatistic: () =>
      axios.get('v1/me/statistic/admin/all?from=2017-01-01&to=today'),
    getWalletInfo: () =>
      axios.get('v1/me/wallet/info'),
    getCoinPacks: () =>
      axios.get('v1/me/wallet/coinpacks/all'),
    buyCoinPack: params =>
      axios.get('v1/me/wallet/coinpacks/buy', params)
  },
  users: {
    getAll: data =>
      axios.post('v1/users/all', data),
    getUser: data =>
      axios.post('v1/users/get', data),
    subscribeUser: data =>
      axios.post('v1/users/subscribe', data),
    reportPost: data =>
      axios.post('v1/users/posts/report', data),
    getPostStatistics: data =>
      axios.post('v1/users/posts/statistics/get', data),
    profileVisitFromPost: data =>
      axios.post('v1/users/posts/actions/add', data),
    addUserPost: (data, config) =>
      axios.post('v1/users/posts/add', data, config),
    getPost: data =>
      axios.post('v1/users/posts/get', data),
    getPosts: data =>
      axios.post('v1/users/posts/all', data),
    voteUser: data =>
      axios.post('v1/users/vote', data),
    deletePost: data =>
      axios.post('v1/users/posts/delete', data),
    sendViewedPosts: data =>
      axios.post('v1/users/posts/view', data),
    repostPost: data =>
      axios.post('v1/users/posts/repost', data),
    likePost: data =>
      axios.post('v1/users/posts/like', data),
    bookmarkPost: data =>
      axios.post('v1/users/posts/bookmark', data),
    usersSearch: data =>
      axios.post('v1/users/search', data),
    approveUser: data =>
      axios.post('v1/users/subscribers/requests/approve', data),
    getRatingHistory: data =>
      axios.post('v1/rating-history/get', data),
    deleteMentionOfCurrentUser: data =>
      axios.post('v1/users/posts/mentions/delete', data),
  },
  post: {
    makeRepost: data =>
      axios.post('v1/users/posts/repost', data),
    editPost: data =>
      axios.post('v1/users/posts/edit', data),
    searchChunks: data =>
      axios.post('v1/me/posts/search/chunks', data),
    comments: {
      delete: data =>
        axios.post('v1/users/posts/comments/delete', data),
      getAll: data =>
        axios.post('v1/users/posts/comments/all', data),
      add: data =>
        axios.post('v1/users/posts/comments/add', data)
    }
  },
  stories: {
    getAllStories: () =>
      axios.get('v1/users/stories/all'),
    deleteStory: data =>
      axios.post('v1/users/posts/delete', data),
    getActiveStories: data =>
      axios.post('v1/users/stories/get', data),
    getArchivedStories: data =>
      axios.post('v1/users/stories/archive/all', data),
    getStoryAlbums: data =>
      axios.post('v1/users/stories/albums/all', data),
    getStoryAlbum: data =>
      axios.post('v1/users/stories/albums/get', data),
    addStoryAlbum: data =>
      axios.post('v1/users/stories/albums/add', data),
    deleteStoryAlbum: data =>
      axios.post('v1/users/stories/albums/delete', data),
  },
  blacklist: {
    addToBlackList: ({data, config = null}) =>
      axios.post('v1/me/settings/blacklist/add', data, config),
  },
  gifts: {
    getMyGifts: data =>
      axios.post('v1/me/gifts/all', data),
    getAll: () =>
      axios.get('v1/gifts/all'),
    send: data =>
      axios.post('v1/me/gifts/send', data),
    sendCoins: data =>
      axios.post('v1/me/wallet/send', data),
  },
  groups: {
    getGroupSubjects: data =>
      axios.post('v1/groups/subjects/all', data),
    createGroup: data =>
      axios.post('v1/groups/create', data),
    getGroup: data =>
      axios.post('v1/groups/get', data),
    subscribeToGroup: data =>
      axios.post('v1/groups/join', data),
    getGroupVideos: data =>
      axios.post('v1/groups/videos/all', data),
    getGroupAlbums: data =>
      axios.post('v1/albums/all', data),
    getGroupPosts: data =>
      axios.post('v1/groups/posts/all', data),
    addGroupPost: data =>
      axios.post('v1/groups/posts/add', data),
    inviteToGroup: data =>
      axios.post('v1/groups/invite/add', data),
    getMyGroups: data =>
      axios.post('v1/me/groups/all', data),
    getGroups: data =>
      axios.post('v1/groups/all',data),
    getGroupSearch: (data, config) =>
      axios.post('v1/groups/search', data, config),
    deletePost: data =>
      axios.post('v1/groups/posts/delete', data),
    getGroupUsers: data =>
      axios.post('v1/groups/users/all', data),
    kickUserFromGroup: data =>
      axios.post('v1/groups/users/kick',  objectToFormData(data)),
    getGroupRequests: data =>
      axios.post('v1/groups/users/requests', data),
    approveGroupUser: data =>
      axios.post('v1/groups/users/requests/apply', data),
    setRoleForUser: data =>
      axios.post('v1/groups/users/role', objectToFormData(data)),
    getBlacklist: data =>
      axios.post('v1/groups/blacklist/all', objectToFormData(data)),
    addUserToBlackList: data =>
      axios.post('v1/groups/blacklist/add', objectToFormData(data)),
    removeUserFromBlackList: data =>
      axios.post('v1/groups/blacklist/delete', objectToFormData(data)),
    addVideo: data =>
      axios.post('v1/groups/videos/add', data),
    addAlbum: data =>
      axios.post('v1/albums/create', data),
  },
  albums: {
    getAlbumPosts: data =>
      axios.post('v1/albums/posts/all', data),
    getAlbum: data =>
      axios.post('v1/albums/get', data),
    addAlbumPost: data =>
      axios.post('v1/albums/posts/add', data),
    deleteAlbumPost: data =>
      axios.post('v1/albums/posts/delete', data),
    createAlbum: data =>
      axios.post('v1/albums/create', data),
    updateAlbum: data =>
      axios.post('v1/albums/edit', data),
    deleteAlbum: data =>
      axios.post('v1/albums/delete', data),
  },
  search: {
    getPosts: data =>
      axios.post('v1/users/posts/search',data),
  },
  chat: {
    getAll: data =>
      axios.post('v1/me/chats/all', data),
    getList: data =>
      axios.post('v1/me/chats/list', data),
    addToArchive: data =>
      axios.post('v1/me/chats/archive', data),
    deleteChat: data =>
      axios.post('v1/me/chats/delete', data),
    getChat: data =>
      axios.post('v1/me/chats/get', data),
    getUnreadMessagesCount: () =>
      axios.get('v1/me/chats/messages/unread'),
    readMessages: data =>
      axios.post('v1/me/chats/messages/read', data),
    create: data =>
      axios.post('v1/me/chats/create', data),
    getArchive: data =>
      axios.post('v1/me/chats/archived/all', data),
    search: data =>
      axios.post('v1/me/chats/search', data)
  },
  messages: {
    getAll: data =>
      axios.post('v1/me/chats/messages/all', data),
    send: data =>
      axios.post('v1/me/chats/messages/send', data),
    distribution: data =>
      axios.post('v1/me/chats/messages/distribution', data),
    getFavourite: data =>
      axios.post('v1/me/chats/messages/favourite/all', data),
    addFavourite: data =>
      axios.post('v1/me/chats/messages/favourite/add', data),
    deleteFavourite: data =>
      axios.post('v1/me/chats/messages/favourite/delete', data),
    delete: data =>
      axios.post('v1/me/chats/messages/delete', data),
    forwardMessage: data =>
      axios.post('v1/me/chats/messages/forward', data),
    forwardPost: data =>
      axios.post('v1/me/chats/messages/forward-post', data)
  },
  banner: {
    getAll: () =>
      axios.get('v1/banners/all'),
    getBanner: data =>
      axios.post('v1/banners/get', data)
  },
  contests: {
    getAll: data =>
      axios.post('v1/contests/all', data)
  }
}
