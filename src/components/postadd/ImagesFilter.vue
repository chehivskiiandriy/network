<template>
  <div class="filters-block">
    <p>{{$lang.variables.filtersForPhotos}}</p>
    <ul id="list">
      <li v-for="image in imagesArray">
        <img
          v-if="image.type === 'img'"
          class='previewPhotoArr'
          @click="getCanvas" :src="image.img"
          :alt="image.imgId"/>
        <div
          v-else
          class="previewVideo">
          <video
            :src="image.preview_url"
            :style="{height: clientWidth*0.18+'px'}">
          </video>
          <img class="preview-video-play-button" :src="playVideoButton"/>
        </div>
      </li>
    </ul>
    <template v-if="showFilters">
      <p>{{$lang.variables.append}} {{$lang.variables.filters}}</p>
      <div>
        <button class="image-filters" @click="getBlur()"> Blur</button>
        <button class="image-filters" @click="getSepia()"> Sepia</button>
        <button class="image-filters" @click="getGrey()"> Grey</button>
        <button class="image-filters" @click="getHue()"> Hue</button>
      </div>
      <div>
        <button class="image-filters" @click="getInvert()"> Invert</button>
        <button class="image-filters" @click="getSaturate()"> Saturate</button>
        <button class="image-filters" @click="getBlue()"> Blue</button>
        <button class="image-filters" @click="getBasic()"> No Filter</button>
      </div>
    </template>
    <canvas
      v-show="showFilters"
      id="filter-canvas"
      :style="{height: canvasHeight+'px'}"
      width="1920"
      height="1080">
    </canvas>
  </div>
</template>

<script>
  export default {
    props: ['imagesArray'],
    data() {
      return {
        eImg: '',
        imgID: '',
        pureImages: [],
        firstImageCanvas: '',
        playVideoButton: img.PlaySmall,
        clientWidth: localStorage.getItem('clientWidth'),
        canvasHeight: localStorage.getItem('clientWidth') * 0.80,
        showFilters: false
      }
    },
    mounted() {

    },
    methods: {
      getCanvas(e) {
        if(!this.showFilters) this.showFilters = true;

        let img = e.target;

        this.eImg = img;
        this.imgID = img.alt;
        let c = document.getElementById('filter-canvas');
        c.width = img.width * 5;
        c.height = img.height * 5;
        let ctx = c.getContext('2d');
        //ctx.filter = 'blur(5px)';
        ctx.drawImage(img, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);

      },
      getBlur() {
        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');
        ctx.filter = 'blur(5px)';
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();

      },
      getSepia() {
        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');
        ctx.filter = 'sepia(100%)';
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();
      },
      getBlue() {
        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');

        ctx.filter = 'saturate(50%)';
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();
      },
      getBasic() {
        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');
        ctx.filter = 'blur(0px)';
        ctx.filter = 'sepia(0%)';
        ctx.filter = 'grayscale(0%)';
        ctx.filter = 'hue-rotate(0deg)';
        ctx.filter = 'invert(0%)';
        ctx.filter = 'opacity(0%)';
        ctx.filter = 'saturate(100%)';
        this.eImg.src = this.imagesArray[this.imgID].imgB;
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();
      },
      getGrey() {
        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');
        ctx.filter = 'grayscale(100%)';
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();
      },
      getHue() {
        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');
        ctx.filter = 'hue-rotate(90deg)';
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();
      },
      getInvert() {

        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');
        ctx.filter = 'invert(100%)';
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();
      },
      getSaturate() {
        let c = document.getElementById('filter-canvas');
        let ctx = c.getContext('2d');
        ctx.filter = 'saturate(300%)';
        ctx.drawImage(this.eImg, 0, 0, c.width, c.height);
        ctx.getImageData(0, 0, c.width, c.height);
        this.getAccept();
      },
      getAccept() {
        let c = document.getElementById('filter-canvas');
        let imageNew = c.toDataURL();
        this.imagesArray[this.imgID].img = imageNew;

      },

    }
  }
</script>

<style>
  .image-filters {
    width: 20%;
    margin: .5% -1px;
    font-size: 3.4vw;
  }

  .filters-block {
    font-weight: 600;
    color: #777;
  }

  #filter-canvas {
    border-radius: 5px;
    width: 80%;
    margin: 10px auto;
    margin-top: 16px;
  }


</style>
