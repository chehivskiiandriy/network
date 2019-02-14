<template>
  <div id="search">
    <in-search-header/>
    <router-view/>
  </div>
</template>

<script>
  import SearchHeader from './search/searchHeader.vue'

  export default {
    components: {
      inSearchHeader: SearchHeader
    },
    head: {
      title() {
        return {
          inner: this.$lang.variables.search
        }
      }
    }
  }
</script>

<style lang="less">
</style>
