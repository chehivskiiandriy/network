<script>
  export default {
    name: "Tab",
    inject: [
      'addTab',
      'removeTab',
      'setActiveTab',
      'getActiveTab',
      'setNames',
      'getNames',
      'setTabsCount',
      'getTabsCount',
    ],
    props: {
      tag: {
        type: String,
        default: 'div',
      },
      tabProps: Object,
      name: String,
    },
    computed: {
      classes() {
        let classes = 'tab tab-1-of-' + this.tabsCount;
        if(this.activeTab === this.name) {
          classes += ' tab-active';
        }
        return classes;
      },
      names: {
        get() {
          return this.getNames();
        },
        set(nextNames) {
          this.setNames(nextNames);
        },
      },
      tabsCount: {
        get() {
          return this.getTabsCount();
        },
        set(nextTabsCount) {
          this.setTabsCount(nextTabsCount);
        },
      },
      activeTab: {
        get() {
          return this.getActiveTab();
        },
        set(nextActiveTab) {
          this.setActiveTab(nextActiveTab);
        },
      },
    },
    created() {
      this.addTab(this.name);
    },
    destroyed() {
      this.removeTab(this.name);
    },
    render(h) {
      return h(
        this.tag,
        {
          class: this.classes,
          on: {
            click: this.clickHandler,
          }
        },
        this.$slots.default,
      );
    },
    methods: {
      clickHandler() {
        this.activeTab = this.name;
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~LessStyle/variables.less';

  .tab {
    flex: 1;
    height: 30px;
    /*background: #dcdcdc;*/
    font-weight: 400;
    padding-top: 5px;
    /*box-shadow: inset 0 0 0 1px #bbb;*/
    font-size: 3.8vw;
    /*border-radius: 10px 10px 0 0;*/
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 2px solid transparent;
    margin: 0 10px 5px 10px;

    &-1-of-2 {
      width: 50%;
    }

    &-1-of-3 {
      width: 100% / 3;
    }

    &-1-of-4 {
      width: 100% / 4;
    }

    &-name {
      color: @dark_grey;
    }

    &-active {
      //background: @white;
      /*box-shadow: inset 0 1px 0 0 #ccc;*/
      border-bottom: 2px solid @contest-list-text-color;
      .tab-name {
        .text-grad();
      }
    }

    .requests-count {
      color: #ff0000;
      padding-left: 5px;
    }
  }
</style>
