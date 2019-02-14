class imageHelper{



      static b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || 'image/jpeg';
        sliceSize = sliceSize || 512;

        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize);

          let byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          let byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
      }

      static formatPhoto(_file){
        let block = _file.split(";");
        let contentType = block[0].split(":")[1];
        //let contentType='application/pdf';
        let realData = block[1].split(",")[1];
        let ourType = contentType.split('/')[1];
        let blob = this.b64toBlob(realData, contentType);
        return blob;
        //return new File([blob], 'imageFileName.'+ourType, {type: contentType});
      }

    }

    export default imageHelper

