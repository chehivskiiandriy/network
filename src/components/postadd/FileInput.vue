<template>
  <form enctype="multipart/form-data">
    <input
      @change="changeFile"
      type="file"
      ref="addPostInput"
      :multiple="multiple"
      :accept="accept"
      class="file-input">
  </form>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'

  import {
    ADD_TEMPORARY_FILES,
    moduleName as newPostModule,
    ADD_LOADING_FILES,
    TEMPORARY_FILES
  } from "Store/modules/newPost";

  export default {
    name: "FileInput",
    props: {
      accept: {
        type: String,
        default: "image/*, video/*"
      },
      redirect: {
        type: String,
        default: '/new-post'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      maxCount: {
        type: Number,
        default: 5
      },
      addLoading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        addPostInput: null
      }
    },
    computed: {
      ...mapGetters({
        temporaryFiles: newPostModule + TEMPORARY_FILES
      }),
    },
    methods: {
      ...mapMutations({
        addTemporaryFiles: newPostModule + ADD_TEMPORARY_FILES,
        addLoadingFiles: newPostModule + ADD_LOADING_FILES
      }),
      getOrientation(file, callback) {
        let reader = new FileReader();
        reader.onload = function (e) {

          let view = new DataView(e.target.result);
          if (view.getUint16(0, false) !== 0xFFD8) return callback(-2);
          let length = view.byteLength, offset = 2;
          while (offset < length) {
            let marker = view.getUint16(offset, false);
            offset += 2;
            if (marker === 0xFFE1) {
              if (view.getUint32(offset += 2, false) !== 0x45786966) return callback(-1);
              let little = view.getUint16(offset += 6, false) === 0x4949;
              offset += view.getUint32(offset + 4, little);
              let tags = view.getUint16(offset, little);
              offset += 2;
              for (let i = 0; i < tags; i++)
                if (view.getUint16(offset + (i * 12), little) === 0x0112)
                  return callback(view.getUint16(offset + (i * 12) + 8, little));
            }
            else if ((marker & 0xFF00) !== 0xFF00) break;
            else offset += view.getUint16(offset, false);
          }
          return callback(-1);
        };
        reader.readAsArrayBuffer(file);
      },
      getDataUrl(file, srcOrientation, callback2) {
          let reader2 = new FileReader();
          reader2.onloadend = function (e) {
            let srcBase64 = e.target.result;
            let img = new Image();

            img.onload = function () {
              let width = img.width,
                height = img.height,
                canvas = document.createElement('canvas'),
                ctx = canvas.getContext("2d");

              if (4 < srcOrientation && srcOrientation < 9) {
                canvas.width = height;
                canvas.height = width;
              } else {
                canvas.width = width;
                canvas.height = height;
              }

              switch (srcOrientation) {
                case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
                case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
                case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
                case 7: ctx.transform(0, -1, -1, 0, height, width); break;
                case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                default: break;
              }

              ctx.drawImage(img, 0, 0);

              callback2(canvas.toDataURL('image/jpeg', 0.9));
            };

            img.src = srcBase64;
          };

          reader2.readAsDataURL(file);
      },
      changeFile() {
        let files = this.$refs.addPostInput.files,
          filesLength = this.$refs.addPostInput.files.length;

        if (this.maxCount < filesLength) {
          this.$notify({
            group: 'max-size-error',
            duration: 3000,
            speed: 300,
          });
          console.log('max size 5 files');
          return;
        } else if (this.maxCount < filesLength + this.temporaryFiles.length) {
          this.$notify({
            group: 'max-size-error',
            duration: 3000,
            speed: 300,
          });
          console.log('max size 5 files');
          return;
        }

        if (this.addLoading) {
          this.addLoadingFiles(true);
        }

        let readFileCount = 0, payload = [];

        for (let i = 0; i < filesLength; i++) {
          if (files[i].type.includes('image')) {
            this.getOrientation(files[i], (orientation) => {
              console.log('orientation: ' + orientation);
              if(orientation === -1) {
                let reader = new FileReader();

                reader.onloadend = () => {

                  payload.push({
                    original: files[i],
                    file: reader.result,
                    type: 'image',
                    imgID: i,
                    metadata: null,
                    cropped: null
                  });

                  readFileCount++;

                  if (readFileCount === filesLength) {
                    if (this.addLoading) {
                      this.addLoadingFiles(false);
                    }
                    this.addTemporaryFiles(payload);
                    this.$router.push(this.redirect);
                  }
                };
                reader.readAsDataURL(files[i]);
              } else {
                this.getDataUrl(files[i], orientation, (file) => {
                  payload.push({
                    original: files[i],
                    file: file,
                    type: 'image',
                    imgID: i,
                    metadata: null,
                    cropped: null
                  });

                  readFileCount++;

                  if (readFileCount === filesLength) {
                    if (this.addLoading) {
                      this.addLoadingFiles(false);
                    }
                    this.addTemporaryFiles(payload);
                    this.$router.push(this.redirect);
                  }
                })
              }
            });
          } else {
            let URL = window.URL || window.webkitURL;

            payload.push({
              original: files[i],
              file: URL.createObjectURL(files[i]),
              type: 'video',
              order: i,
              preview: null
            });

            readFileCount++;
          }
        }

        if (readFileCount === filesLength) {
          if (this.addLoading) {
            this.addLoadingFiles(false);
          }
          this.addTemporaryFiles(payload);
          this.$router.push(this.redirect);
        }
      },
      emitClick() {
        this.$refs.addPostInput.click();
      }
    }
  }
</script>

<style lang="less" scoped>
  .file-input {
    display: none;
  }
</style>
