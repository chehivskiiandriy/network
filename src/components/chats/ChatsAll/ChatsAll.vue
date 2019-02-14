<template>
  <div id="chats">
    <in-chats-all-header
      :isActiveSearch="isActiveSearch"
      @showUserSearch="showUserSearch"/>

    <in-search-block
      v-show="isActiveSearch"
      class="search">
      <div class="search-input-block" style="width: 100%">
        <input
          type="text"
          :placeholder="$lang.variables.searchByNameOrNickname"
          :value="searchInput"
          @keyup="fetchInput"
          class="search-input-field">
      </div>
    </in-search-block>

    <div class="chats-all">
      <in-chats-all-item
        v-for="chat in chatsAll"
        :key="chat.id"
        :chat="chat"
        :showSettings="showSettings"/>

      <in-chats-all-item-settings-menu
        :show="isActiveItem"
        @delete-dialog="deleteDialog"
        @add-to-archive="addToArchive"
        @close-settings="closeSettings"/>

      <in-confirmation-settings-modal
        :show="isShowConfirmation"
        :message="$lang.variables.wontToDelete"
        :subMessage="$lang.variables.notRestore"
        @confirm="confirmDeleteDialog"
        @cancel="cancelDeleteDialog"/>

      <in-spinner :loading="loadingInfo"></in-spinner>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';
  import {scrollOnBottom} from "Mixins/scrollOnBottom";
  import ChatsAllItem from "ComponentsVue/chats/ChatsAll/ChatsAllItem";
  import ChatsAllItemSettingsMenu from "ComponentsVue/chats/modal/ChatsAllItemSettingsMenu";
  import ChatsAllHeader from 'ComponentsVue/chats/ChatsAll/ChatsAllHeader.vue'

  import {
    CHATS,
    DELETE_CHAT,
    FETCH_CHATS,
    FETCH_CHATS_NEXT_PAGE,
    LOADING,
    moduleName as chatsAllModule
  } from "Store/modules/chats/chatsAll";
  import {ADD_TO_ARCHIVE_CHAT, moduleName as chatsArchiveModule} from "Store/modules/chats/chatsArchive";
  import {
    CHANGE_ACTIVE_SEARCH,
    CHANGE_SEARCH_INPUT,
    FETCH_SEARCH_CHATS,
    FETCH_SEARCH_CHATS_NEXT_PAGE,
    IS_ACTIVE_SEARCH,
    LOADING as SEARCH_LOADING,
    moduleName as chatsAllSearchModule,
    SEARCH_CHATS,
    SEARCH_INPUT
  } from "Store/modules/chats/chatsAllSearch";

  export default {
    name: "ChatsAll",
    mixins: [scrollOnBottom],
    components: {
      inChatsAllItem: ChatsAllItem,
      inChatsAllItemSettingsMenu: ChatsAllItemSettingsMenu,
      inChatsAllHeader: ChatsAllHeader
    },
    data() {
      return {
        isActiveItem: false,
        activeItem: null,
        isShowConfirmation: false
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchNext();
        }
      }
    },
    computed: {
      ...mapGetters({
        chats: chatsAllModule + CHATS,
        loading: chatsAllModule + LOADING,
        searchLoading: chatsAllSearchModule + SEARCH_LOADING,
        searchChats: chatsAllSearchModule + SEARCH_CHATS,
        searchInput: chatsAllSearchModule + SEARCH_INPUT,
        isActiveSearch: chatsAllSearchModule + IS_ACTIVE_SEARCH
      }),
      chatsAll() {
        if(this.isActiveSearch && this.searchInput) {
          return this.searchChats
        } else {
          return this.chats
        }
      },
      loadingInfo() {
        if(this.isActiveSearch && this.searchInput) {
          return this.searchLoading
        } else {
          return this.loading
        }
      }
    },
    mounted() {
      this.fetch();
    },
    methods: {
      ...mapActions({
        fetchChats: chatsAllModule + FETCH_CHATS,
        fetchChatsNextPage: chatsAllModule + FETCH_CHATS_NEXT_PAGE,
        deleteChat: chatsAllModule + DELETE_CHAT,
        addToArchiveChat: chatsArchiveModule + ADD_TO_ARCHIVE_CHAT,
        fetchSearchChats: chatsAllSearchModule + FETCH_SEARCH_CHATS,
        fetchSearchChatsNextPage: chatsAllSearchModule + FETCH_SEARCH_CHATS_NEXT_PAGE
      }),
      ...mapMutations({
        changeSearchInput: chatsAllSearchModule + CHANGE_SEARCH_INPUT,
        changeActiveSearch: chatsAllSearchModule + CHANGE_ACTIVE_SEARCH
      }),
      showSettings(item) {
        this.isActiveItem = true;
        this.activeItem = item;

        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.getElementsByTagName('body')[0].style.top = -this.scrollTop + 'px';
        document.getElementsByTagName('body')[0].style.width = '100%';
        document.getElementsByTagName('body')[0].style.position = 'fixed';
      },
      closeSettings() {
        document.getElementsByTagName('body')[0].style.removeProperty('top');
        document.getElementsByTagName('body')[0].style.removeProperty('position');
        document.getElementsByTagName('body')[0].style.removeProperty('width');
        document.body.scrollTop = this.scrollTop;
        document.documentElement.scrollTop = this.scrollTop;

        this.isActiveItem = false;
        this.activeItem = null;
      },
      deleteDialog() {
        this.isActiveItem = false;
        this.isShowConfirmation = true;
      },
      addToArchive() {
        this.addToArchiveChat({...this.activeItem});
        this.closeSettings();
      },
      confirmDeleteDialog() {
        let id = this.activeItem.id;

        this.isShowConfirmation = false;
        this.closeSettings();

        this.deleteChat(id);
      },
      cancelDeleteDialog() {
        this.isShowConfirmation = false;
        this.isActiveItem = true;
      },
      showUserSearch() {
        this.changeActiveSearch();
      },
      fetchInput(e) {
        this.changeSearchInput(e.target.value);
        this.fetch();
      },
      fetch() {
        if(this.isActiveSearch && this.searchInput) {
          this.fetchSearchChats();
        } else {
          this.fetchChats();
        }
      },
      fetchNext() {
        if(this.isActiveSearch && this.searchInput) {
          this.fetchSearchChatsNextPage();
        } else {
          this.fetchChatsNextPage();
        }
      }
    }
  }
</script>

<style lang="less">
  #chats {
    .chats-all {
      display: flex;
      flex-wrap: wrap;
      padding-top: 2px;
      margin: 0 5px;
    }

    .search {
      margin-bottom: 5px;
    }
  }

</style>
