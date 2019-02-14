<template>
  <nav class="nav tabs">
    <slot :tabs-count="tabsCount" :names="names" ></slot>
  </nav>
</template>

<script>
  export default {
    name: "Tabs",
    props: {
      activeTab: String,
    },
    data() {
      return {
        tabsCount: 0,
        names: [],
        isMounted: false,
      };
    },
    render(h) {
      return h(
        'nav',
        {
          class: 'nav tabs',
        },
        this.$slots.default
      )
    },
    methods: {
      addTab() {
        this.tabsCount ++;
      },
      removeTab() {
        this.tabsCount --;
      },
      emitActiveTabUpdating(nextTabName) {
        this.$emit('update:active-tab', nextTabName);
      },
      setActiveTab(nextTabName) {
        this.emitActiveTabUpdating(nextTabName);
      },
      getActiveTab() {
        return this.activeTab;
      },
      setNames(nextNames) {
        this.names = nextNames;
      },
      getNames() {
        return this.names;
      },
      setTabsCount(nextTabsCount) {
        this.tabsCount = nextTabsCount;
      },
      getTabsCount() {
        return this.tabsCount;
      },
    },
    provide() {
      return {
        addTab: this.addTab,
        removeTab: this.removeTab,
        setActiveTab: this.setActiveTab,
        getActiveTab: this.getActiveTab,
        setNames: this.setNames,
        getNames: this.getNames,
        setTabsCount: this.setTabsCount,
        getTabsCount: this.getTabsCount,
      };
    },
  }
</script>

<style lang="less" scoped>
  .tabs {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
