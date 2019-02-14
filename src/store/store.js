import Vue from 'vue';
import Vuex from 'vuex';
import registration from 'Store/modules/registration';
import authentication from 'Store/modules/authentication';
import countPostOnPage from 'Store/modules/countPostOnPage';
import user from 'Store/modules/authUser/user';
import users from 'Store/modules/users/users';
import gifts from 'Store/modules/authUser/gifts';
import searchIntags from 'Store/modules/search/searchIntags'
import searchPeople from 'Store/modules/search/searchPeople'
import usersWhoHasActiveStories from 'Store/modules/usersWhoHasActiveStories'
import feeds from 'Store/modules/feeds'
import groupVideos from 'Store/modules/groups/groupVideos';
import groupAlbums from 'Store/modules/groups/groupAlbums';
import groupPosts from 'Store/modules/groups/groupPosts';
import groupsAll from 'Store/modules/groups/groupsAll'
import groups from 'Store/modules/groups/groups'
import albumPosts from 'Store/modules/albumPosts';
import posts from 'Store/modules/posts';
import usersProfilePosts from 'Store/modules/users/usersProfilePosts';
import userArchivedStories from 'Store/modules/users/userArchivedStories';
import userActiveStories from 'Store/modules/users/userActiveStories';
import userStoryAlbums from 'Store/modules/users/userStoryAlbums';
import userStoryPosts from 'Store/modules/users/userStoryPosts';
import mainPosts from 'Store/modules/mainPosts';
import repost from 'Store/modules/repost';
import bookmarks from 'Store/modules/authUser/bookmarks';
import mentions from 'Store/modules/authUser/mentions';
import subscribers from 'Store/modules/users/subscribers';
import blackList from 'Store/modules/authUser/blackList';
import chats from 'Store/modules/chats/chats';
import subscriptions from 'Store/modules/users/subscriptions';
import requests from 'Store/modules/authUser/requests';
import groupUsers from 'Store/modules/groups/groupUsers';
import groupRequests from 'Store/modules/groups/groupRequests';
import groupBlacklist from 'Store/modules/groups/groupBlacklist';
import newPost from 'Store/modules/newPost';
import chatsAll from 'Store/modules/chats/chatsAll';
import chatMessages from 'Store/modules/chats/chatMessages';
import chatsArchive from 'Store/modules/chats/chatsArchive';
import chatsAllSearch from 'Store/modules/chats/chatsAllSearch';
import chatFavouriteMessages from 'Store/modules/chats/chatFavouriteMessages';
import intagsHistory from 'Store/modules/intagsHistory';
import outgoingRequests from 'Store/modules/authUser/outgoingRequests';
import searchLocation from 'Store/modules/search/searchLocation';
import searchGroups from 'Store/modules/search/searchGroups';
import banners from 'Store/modules/banners';
import storiesNavigation from 'Store/modules/storiesNavigation';
import wallet from 'Store/modules/wallet';
import postNavigation from 'Store/modules/postNavigation';
import searchPageGroups from 'Store/modules/searchPage/searchPageGroups';
import searchPageContests from 'Store/modules/searchPage/searchPageContests';
import searchPageEvents from 'Store/modules/searchPage/searchPageEvents';
import searchPageCommunities from 'Store/modules/searchPage/searchPageCommunities';
import searchPageUsers from 'Store/modules/searchPage/searchPageUsers';
import searchPageRecommendations from 'Store/modules/searchPage/searchPageRecommendations';

import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    countPostOnPage,
    registration,
    authentication,
    user,
    users,
    gifts,
    searchIntags,
    searchPeople,
    usersWhoHasActiveStories,
    feeds,
    groupVideos,
    groupAlbums,
    groupPosts,
    groups,
    groupsAll,
    groupUsers,
    groupRequests,
    groupBlacklist,
    albumPosts,
    posts,
    usersProfilePosts,
    userArchivedStories,
    userActiveStories,
    userStoryAlbums,
    userStoryPosts,
    mainPosts,
    repost,
    bookmarks,
    mentions,
    subscribers,
    blackList,
    chats,
    subscriptions,
    requests,
    newPost,
    chatsAll,
    chatMessages,
    chatsArchive,
    chatsAllSearch,
    chatFavouriteMessages,
    intagsHistory,
    outgoingRequests,
    searchLocation,
    searchGroups,
    banners,
    storiesNavigation,
    wallet,
    postNavigation,
    searchPageGroups,
    searchPageContests,
    searchPageEvents,
    searchPageCommunities,
    searchPageUsers,
    searchPageRecommendations,
  },
  plugins: [createLogger()]
});

export default store;
