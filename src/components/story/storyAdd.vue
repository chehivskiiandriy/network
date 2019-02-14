<template>
  <div class="story-add-page">
    <div class="story-add-header">
      <div
        class="title">InStory
      </div>
      <i
        @click="resetPublish()"
        class="icon-left-f icon-back"></i>
    </div>

    <div class="preview">
      <!--<div class="bg-preview"></div>-->
      <img class="story-preview" id="story-preview" src="https://media.inrating.top/images/picture.jpg" alt="Picture">
      <video id="videostory-preview" src=""></video>
    </div>

    <div id="SpinnerPreload" class="spinner-upload"><img class="spinner-svg" src="https://media.inrating.top/images/Spinner.svg"/></div>
    <textarea class="story-teaxtarea" placeholder="Подпишите InStory" v-model="storyTitle">

    </textarea>
    <button class="action-post-button" type=" button"  @click="resetPublish">Отменить</button>
    <button class="action-post-button" type=" button"  @click="publishStory($event)">Опубликовать</button>

  </div>
</template>
<script>
  import axios from 'axios';

  export default  {
    data() {
      return {
        storyFile:{},
        storyTitle: '',
        stringIndex:0,
      }
    },
    mounted() {
      // this.chooseStory();
      this.storyFile = window.story.getters.getNewStory;

      let input;

      let type=this.storyFile.type.split('/');
      if (type[0] === 'image') {
        input=document.getElementById('story-preview');
        document.getElementById('videostory-preview').style.display='none';
        document.getElementById('story-preview').style.display='block';

        this.getOrientation(this.storyFile, (orientation) => {
          input = document.getElementById('story-preview');
          document.getElementById('videostory-preview').style.display = 'none';
          document.getElementById('story-preview').style.display = 'block';

          this.getDataUrl(this.storyFile, orientation, (file) => {
            input.src = file;
          });
        });
      }
      else {
        input=document.getElementById('videostory-preview');
        document.getElementById('videostory-preview').style.display='block';
        document.getElementById('story-preview').style.display='none';
        //let video = this.$refs.inputVideo.files[0];
        let videoPrev = window.URL.createObjectURL(this.storyFile);
        input.src= videoPrev;
      }


    },
    methods: {
      resetPublish() {
        this.$router.push('/');
      },
      chooseStory() {
        this.$refs.fileInput.click();
      },
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
        let input;
        this.storyFile = document.getElementById('file-input').files[0];
        let type = this.storyFile.type.split('/');
        if (type[0] == 'image') {
          this.getOrientation(this.storyFile, (orientation) => {
            input = document.getElementById('story-preview');
            document.getElementById('videostory-preview').style.display = 'none';
            document.getElementById('story-preview').style.display = 'block';

            this.getDataUrl(this.storyFile, orientation, (file) => {
              input.src = file;
            });
          });
        }
        else {
          input = document.getElementById('videostory-preview');
          document.getElementById('videostory-preview').style.display = 'block';
          document.getElementById('story-preview').style.display = 'none';
          let videoPrev = window.URL.createObjectURL(this.storyFile);
          input.src = videoPrev;
          let typeString = 'video/x-matroska video/mp4 video/quicktime  video/x-msvideo';
          this.stringIndex = typeString.indexOf(this.storyFile.type);

        }
      },
      publishStory(e) {

        if (this.stringIndex>=0) {
          document.getElementById('SpinnerPreload').style.display='block';
          e.target.disabled = true;
          axios.post('v1/uploads/create?type=story')
            .then(
              res=> {
                let upload_id=res.data.upload_id;
                let data=new FormData();
                data.append('upload_id', upload_id);
                data.append('file', this.storyFile);
                axios.post('v1/uploads/load',data)
                  .then(
                    res=> {
                      let upload= {
                        id:upload_id,
                        items: [res.data.file_id],
                      };
                      let params={
                        upload: JSON.stringify(upload),
                        title: this.storyTitle,
                      };
                      axios.post('v1/users/stories/add',params)
                        .then(
                          res=> {
                            document.getElementById('SpinnerPreload').style.display='none';
                            if (res.status==201) {
                              this.$notify({
                                group: 'add-story',
                                duration:3000,
                                speed:300,
                              });
                              this.$router.push('/');
                            }

                          }
                        )
                    }
                  )
              }
            )
        }
        else {
          alert('Недопустимый формат видео');
        }
      }
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/story.less';
  #SpinnerPreload {
    display: none;
  }

  .story-add-page {
    margin-top: -43px;

    .icon-back{
      position: absolute;
      top: 10px;
      left: 8px;
      color: #fff;
      font-size: 22px;
    }
  }

  .preview {
    width: 90vw;
    height: 90vw;
    margin: 20px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #ccc;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
  }

  .bg-preview {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    background: #ccc;
    filter: blur(1.5em);
    z-index: -1;
  }

  .story-preview {
    //width: 95%;
    //margin:10px auto;
    //border-radius: 5px;
    max-width: 100%;
    max-height: 100%;
  }

  .spinner-upload {
    position: fixed;
    top:0 ;
    width: 100%;
    height: 100%;

    background: rgba(0,0,0,0.7);
  }
  .spinner-svg {
    position: absolute;
    width: 35%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .story-add-header {
    height: 40px;
    position: relative;
    background: @grad;
    color: #fff;
    font-size: 22px;
    padding: 5px 0;
    line-height: 30px;
    box-sizing: border-box;
  }
  .action-post-button {

    width: 44%;
    margin: 10px 0.2%;
    text-align: center;
  }

  .story-teaxtarea {
    width: 90%;
    margin: auto;
    box-sizing: border-box;
    padding: 5px 10px;
    border-radius: 3px;
    font-size: 16px;
    border: 1px solid #5ac5c6;
  }
</style>
