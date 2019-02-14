<template>
  <div class="settingsStory">
    <div class="change-status--header settings-story">
      {{$lang.variables.showInStories}}
    </div>

    <div class="stories-tabs">
      <div
        :class="allTabClasses"
        @click="showStories('all')">
        {{$lang.variables.all}}
      </div>
      <div
        :class="subscriptionsTabClasses"
        @click="showStories('subs')">
        {{$lang.variables.subscriptions}}
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';

  export default  {
    name:'settingsStory',
    data() {
      return {
        showStoriesBy: '',
      };
    },
    mounted() {
      this.getHomeSettings();
    },
    computed: {
      allTabClasses() {
        return {
          'stories-tabs__item': true,
          'stories-tabs__item_active': this.showStoriesBy === 'all',
        };
      },
      subscriptionsTabClasses() {
        return {
          'stories-tabs__item': true,
          'stories-tabs__item_active': this.showStoriesBy === 'subs',
        };
      },
    },
    methods:{
      showStories(val) {
        axios.post('v1/me/settings/edit?stories='+val)
          .then(res=>{
            if(res.data.state === undefined || res.data.state) {
              this.showStoriesBy = val;
            }
          })
      },
      getHomeSettings(){
        axios.get('v1/me/settings/get')
          .then(res =>{
            this.showStoriesBy = res.data.stories;
          })
      },
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/settings.less';
  @import '~LessStyle/userprivacy.less';
  .settings-story {
    margin-bottom: 20px;
  }

  .change-status--header{
    padding: 15px 0;
    text-align: center;
    color: #666;
    background-color: #ccc;
    font-weight: 600;
  }

  .stories-tabs {
    display: flex;
    justify-content: center;
    width: 95%;
    margin: auto;
  }

  .stories-tabs__item {
    border: 1px solid @base_green;
    width: 50%;
    padding: 5px 0px;
  }

  .stories-tabs__item:first-child {
    border-radius: 5px 0px 0px 5px;
  }
  .stories-tabs__item:last-child {
    border-radius: 0px 5px 5px 0px;
  }

  .stories-tabs__item_active {
    background: @grad;
    color: @white;
  }
</style>
