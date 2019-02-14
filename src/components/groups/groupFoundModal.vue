<template>
  <modal
    name="foundGroupsModal"
    width="100%"
    classes=" v--modal "
    height="100%">
    <div>
      <div>
        <h3 class="modal-title">
          <i
            @click="hideFoundGroupsModal()"
            class="close-modal-group icon-left-f"></i>
          Поиск группы
        </h3>
        <div class="search-input">
          <input
            id="searchGroup"
            placeholder="Поиск по названию группы"
            type="text"
            @keyup="searchGroups()">
        </div>
        <div class="groups-founded--modal">
          <div v-for="group in allGroups">
            <in-group-item :group="group"/>
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'groupFoundModal',
    data(){
      return {
        allGroups: [],
      }
    },
    methods: {
      hideFoundGroupsModal(){
        this.$modal.hide('foundGroupsModal');
      },
      searchGroups(){
        let group = document.getElementById('searchGroup').value;
        axios.get('v1/groups/search?query=' + group)
        .then(res =>{
          this.allGroups = res.data.data;
        })
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/groupfoundmodal.less';
</style>
