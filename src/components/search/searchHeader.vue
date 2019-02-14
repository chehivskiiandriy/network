<template>
  <div class="search-header">
    <in-search-header-item
      link="/search/user"
      activeIcon="icon-search-guy-f"
      notActiveIcon="icon-search-guy"
      fillType="user"
    />
    <in-search-header-item
      link="/search/location"
      activeIcon="icon-search-location-f"
      notActiveIcon="icon-search-location"
      fillType="location"
    />
    <in-search-header-item
      link="/search/intag"
      activeIcon="icon-intag-f"
      notActiveIcon="icon-intag"
      fillType="intag"
    />
    <in-search-header-item
      link="/search/group"
      activeIcon="icon-search-group-f"
      notActiveIcon="icon-search-group"
      fillType="group"
    />
    <div class="search-header-item">
      <i
        @click="notNow"
        class="search-header-item-icon icon-search-birga"></i>
    </div>
  </div>
</template>

<script>
  import SearchHeaderItem from 'ComponentsVue/search/parts/searchHeaderItem'

  export default {
    name: 'SearchHeader',
    components: {
      inSearchHeaderItem: SearchHeaderItem
    },
    methods: {
      notNow() {
        this.$notify({
          group: 'not-is-now',
          duration: '3000',
          speed: '300'
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .search-header {
    display: flex;
    justify-content: space-around;


    &-item {
      &-icon {
        font-size: 30px;
        .text-grad();
      }
    }
  }
</style>
