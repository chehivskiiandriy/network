<template>
  <div >

    <!--<canvas  id="canvas0" ref="canvas0" width=300 height=300></canvas>
    <canvas id="canvas1" ref="canvas1" width=300 height=300></canvas>
    <canvas id="canvas2" ref="canvas2" width=300 height=300></canvas>!-->
    <div id="container">
      <div class="svg-block">
        <svg class="cube-overflow" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
          <path class="cube0" fill-opacity="0" stroke-width="3" stroke="#fff" d="M 0,2 L 98,2 L 98,98 L 2,99 L 2,2"/>
        </svg>
        <svg class="cube-tifany" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
          <path   fill-opacity="0" stroke-width="3" stroke="#5ac5c6" d="M 0,2 L 98,2 L 98,98 L 2,99 L 2,2"/>
        </svg>
      </div>
      <div class="svg-block">
        <svg class="cube-overflow" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
          <path class="cube1" fill-opacity="0" stroke-width="3" stroke="#fff" d="M 0,2 L 98,2 L 98,98 L 2,99 L 2,2"/>
        </svg>
        <svg class="cube-tifany"  xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
          <path  fill-opacity="0" stroke-width="3" stroke="#5ac5c6" d="M 0,2 L 98,2 L 98,98 L 2,99 L 2,2"/>
        </svg>
      </div>
      <div class="svg-block">
        <svg class="cube-overflow" xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
          <path class="cube2" fill-opacity="0" stroke-width="3" stroke="#fff" d="M 0,2 L 98,2 L 98,98 L 2,99 L 2,2"/>
        </svg>
        <svg class="cube-tifany"  xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100">
          <path  fill-opacity="0" stroke-width="3" stroke="#5ac5c6" d="M 0,2 L 98,2 L 98,98 L 2,99 L 2,2"/>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
  export default  {
    data() {
      return {
        percent:[100,100,100],
        offsetX : 100,
        offsetY : 100,
        thisCanvas:0,
        horizLineLength : 80,
        vertLineLength : 100,
        cornerRadius : 12,
        myVar:'',
        // calc some lengths for use in percent complete
        cornerLength : '',
        totalLength : '',
        // calc at what accumulated length each part of the rect starts
        startT : 0,
        startTR : '',
        startR :'',
        startBR : '',
        startB : '',
        startBL : '',
        startL : '',
        startTL : '',
      }
    },
    data(){
      return {
          index:0,
      }
    },
    mounted() {
     //this.chooseCanvas();
      for (let i=0; i<3; i++) {
        setTimeout(()=>{
          let module='.cube'+i;
          let bar = new ProgressBar.Path(module, {
            easing: 'easeInOut',
            duration: 4500
          });
          bar.set(0);
          bar.animate(1.0);
        },4500*i);
      }

      // Number from 0.0 to 1.0
    },

    methods: {
      chooseCanvas(){
        let newcanvas='canvas'+this.thisCanvas;
        let canvas = document.getElementById(newcanvas);
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gold";
        this.startAnimation(canvas,ctx);
      },
      startAnimation(canvas,ctx) {
        this.myVar = setInterval(()=>{ this.myTimer(canvas,ctx) }, 50);
      },
      myTimer(canvas,ctx) {
        this.percent[this.thisCanvas]--;
        if (this.percent[this.thisCanvas]<0) {
          this.thisCanvas++;
          clearInterval(this.myVar);
          this.chooseCanvas();
        }
        else{
          this.drawPercentRect(canvas,ctx,this.percent[this.thisCanvas]);

        }
      },
      drawPercentRect(canvas,ctx,percent) {
        this.cornerLength =2 * this.cornerRadius * Math.PI;
        this.totalLength = this.cornerLength * 4 + this.horizLineLength * 2 + this.vertLineLength * 2;
        this.startTR = this.horizLineLength;
          this.startR =this.startTR + this.cornerLength;
          this.startBR = this.startR + this.vertLineLength;
          this.startB = this.startBR + this.cornerLength;
          this.startBL = this.startB + this.horizLineLength;
          this.startL= this.startBL + this.cornerLength;
          this.startTL = this.startL + this.vertLineLength;
        let accumLength = percent / 100 * this.totalLength;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // right line
        let d = accumLength - this.startR;
        d = Math.min(d, this.vertLineLength);
        if (d > 0) {
          let x1 = this.offsetX + this.cornerRadius + this.horizLineLength + this.cornerRadius;
          let y1 = this.offsetY + this.cornerRadius;
          let x2 = this.offsetX + this.cornerRadius + this.horizLineLength + this.cornerRadius;
          let y2 = this.offsetY + this.cornerRadius + d;
          this.drawLine(ctx,x1, y1, x2, y2);
        }

        // bottom-right corner
        d = accumLength - this.startBR;
        d = Math.min(d, this.cornerLength);
        if (d > 0) {
          let x = this.offsetX + this.cornerRadius + this.horizLineLength;
          let y = this.offsetY + this.cornerRadius + this.vertLineLength;
          let start = 0;
          let end = (d / this.cornerLength) * Math.PI / 2;
          this.drawCorner(ctx,x, y, start, end);
        }

        // bottom line
        d = accumLength - this.startB;
        d = Math.min(d, this.horizLineLength);
        if (d > 0) {
          let x1 = this.offsetX + this.cornerRadius + this.horizLineLength;
          let y1 = this.offsetY + this.cornerRadius + this.vertLineLength + this.cornerRadius;
          let x2 = this.offsetX + this.cornerRadius + this.horizLineLength - d;
          let y2 = this.offsetY + this.cornerRadius + this.vertLineLength + this.cornerRadius;
          this.drawLine(ctx,x1, y1, x2, y2);
        }

        // bottom-left corner
        d = accumLength - this.startBL;
        d = Math.min(d, this.cornerLength);
        if (d > 0) {
          let x = this.offsetX + this.cornerRadius;
          let y = this.offsetY + this.cornerRadius + this.vertLineLength;
          let start = Math.PI / 2;
          let end = Math.PI / 2 + (d / this.cornerLength) * Math.PI / 2;
          this.drawCorner(ctx,x, y, start, end);
        }

        // left line
        d = accumLength - this.startL;
        d = Math.min(d, this.vertLineLength);
        if (d > 0) {
          let x1 = this.offsetX;
          let y1 = this.offsetY + this.cornerRadius + this.vertLineLength;
          let x2 = this.offsetX;
          let y2 = this.offsetY + this.cornerRadius + this.vertLineLength - d;
          this.drawLine(ctx,x1, y1, x2, y2);
        }

        // top-left corner
        d = accumLength - this.startTL;
        d = Math.min(d, this.cornerLength);
        if (d > 0) {
          let x = this.offsetX + this.cornerRadius;
          let y = this.offsetY + this.cornerRadius;
          let start = Math.PI;
          let end = Math.PI + (d / this.cornerLength) * Math.PI / 2;
          this.drawCorner(ctx,x, y, start, end);
        }


        // top line
        d = accumLength - this.startT;
        d = Math.min(d, this.horizLineLength);
        if (d > 0) {
          let x1 = this.offsetX + this.cornerRadius;
          let y1 = this.offsetY;
          let x2 = this.offsetX + this.cornerRadius + d;
          let y2 = this.offsetY;
          this.drawLine(ctx,x1, y1, x2, y2);
        }

        // top-right corner
        d = accumLength - this.startTR;
        d = Math.min(d, this.cornerLength);
        if (d > 0) {
          let x = this.offsetX + this.cornerRadius + this.horizLineLength;
          let y = this.offsetY + this.cornerRadius;
          let start = -Math.PI / 2;
          let end = -Math.PI / 2 + (d / this.cornerLength * Math.PI / 2);
          this.drawCorner(ctx,x, y, start, end);
        }


      },
      drawLine(ctx,x1, y1, x2, y2) {
        ctx.beginPath(ctx,x1, y1, x2, y2);
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2);
        ctx.stroke();
      },
      drawCorner(ctx,x, y, start, end) {
        ctx.beginPath();
        ctx.arc(x, y, this.cornerRadius, start, end, false);
        ctx.stroke();
      }
    }
  }
</script>
<style>
  canvas {
    transform: rotate(90deg) scale(1, -1);
  }

  .svg-block {
    position: relative;
    text-align: left;
  }

  svg {
    width: 100px;
    border-radius: 10px;
  }

  .cube-overflow {
    position: absolute;
    left: 0px;

  }

  .cube-tifany {
    width: 10.1vw;
    height: 10vw;

    top: 0px;
    position: absolute;
    left: 3px;
  }
</style>
