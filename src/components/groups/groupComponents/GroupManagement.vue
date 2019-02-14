<template>
    <div class="group-management">
      <in-header-block class="header header-gradient">
        <div
          @click="goBack"
          class="header-back">
          <i class="icon-left-f"></i>
        </div>
        <div class="header-content">
          <span class="header-content-name">Управление группи</span>
        </div>
        <div class="empty-block"></div>
      </in-header-block>

      <div class="group-management-content">
        <div class="group-management-content-block">
          <div class="group-management-content-block-title">Пости</div>
          <div class="group-management-content-block-items">
            <div class="group-management-content-block-item">
              <div class="checkbox"></div>
              <div class="group-management-content-block-item-text">
                Заборонити добавляти пости всім крім адміністратора
              </div>
            </div>
            <div class="group-management-content-block-item">
              <div class="checkbox"></div>
              <div class="group-management-content-block-item-text">
                Заборонити добавляти пости всім крім адміністратора
              </div>
            </div>
            <div class="group-management-content-block-item">
              <div class="checkbox"></div>
              <div class="group-management-content-block-item-text">
                Заборонити добавляти пости всім крім адміністратора
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "GroupManagement",
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style scoped>

</style>
