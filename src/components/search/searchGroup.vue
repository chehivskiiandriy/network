<template>
  <div>
    <in-search-block
      class="search">
      <div class="search-input-block" style="width: 100%">
        <input
          type="text"
          :placeholder="$lang.variables.searchByGroup"
          :value="searchInput"
          @keyup="search"
          class="search-input-field">
      </div>
    </in-search-block>

    <div class="group-block">
      <div
        v-for="group in groups"
        :key="group.id">
        <router-link
          class="group-link"
          :to="getRouterLinkForFoundGroup(group.slug)">
          <in-group-item :group="group"/>
        </router-link>
      </div>
    </div>

    <in-spinner :loading="loading"/>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  import {
    FETCH_GROUPS_POSTS,
    FETCH_GROUPS_POSTS_NEXT_PAGE,
    GROUPS,
    LOADING,
    CHANGE_QUERY,
    QUERY,
    moduleName as searchGroupsModule
  } from "Store/modules/search/searchGroups";

  import {scrollOnBottom} from "Mixins/scrollOnBottom";

  import GroupItem from 'ComponentsVue/groups/groupItem.vue'

  export default {
    mixins: [scrollOnBottom],
    components: {
      inGroupItem: GroupItem
    },
    data() {
      return {
        timeout: null
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.getPostsGroupsNextPage()
        }
      },
    },
    computed: {
      ...mapGetters({
        groups: searchGroupsModule + GROUPS,
        loading: searchGroupsModule + LOADING,
        searchInput: searchGroupsModule + QUERY
      })
    },
    mounted() {
      if(this.groups.length === 0) {
        this.getPostsGroups();
      }
    },
    methods: {
      ...mapActions({
        getPostsGroups: searchGroupsModule + FETCH_GROUPS_POSTS,
        getPostsGroupsNextPage: searchGroupsModule + FETCH_GROUPS_POSTS_NEXT_PAGE
      }),
      ...mapMutations({
        changeQuery : searchGroupsModule + CHANGE_QUERY
      }),
      search(e) {
        this.changeQuery(e.target.value);
        this.searchGroupsAction();
      },
      searchGroupsAction() {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          this.getPostsGroups();
        }, 300);
      },
      goToLink(slug) {
        this.$router.push('/p/' + slug);
      },
      getRouterLinkForFoundGroup(slug) {
        return {
          name: 'group',
          params: {
            'group_slug': slug,
          },
        }
      }
    }
  }
</script>

<style lang="less">
  .group-block {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    text-align: left;
  }
</style>
