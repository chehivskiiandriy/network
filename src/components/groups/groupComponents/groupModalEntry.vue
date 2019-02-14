<template>
  <modal name="groupModalEntry"
         width="90%"
         classes=" v--modal"
         height="auto">
      <div class="groupModalEntry">
        <p  class="settings-item " @click="goToGroup">{{$lang.variables.goToNext}}</p>
        <p  class="settings-item " @click="payGroup" v-if="groupInfo(groupSlug).fee">{{$lang.variables.payForEntry}} {{groupInfo(groupSlug).fee}} INC</p>
        <p  class="settings-item last-item" @click="closeModalEntry">{{$lang.variables.cancel}}</p>
      </div>
  </modal>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import {CURRENT_GROUP, moduleName as groupModule, SUBSCRIBE_USER,} from "Store/modules/groups/groups";

  export default  {
    name:'groupModalEntry',
    data() {
      return {
        groupSlug:this.$route.params.group_slug,
      }
    },
    computed: {
      ...mapGetters({
        groupInfo: groupModule + CURRENT_GROUP
      }),
    },
    methods: {
      ...mapActions({
        subscribeUserToGroup: groupModule + SUBSCRIBE_USER,
      }),
      closeModalEntry() {
        this.$modal.hide('groupModalEntry');
      },
      goToGroup() {
        let data = new FormData();
        data.append('group_slug',this.groupSlug);
        const payload= {
          data: data,
          onSuccess: this.subscribeSuccessHandler,
          onFail: this.subscribeFailHandler,
        };
        this.subscribeUserToGroup(payload);
        this.$modal.hide('groupModalEntry');
      },
      payGroup() {
        let data=new FormData();
        data.append('group_slug',this.groupSlug);
        data.append('pay_fee',1);
        const payload = {data: data, onFail: this.subscribeFailHandler}
        this.subscribeUserToGroup(payload);
        this.$modal.hide('groupModalEntry');
      },
      subscribeSuccessHandler() {
        this.$notify({
          group: 'go-to-group',
          duration: 3000,
          speed: 300
        });
      },
      subscribeFailHandler() {
        this.$notify({
          group: 'action-error',
          duration: 3000,
          speed: 300
        });
      },
    }
  }
</script>
<style>
  .groupModalEntry {
    text-align: center;
    p{
      margin: 0px;
      padding: 10px 0px;
      border-bottom:1px solid #d3d3d3;
    }
  }
</style>
