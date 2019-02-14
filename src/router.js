import Vue from 'vue';
import Router from 'vue-router';
import LoginForm from 'ComponentsVue/LoginPage.vue'
import Registration from 'ComponentsVue/Registration.vue'
import ContinueRegister from 'ComponentsVue/ContinueRegister'
import Main from 'ComponentsVue/Main.vue';
import UserProfile from 'ComponentsVue/UserProfile.vue'
import ProfilePost from 'ComponentsVue/profile/content/ProfilePost.vue'
import ProfileStories from 'ComponentsVue/profile/content/ProfileStories.vue'
import ProfileSubscribers from 'ComponentsVue/profile/content/ProfileSubscribers.vue'
import ProfileSubscriptions from 'ComponentsVue/profile/content/ProfileSubscriptions';
import ProfileBookmarks from 'ComponentsVue/profile/content/ProfileBookmarks.vue'
import ProfileMention from 'ComponentsVue/profile/content/ProfileMentions.vue'
import ProfileGift from 'ComponentsVue/profile/content/ProfileGifts.vue'
import ProfileScale from 'ComponentsVue/profile/content/ProfileScale.vue'
import PostAddCrop from 'ComponentsVue/postadd/PostAddCrop.vue'
import AddPost from 'ComponentsVue/postadd/AddPost'
import Feeds from 'ComponentsVue/Feed.vue'
import PostShow from 'ComponentsVue/PostShow.vue'
import PostStatistics from 'ComponentsVue/PostStatistics.vue'
import Search from 'ComponentsVue/Search.vue'
import searchAll from 'ComponentsVue/search/searchAll'
import searchPeople from 'ComponentsVue/search/searchPeople.vue'
import searchIntag from 'ComponentsVue/search/searchIntag.vue'
import searchGroup from 'ComponentsVue/search/searchGroup.vue'
import searchLocation from 'ComponentsVue/search/searchLocation.vue'
import Contests from 'ComponentsVue/Contests.vue'
import singleContest from 'ComponentsVue/contest/singleContest.vue'
import ChangeProfile from 'ComponentsVue/ChangeProfile.vue'
import Settings from 'ComponentsVue/Settings.vue'
import settingsMainPage from 'ComponentsVue/settings/settingsMainPage.vue'
import settingsRaitingPage from 'ComponentsVue/settings/settingsRaitingPage.vue'
import settingsCommonPage from 'ComponentsVue/settings/settingsCommonPage.vue'
import settingsStories from 'ComponentsVue/settings/settingsStories.vue'
import Groups from 'ComponentsVue/Groups.vue'
import groupSolo from 'ComponentsVue/groups/groupSolo.vue'
import groupCreate from 'ComponentsVue/groups/groupCreate.vue'
import groupPost from 'ComponentsVue/groups/groupComponents/groupPost.vue'
import groupAlbums from 'ComponentsVue/groups/groupComponents/groupAlbums.vue'
import GroupVideos from 'ComponentsVue/groups/groupComponents/GroupVideos'
import groupEdit from 'ComponentsVue/groups/groupComponents/groupEdit.vue'
import Album from 'ComponentsVue/groups/groupComponents/albums/albumSolo.vue'
import AlbumCreateOrEdit from 'ComponentsVue/groups/groupComponents/albums/AlbumCreateOrEdit.vue'
import createVideoInGroup from 'ComponentsVue/groups/groupComponents/groupVideoCreate.vue'
import groupDiscussions from 'ComponentsVue/groups/groupComponents/groupDiscussions.vue'
import groupUsers from 'ComponentsVue/groups/groupComponents/groupUsers.vue'
import groupInvite from 'ComponentsVue/groups/groupComponents/groupInvite'
import Discussion from 'ComponentsVue/groups/groupComponents/discussions/discussionSolo.vue'
import createDiscussion from 'ComponentsVue/groups/groupComponents/discussions/discussionCreate'
import Wallet from 'ComponentsVue/Wallet.vue'
import StoriesPage from 'ComponentsVue/StoriesPage'
import StoriesPageController from 'ComponentsVue/story/StoriesPageController'
import storyAdd from 'ComponentsVue/story/storyAdd'
import AddStoryAlbumPage from 'ComponentsVue/story/AddStoryAlbumPage/AddStoryAlbumPage'
import UserMonth from 'ComponentsVue/UsersMonth'
import Test from 'ComponentsVue/test'
import EditPost from 'ComponentsVue/EditPost'
import PublicOffer from 'ComponentsVue/PublicOffer'
import NetworkRules from 'ComponentsVue/NetworkRules'
import MonthPresents from 'ComponentsVue/MonthPresents'
import BuySuccess from 'ComponentsVue/BuySuccess'
import BuyError from 'ComponentsVue/BuyError'
import contestPresentsPage from 'ComponentsVue/other/NewContest'
import contestPresentsWeek from 'ComponentsVue/other/NewContestWeek'
import contestPresentsDay from 'ComponentsVue/other/NewContestDay'
import SoloIntag from 'ComponentsVue/SoloIntag'
import HardcodedFAQPage from 'ComponentsVue/HardcodedFAQPage'
import ResetPassword from 'ComponentsVue/modal/resetPassword';
import AddToBlackList from 'ComponentsVue/blacklist/AddToBlackList';
import userPrivacy from 'ComponentsVue/settings/userPrivacy'
import ContestsRules from 'ComponentsVue/ContestsRules'
import ContestCreate from 'ComponentsVue/contest/contestCreate'
import Rating from 'ComponentsVue/Raiting.vue';
import Chat from "ComponentsVue/chats/Chat/Chat";
import NewChat from 'ComponentsVue/chats/NewChat/NewChat';
import ChatsArchive from 'ComponentsVue/chats/ChatsArchive';
import ChatsNewsLetter from 'ComponentsVue/chats/ChatsNewsLetter';
import CreateGroupChat from 'ComponentsVue/chats/CreateGroupChat';
import CreateSearchChat from 'ComponentsVue/chats/CreateSearchChat';
import ChatsAll from 'ComponentsVue/chats/ChatsAll/ChatsAll';
import ChatFavouriteMessages from 'ComponentsVue/chats/ChatFavouriteMessages/ChatFavouriteMessages';
import SearchPage from 'ComponentsVue/search/searchPage/SearchPage';

