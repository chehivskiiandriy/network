<template>
  <div class="search-page">
    <SearchPageContests />
    <SearchPageUsers />
    <SearchPageGroups />
    <SearchPageCommunities />
    <SearchPageEvents />
    <SearchPageRecommendations />
  </div>
</template>

<script>
  import SearchPageGroups from 'ComponentsVue/search/searchPage/SearchPageGroups'
  import SearchPageContests from 'ComponentsVue/search/searchPage/SearchPageContests'
  import SearchPageCommunities from 'ComponentsVue/search/searchPage/SearchPageCommunities'
  import SearchPageEvents from 'ComponentsVue/search/searchPage/SearchPageEvents'
  import SearchPageUsers from 'ComponentsVue/search/searchPage/SearchPageUsers'
  import SearchPageRecommendations from 'ComponentsVue/search/searchPage/SearchPageRecommendations'

  export default {
    name: "SearchPage",
    components: {
      SearchPageGroups,
      SearchPageContests,
      SearchPageCommunities,
      SearchPageEvents,
      SearchPageUsers,
      SearchPageRecommendations
    }
  }
</script>

<style lang="less" scoped>
  .search-page {
    padding: 0 5px 10px 5px;
    background-color: #f4f4f4;
    border-radius: 10px;
  }
</style>
