<template>
  <modal
    name="modalProfileChangeFamilyStatus"
    width="80%"
    classes=" v--modal "
    height="auto">
      <div class="family-block">
        <div
          class="profile-family-item--text"
          @click="editFamilyStatus('married')">
          <p class="family-item">
            <span class="item-content"><i class="icon-weding"></i>{{$lang.variables.married}}</span>
            <span v-if="familyStatus === 'married'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="profile-family-item--text"
          @click="editFamilyStatus('in_relationship')">
          <p class="family-item">
            <span class="item-content"><i class="icon-relationships"></i>{{$lang.variables.inRelations}}</span>
            <span v-if="familyStatus === 'in_relationship'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="profile-family-item--text"
          @click="editFamilyStatus('single')">
          <p class="family-item">
            <span class="item-content"><i class="icon-bez-paru"></i>{{$lang.variables.single}}</span>
            <span v-if="familyStatus === 'single'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="profile-family-item--text"
          @click="editFamilyStatus('in_search')">
          <p class="family-item">
            <span class="item-content"><i class="icon-insearch"></i>{{$lang.variables.inSearch}}</span>
            <span v-if="familyStatus === 'in_search'"><i class="icon-check-f"></i></span>
          </p>
        </div>
        <div
          class="profile-family-item--text"
          @click="editFamilyStatus('in_active_search')">
          <p class="family-item">
            <span class="item-content"><i class="icon-inRsearch"></i>{{$lang.variables.inActiveSearchInRating}}</span>
            <span v-if="familyStatus === 'in_active_search'"><i class="icon-check-f"></i></span>
          </p>
        </div>
      </div>

  </modal>
</template>
<script>
  import {mapActions} from 'vuex';

  import {CHANGE_FAMILY_STATUS, moduleName as userModule} from "Store/modules/authUser/user";

  export default  {
    props: {
      familyStatus: String,
      authUserId: Number,
      userId: Number
    },
    methods: {
      ...mapActions({
        changeFamilyStatus: userModule + CHANGE_FAMILY_STATUS
      }),
      editFamilyStatus(status) {
        if(this.authUserId === this.userId) {
          this.changeFamilyStatus(status);
        }
      }
    }
  }
</script>
<style  lang="less">
  @import "~LessStyle/variables.less";

  .profile-family-item--text {
    width: 100%;
    border-bottom: 1px solid #d3d3d3;
    box-sizing: border-box;
    padding: 10px;
  }
  .profile-family-item--text > .family-item {
    display: flex;
    justify-content: space-between;
    margin: 0px;
  }

  .profile-family-item--text i {
    .text-grad();
    margin-right: 5px;
  }
</style>
