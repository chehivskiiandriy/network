<template>
  <div class="add-story-album-page">
    <div class="add-story-album-page__header green-header">
      <i @click="comeBack" class="green-header__left-icon icon-left-f icon-back"></i>
      <div class="green-header__title">{{headerTitle}}</div>
    </div>
    <in-add-story-album-stories-selection-step
      v-show="navigation.step === navigation.STORIES_SELECTION"
      class="add-story-album-page__stories-selection-step"
      :stories="stories"
      :stories-loading="loading"
      @next="storiesSelectionStepNextHandler"
    />
    <in-add-story-album-cover-selection-step
      v-show="navigation.step === navigation.COVER_SELECTION"
      class="add-story-album-page__cover-selection-step"
      @next="coverSelectionStepNextHandler"
    />
    <in-add-story-album-title-selection-step
      v-show="navigation.step === navigation.TITLE_SELECTION"
      class="add-story-album-page__cover-selection-step"
      :selectedStories="selectedStories"
      :selectedCover="selectedCoverDataUrl"
      @next="titleSelectionStepNextHandler"
    />
  </div>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';

  import {
    FETCH_USER_ARCHIVED_STORIES,
    FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE,
    IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER,
    USER_ARCHIVED_STORIES,
    moduleName as userArchivedStoriesModule,
  } from 'Store/modules/users/userArchivedStories';

  import {
    CREATE_USER_STORY_ALBUM,
    CREATION_ERROR,
    moduleName as userStoryAlbumsModule,
  } from 'Store/modules/users/userStoryAlbums';

  import AddStoryAlbumStoriesSelectionStep from 'ComponentsVue/story/AddStoryAlbumPage/AddStoryAlbumStoriesSelectionStep';
  import AddStoryAlbumCoverSelectionStep from 'ComponentsVue/story/AddStoryAlbumPage/AddStoryAlbumCoverSelectionStep';
  import AddStoryAlbumTitleSelectionStep from 'ComponentsVue/story/AddStoryAlbumPage/AddStoryAlbumTitleSelectionStep';


  export default {
    components: {
      inAddStoryAlbumStoriesSelectionStep: AddStoryAlbumStoriesSelectionStep,
      inAddStoryAlbumCoverSelectionStep: AddStoryAlbumCoverSelectionStep,
      inAddStoryAlbumTitleSelectionStep: AddStoryAlbumTitleSelectionStep,
    },
    data() {
      return {
        selectedIds: null,
        selectedCoverDataUrl: null,
        title: null,
        navigation: new (function (vm, callbacks) {
          this.STORIES_SELECTION = 'STORIES_SELECTION';
          this.COVER_SELECTION = 'COVER_SELECTION';
          this.TITLE_SELECTION = 'TITLE_SELECTION';
          this.step = this.STORIES_SELECTION;
          this.nextStep = () => {
            switch(this.step) {
              case this.STORIES_SELECTION:
                this.step = this.COVER_SELECTION;
                break;
              case this.COVER_SELECTION:
                this.step = this.TITLE_SELECTION;
                break;
              case this.TITLE_SELECTION:
                this.onGetRightEnd();
                break;
              default:
                throw new Error('Bad step ' + this.step);
            }
          };
          this.previousStep = () => {
            switch(this.step) {
              case this.TITLE_SELECTION:
                this.step = this.COVER_SELECTION;
                break;
              case this.COVER_SELECTION:
                this.step = this.STORIES_SELECTION;
                break;
              case this.STORIES_SELECTION:
                this.onGetLeftEnd();
                break;
              default:
                throw new Error('Bad step ' + this.step);
            }
          };
          this.onGetLeftEnd = () => {
            vm.$router.go(-1);
          };
          this.onGetRightEnd = () => {
            vm.$router.go(-1);
          };
        })(this),
      };
    },
    computed: {
      ...mapGetters({
        archivedStories: userArchivedStoriesModule + USER_ARCHIVED_STORIES,
        loading: userArchivedStoriesModule + IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER,
        creationError: userStoryAlbumsModule + CREATION_ERROR,
      }),
      stories() {
        return this.archivedStories && this.archivedStories.map(story => {
          const type = story.attachments_order && story.attachments_order  && story.attachments_order[0].type;
          const previewSource = type === 'video'
            ? story.attachments.videos && story.attachments.videos[0] && story.attachments.videos[0].preview_url
            : story.attachments.images && story.attachments.images[0] && story.attachments.images[0].url_medium;
          return {id: story.id, previewSource}
        });
      },
      selectedStories() {
        const { stories, selectedIds } = this;
        return (stories && selectedIds) &&
          stories
            .filter(story => selectedIds.indexOf(Number.parseInt(story.id)) !== -1);
      },
      headerTitle() {
        const { navigation, $lang } = this;
        switch (navigation.step) {
          case navigation.STORIES_SELECTION:
            return $lang.variables.addToTheGallery;
          case navigation.COVER_SELECTION:
            return $lang.variables.selectCover;
          case navigation.TITLE_SELECTION:
            return $lang.variables.selectAnother;
        }
      }
    },
    methods: {
      ...mapActions({
        fetchArchivedStories: userArchivedStoriesModule + FETCH_USER_ARCHIVED_STORIES,
        fetchArchivedStoriesNextPage: userArchivedStoriesModule + FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE,
        createStoryAlbum: userStoryAlbumsModule + CREATE_USER_STORY_ALBUM,
      }),
      comeBack() {
        this.navigation.previousStep();
      },
      storiesSelectionStepNextHandler(selectedIds) {
        this.selectedIds = selectedIds;
        this.navigation.nextStep();
      },
      coverSelectionStepNextHandler(dataUrl) {
        this.selectedCoverDataUrl = dataUrl;
        this.navigation.nextStep();
      },
      async titleSelectionStepNextHandler(title) {
        this.title = title;
        await this.createStoryAlbum({
          ids: this.selectedIds,
          dataUrl: this.selectedCoverDataUrl,
          title: this.title,
        });
        if(!this.creationError) {
          this.navigation.nextStep();
        }
      },
    },
    beforeRouteEnter(to, from, next) {
      next(vm => vm.fetchArchivedStories());
    },
  }
</script>

<style lang="less">
  @import "~LessStyle/variables.less";

  .add-story-album-page {
    margin-top: -43px;
  }

  .green-header {
    height: 40px;
    position: relative;
    background: @grad;
    color: #fff;
    font-size: 22px;
    padding: 5px 0;
    line-height: 30px;
    box-sizing: border-box;
    display: flex;
    flex-flow: row;
    align-items: center;
  }

  .green-header__left-icon {
    color: #fff;
    font-size: 22px;
    position: absolute;
    left: 5px;
  }

  .green-header__title {
    flex: 1;
    text-align: center;
    display: block;
  }

</style>
