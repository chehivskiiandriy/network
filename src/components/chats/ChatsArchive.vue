<template>
  <div class="chats-archive">
    <in-chats-common-header :name="$lang.variables.archive"/>

    <in-chats-all-item
      v-for="chat in archiveChats"
      :key="chat.id"
      :chat="chat"
      :showSettings="showSettings"/>

    <in-chats-archive-settings-menu
      :show="isActiveItem"
      @restore-dialog="restoreDialog"
      @delete-dialog="deleteDialog"
      @close-settings="closeSettings"/>

    <in-confirmation-settings-modal
      :show="isShowConfirmation"
      :message="$lang.variables.wontToDelete"
      :subMessage="$lang.variables.notRestore"
      @confirm="confirmDeleteDialog"
      @cancel="cancelDeleteDialog"/>

    <in-spinner :loading="loading"></in-spinner>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import {scrollOnBottom} from "Mixins/scrollOnBottom";
  import ChatsAllItem from "ComponentsVue/chats/ChatsAll/ChatsAllItem";
  import ChatsArchiveSettingsMenu from "ComponentsVue/chats/modal/ChatsArchiveSettingsMenu";
  import ChatsCommonHeader from 'ComponentsVue/chats/ChatsCommonHeader';

  import {
    DELETE_CHAT,
    moduleName as chatsAllModule
  } from "Store/modules/chats/chatsAll";
  import {
    moduleName as chatsArchiveModule,
    FETCH_ARCHIVE_CHATS,
    FETCH_ARCHIVE_CHATS_NEXT_PAGE,
    DELETE_FROM_ARCHIVE_CHAT,
    ARCHIVE_CHATS,
    LOADING
  } from "Store/modules/chats/chatsArchive";

  export default {
    name: "ChatsArchive",
    mixins: [scrollOnBottom],
    components: {
      inChatsAllItem: ChatsAllItem,
      inChatsArchiveSettingsMenu: ChatsArchiveSettingsMenu,
      inChatsCommonHeader: ChatsCommonHeader
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
          this.fetchArchiveChatsNextPage();
        }
      }
    },
    computed: {
      ...mapGetters({
        archiveChats: chatsArchiveModule + ARCHIVE_CHATS,
        loading: chatsArchiveModule + LOADING
      })
    },
    mounted() {
      this.fetchArchiveChats();
    },
    methods: {
      ...mapActions({
        fetchArchiveChats: chatsArchiveModule + FETCH_ARCHIVE_CHATS,
        fetchArchiveChatsNextPage: chatsArchiveModule + FETCH_ARCHIVE_CHATS_NEXT_PAGE,
        deleteFromArchiveChat: chatsArchiveModule + DELETE_FROM_ARCHIVE_CHAT,
        deleteChat: chatsAllModule + DELETE_CHAT
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
      restoreDialog() {
        this.deleteFromArchiveChat({...this.activeItem});
        this.closeSettings();
      },
      deleteDialog() {
        this.isActiveItem = false;
        this.isShowConfirmation = true;
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
    }
  }
</script>

<style lang="less" scoped>
  .chats-archive {
    display: flex;
    flex-wrap: wrap;
    padding-top: 2px;
    margin: 0 5px;
  }
</style>
