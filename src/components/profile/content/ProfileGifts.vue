<template>
  <div class="profile-gifts">
    <in-profile-gift
      v-for="gift in gifts"
      :key="gift.id"
      :authUser="authUser"
      :gift="gift"/>
    <in-spinner :loading="loading"/>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex';

  import ProfileGiftItem from './ProfileGiftItem.vue'
  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import {AUTH_USER, moduleName as userModule} from 'Store/modules/authUser/user';
  import {
    FETCH_MY_GIFTS,
    FETCH_MY_GIFTS_NEXT_PAGE,
    MARK_ALL_GIFTS_AS_SEEN,
    LOADING,
    moduleName as giftsModule,
    MY_GIFTS
  } from 'Store/modules/authUser/gifts';

  export default {
    components: {
      inProfileGift: ProfileGiftItem
    },
    mixins: [scrollOnBottom],
    computed: {
      ...mapGetters({
        gifts: giftsModule + MY_GIFTS,
        loading: giftsModule + LOADING,
        authUser: userModule + AUTH_USER
      })
    },
    watch: {
      bottom(bottom){
        if(bottom){
          this.fetchMyGiftsNextPage()
        }
      },
    },
    async mounted(){
      await this.fetchMyGifts();
      this.markAllGiftsAsSeen();
    },
    methods: {
      ...mapActions({
        fetchMyGifts: giftsModule + FETCH_MY_GIFTS,
        fetchMyGiftsNextPage: giftsModule + FETCH_MY_GIFTS_NEXT_PAGE,
        markAllGiftsAsSeen: giftsModule + MARK_ALL_GIFTS_AS_SEEN,
      })
    }
  }
</script>


<style lang="less">

</style>