// import GroupManagement from 'ComponentsVue/groups/groupComponents/GroupManagement';

// const Rating = () => import('ComponentsVue/Raiting.vue');
// const Rating = resolve => {
//   require.ensure(['ComponentsVue/Raiting.vue'], () => {
//     resolve(require('ComponentsVue/Raiting.vue'))
//   })
// };

Vue.use(Router);

const routes = [
  {
    path: '/what-is-rating', component: HardcodedFAQPage,
    meta: { isFaqPage: true, subject: 'rating', },
  },
  {path: '/contest-rules', component: ContestsRules},
  {path: '/contest-rules-ios', component: ContestsRules},
  {path: '/rule-miss-ukraine', component: contestPresentsPage},
  {path: '/rule-miss-ukraine-week', component: contestPresentsWeek},
  {path: '/login', component: LoginForm},
  {path: '/reset-password', component: ResetPassword},
  {path: '/rule-miss-ukraine-day', component: contestPresentsDay},
  {path: '/public-offer-and-confidentiality', component: PublicOffer},
  {path: '/rule-page', component: NetworkRules},
  {path: '/prizes', component: MonthPresents},
  {path: '/buy/success', component: BuySuccess},
  {path: '/buy/error', component: BuyError},
  {path: '/registration', component: Registration},
  {path: '/continue-register', component: ContinueRegister},
  {path: '', component: Main, name: 'main-page'},
  {path: '/rating', component: Rating},
  {path: '/groups', component: Groups},
  {path: '/buy', component: Wallet},
  {path: '/rating/top', component: UserMonth},
  {path: '/statictics/:statistics_id', component: PostStatistics},
  {path: '/messages/:chat_id', component: Chat},
  {path: '/new-chat/:user_id', component: NewChat},
  {path: '/create-newsletter', component: ChatsNewsLetter},
  {path: '/create-groupchat', component: CreateGroupChat},
  {path: '/create-search-chat', component: CreateSearchChat},
  {path: '/story-archive/story-:storySlug', component: StoriesPageController, name: 'archived-story', meta: { type: 'archived'}},
  {path: '/story-album/album-:albumId', component: StoriesPageController, name: 'story-album', meta: { type: 'album'}},
  {path: '/story/:nickname/story-:storySlug', component: StoriesPageController, name: 'active-story', meta: { type: 'active'}},
  {path: '/story/:nickname', component: StoriesPageController, name: 'active-stories', meta: { type: 'active'}},
  {path: '/add-story', component: storyAdd},
  {path: '/add-story-album', component: AddStoryAlbumPage, name: 'add-story-album' },
  // {path: '/group', component: groupChatCreate},
  {path: '/group/:group_slug', component: groupSolo,
    children: [
      {
        path: '',
        component: groupPost,
        name: 'group',
      },
      {
        path: 'albums',
        component: groupAlbums,
      },
      {
        path: 'videos',
        component: GroupVideos,
      },
      {
        path: 'discussions',
        component: groupDiscussions,
      },
      {
        path: 'user',
        component: groupUsers,
      },
      {
        path: 'edit',
        component: groupEdit,
      },
      // {
      //   path: 'management',
      //   component: GroupManagement
      // }
    ]
  },
  {
    path: '/group/:group_slug/invite',
    component: groupInvite,
  },
  {
    path: '/group/:group_slug/albums/:album_slug',
    name: 'group-album',
    component: Album,
  },
  {
    path: '/group/:group_slug/discussion/:discussion_slug',
    component: Discussion,
    name: 'group-discussion',
  },
  {path: '/group/:group_slug/create-album', component: AlbumCreateOrEdit},
  {path: '/group/:group_slug/edit-album/:album_id', component: AlbumCreateOrEdit},
  {path: '/group/:group_slug/create-video', component: createVideoInGroup, name: 'add-group-video'},
  {path: '/group/:group_slug/create-discussion', component: createDiscussion},
  {path: '/group-create', component: groupCreate},
  {path: '/edit-post/:post_slug', component: EditPost},
  {path: '/messages', component: ChatsAll},
  {path: '/messages-archive', component: ChatsArchive},
  {path: '/messages-favourite', component: ChatFavouriteMessages},
  {path: '/feeds', component: Feeds},
  {
    path: '/search', component: Search,
    children: [
      {
        path: '',
        component: SearchPage
      },
      {
        path: 'user',
        component: searchPeople
      },
      {
        path: 'intag',
        component: searchIntag
      },
      {
        path: 'group',
        component: searchGroup
      },
      {
        path: 'location',
        component: searchLocation
      },
    ]
  },
  {
    path: '/setting', component: Settings,
    children: [
      {
        path: '',
        component: settingsCommonPage,
      },
      {
        path: 'faq/:question',
        component: settingsCommonPage,
        meta: {
          faq: true,
        },
      },
      {
        path: 'rating',
        component: settingsRaitingPage,
      },
      {
        path: 'common',
        component: settingsMainPage,
      },
      {
        path: 'stories',
        component: settingsStories,
      }
    ]
  },
  {path: '/setting/user', component: ChangeProfile},
  {path: '/contests', component: Contests, name: 'contests'},
  {path: '/contest/:id', component: singleContest},
  {path: '/test', component: Test},
  {
    path: '/new-post/:group_slug/albums/:album_slug',
    name: 'add-album-post',
    component: AddPost,
    meta: {
      type: 'group-album-post',
    },
  },
  {
    path: '/new-post/:group_slug',
    name: 'add-group-post',
    component: AddPost,
    meta: {
      type: 'group-post',
    },
  },
  {
    path: '/new-post',
    name: 'add-profile-post',
    component: AddPost,
    meta: {
      type: 'profile-post',
    },
  },
  {path: '/p/:slug', component: PostShow},
  {path: '/intag/:intag', component: SoloIntag, name: 'intag'},
  {
    path: '/u/:nickname', component: UserProfile, name: 'profile-page',
    children: [
      {
        path: '',
        name: 'profile-posts',
        meta: {type: 'post'},
        component: ProfilePost
      },
      {
        path: 'stories',
        name: 'profile-stories',
        meta: {type: 'stories'},
        component: ProfileStories,
      },
      {
        path: 'bookmark',
        meta: {type: 'bookmark'},
        component: ProfileBookmarks
      },
      {
        path: 'mention',
        meta: {type: 'mention'},
        component: ProfileMention
      },
      {
        path: 'gift',
        meta: {type: 'gift'},
        component: ProfileGift
      },
      {
        path: 'statistics',
        meta: {type: 'scale'},
        component: ProfileScale
      },
    ]
  },
  {path: '/u/:nickname/subscribers', component: ProfileSubscribers},
  {path: '/u/:nickname/subscriptions', component: ProfileSubscriptions},
  {path: '/add-to-black-list', component: AddToBlackList},
  {path: '/setting/private-settings', component: userPrivacy},
  {path: '/contest-create', component: ContestCreate},
  {
    path: '*',
    beforeEnter: (to, from, next) => {
      console.error(`Page ${to.path} not found`);
      next('/');
    },
  }
];

export default new Router({
  mode: 'history',
  routes: routes,
})

