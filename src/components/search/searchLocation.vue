<template>
  <div class="search-location">
    <in-search-block
      class="search">
      <div class="search-input-block" style="width: 100%">
        <input
          type="text"
          :placeholder="$lang.variables.searchByLocation"
          @click="googleAutoComplete()"
          v-model="location"
          class="search-input-field"
          id="place"
          ref="place"
          name="place">
        <input
          type="hidden"
          name="placeId"
          id="placeId"
          ref="placeId"
          value=""/>
      </div>
    </in-search-block>

    <div
      v-if="posts.length > 0"
      class="post-block">
      <div
        v-for="post in posts"
        :key="post.id"
        class="prof-post profile-post">
        <in-profile-post-solo :post="post"/>
      </div>
    </div>

    <in-spinner :loading="loading"/>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  import {
    FETCH_LOCATION_POSTS,
    FETCH_LOCATION_POSTS_NEXT_PAGE,
    LOCATION_POSTS,
    LOADING,
    CHANGE_PLACE,
    PLACE,
    moduleName as searchLocationModule
  } from "Store/modules/search/searchLocation";

  import {scrollOnBottom} from "Mixins/scrollOnBottom";

  import ProfilePostSolo from 'ComponentsVue/profile/content/ProfilePostSolo.vue'


  export default {
    mixins: [scrollOnBottom],
    components: {
      inProfilePostSolo: ProfilePostSolo
    },
    data() {
      return {
        location: ''
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.getPostsLocationNextPage()
        }
      },
    },
    computed: {
      ...mapGetters({
        posts: searchLocationModule + LOCATION_POSTS,
        loading: searchLocationModule + LOADING,
        place: searchLocationModule + PLACE
      })
    },
    mounted() {
      if (this.place) {
        this.location = this.place.formatted_address;
      }
      if (this.posts.length === 0) {
        this.getPostsLocation();
      }
    },
    methods: {
      ...mapActions({
        getPostsLocation: searchLocationModule + FETCH_LOCATION_POSTS,
        getPostsLocationNextPage: searchLocationModule + FETCH_LOCATION_POSTS_NEXT_PAGE
      }),
      ...mapMutations({
        changePlace: searchLocationModule + CHANGE_PLACE
      }),
      goToLink(slug) {
        this.$router.push('/p/' + slug);
      },
      googleAutoComplete() {
        let autocomplete = new google.maps.places.Autocomplete(this.$refs.place);
        autocomplete.addListener('place_changed', () => {
          let place = autocomplete.getPlace();
          this.$refs.placeId.value = place.place_id;
          this.location = place.formatted_address;

          this.changePlace(place);
          this.getPostsLocation();
        });
      },
    }
  }
</script>

<style lang="less">
  .search-location {
    .post-block {
      display: flex;
      flex-wrap: wrap;
      text-align: left;
    }
  }

  .pac-container {
    margin-top: 5px !important;
  }
</style>
