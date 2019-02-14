<template>
    <div id="groupSolo">
            <router-view></router-view>
    </div>
</template>

<script>
  import Vue from 'vue'
  import groupHeader from 'ComponentsVue/groups/groupComponents/groupHeader.vue'
  import groupMenu from 'ComponentsVue/groups/groupComponents/groupMenu.vue'


  Vue.component('in-group-header', groupHeader);
Vue.component('in-group-menu', groupMenu);

export default {
    name:'groupSolo',
    data() {
        return {
            group:[],
        }
    },

}
</script>

<style lang="less">
    @import '~LessStyle/groupsolo.less';
</style>
