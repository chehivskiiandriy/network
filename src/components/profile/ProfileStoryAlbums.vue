<template>
  <div v-if="showAddButton || albums.length > 0" class="profile-story-albums">
    <swiper class="profile-story-albums__swiper" :options="swiperOptions">
      <swiper-slide v-if="showAddButton" class="profile-story-albums__slide">
        <div class="album-thumb create-album-button">
          <router-link :to="{name: 'add-story-album'}">
            <i class="album-thumb__create-icon create-album-button__icon">
              <span class="create-album-button__plus"></span>
            </i>
            <p class="album-thumb__caption create-album-button__caption">{{$lang.variables.saved}}</p>
          </router-link>
        </div>
      </swiper-slide>
      <swiper-slide class="profile-story-albums__slide" v-for="album in albums">
        <div class="album-thumb">
          <router-link :to="{name: 'story-album', params: {nickname, albumId: album.albumId}}">
            <img class="album-thumb__image" :src="album.previewSource"/>
            <figcaption class="album-thumb__caption">{{album.title}}</figcaption>
          </router-link>
        </div>
      </swiper-slide>
      <swiper-slide class="profile-story-albums__slide_spinner">
        <in-spinner :loading="isLoading" />
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
  export default {
    props: {
      albums: Array,
      nickname: String,
      albumSlug: String,
      showAddButton: Boolean,
      isLoading: Boolean,
    },
    data() {
      return {
        swiperOptions: {
          slidesPerView: 6,
          spaceBetween: 3,
          freeMode: true,
          slidesOffsetBefore: 3,
          slidesOffsetAfter: 3,
        }
      };
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  @thumb-image-width: 95%;
  @thumb-grey-border-size: 1px;
  @thumb-white-border-size: 2px;
  @thumb-full-border-size: @thumb-grey-border-size + @thumb-white-border-size;

  .album-thumb__image {
    overflow: hidden;
    display: block;
    width: @thumb-image-width;
    margin: auto;
    height: auto;
    padding: @thumb-white-border-size;
    border-radius: 6px;
    border: @thumb-grey-border-size solid @grey_grey;
    box-sizing: border-box;
  }

  .album-thumb__create-icon {
    margin: 0 auto;
  }

  .create-album-button__icon {
    @padding: ~"calc(" @thumb-image-width/2 ~" - " @thumb-full-border-size/2 ~")";
    padding: @padding;
    font-size: 7vw;
    height: 0;
    width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: @light__grey;
    border-radius: 6px;
    border: @thumb-grey-border-size solid @grey_grey;
  }

  .create-album-button__plus {
    border: 0.04em solid @light__grey;
    width: 1em;
    height: 0;
    background: @light__grey;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      content: "";
      border: 0.04em solid @light__grey;
      background: @light__grey;
      width: 0;
      height: 1em;
    }
  }

  .album-thumb__caption {
    color: @black;
    font-size: 2.4vw;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    white-space: nowrap;
    margin: 0.5vw 0 0 0;
  }

  .profile-story-albums__slide_spinner #SpinnerOnloadImg {
    width: 100% !important;
  }

</style>
