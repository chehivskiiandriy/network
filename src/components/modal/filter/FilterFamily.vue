<template>
  <modal
    name="changeFamily"
    width="100%"
    classes=" v--modal"
    height="100%"
    :scrollable="true">
    <div class="family-header">
      <i
        @click="hideFamily()"
        class="icon-left-f closeFamily"></i>
      <h3>{{$lang.variables.familyStatus}} </h3>
    </div>
    <div class="family-block">
      <div
        class="family-item--text"
        @click="changeFamilyStatus('married')">
        <p class="family-item">
          <span>{{$lang.variables.married}}</span>
          <span v-if="chooseFamily === 'married'"><i class="icon-check-f"></i></span>
        </p>
      </div>
      <div
        class="family-item--text"
        @click="changeFamilyStatus('in_relationship')">
        <p class="family-item">
          <span>{{$lang.variables.inRelations}}</span>
          <span v-if="chooseFamily === 'in_relationship'"><i class="icon-check-f"></i></span>
        </p>
      </div>
      <div
        class="family-item--text"
        @click="changeFamilyStatus('single')">
        <p class="family-item">
          <span>{{$lang.variables.single}}</span>
          <span v-if="chooseFamily === 'single'"><i class="icon-check-f"></i></span>
        </p>
      </div>
      <div
        class="family-item--text"
        @click="changeFamilyStatus('in_search')">
        <p class="family-item">
          <span>{{$lang.variables.inSearch}}</span>
          <span v-if="chooseFamily === 'in_search'"><i class="icon-check-f"></i></span>
        </p>
      </div>
      <div
        class="family-item--text"
        @click="changeFamilyStatus('in_active_search')">
        <p class="family-item">
          <span>{{$lang.variables.inActiveSearchInRating}}</span>
          <span v-if="chooseFamily === 'in_active_search'"><i class="icon-check-f"></i></span>
        </p>
      </div>
    </div>
  </modal>
</template>

<script>
  export default {
    name: "FilterFamily",
    props: {
      chooseFamily: String
    },
    methods: {
      hideFamily(){
        this.$modal.hide('changeFamily');
        this.$emit('familyStatus', this.chooseFamily);
      },
      changeFamilyStatus(status){
        this.chooseFamily = status;
      },
    }
  }
</script>

<style lang="less">
</style>
