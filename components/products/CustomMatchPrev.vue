<template>
  <v-container fluid>
    <div
      class="scene"
      :style="{ width, height, perspective: `calc(${width} + ${height} + ${depth})` }"
    >
      <div class="box rotate" :style="{ width, height }">
        <div
          class="box__face box__face--front"
          :style="{
            width,
            height,
            transform: `rotateY(0deg) translateZ(calc(${depth}/2))`
          }"
        >
          front
        </div>
        <div
          class="box__face box__face--back"
          :style="{
            width,
            height,
            transform: `rotateY(180deg) translateZ(calc(${depth}/2))`
          }"
        >
          back
        </div>
        <div
          class="box__face box__face--right"
          :style="{
            width: depth,
            height,
            left: `calc(${width}/2 - ${depth}/2)`,
            transform: `rotateY(90deg) translateZ(calc(${width}/2))`
          }"
        >
          right
        </div>
        <div
          class="box__face box__face--left"
          :style="{
            width: depth, height,
            left: `calc(${width}/2 - ${depth}/2)`,
            transform: `rotateY(-90deg) translateZ(calc(${width}/2))`
          }"
        >
          left
        </div>
        <div
          class="box__face box__face--top"
          :style="{
            width,
            height: depth,
            top: `calc(${height}/2 - ${depth}/2)`,
            transform: `rotateX(90deg) translateZ(calc(${height}/2))`
          }"
        >
          top
        </div>
        <div
          class="box__face box__face--bottom"
          :style="{
            width,
            height: depth,
            top: `calc(${height}/2 - ${depth}/2)`,
            transform: `rotateX(-90deg) translateZ(calc(${height}/2))`
          }"
        >
          bottom
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    front: {
      type: Object,
      default: () => {}
    },
    back: {
      type: Object,
      default: () => {}
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '400px'
    },
    depth: {
      type: String,
      default: '100px'
    }
  },
  data () {
    return { }
  }
}
</script>

<style lang="scss" scoped>
$width: 200px;
$height: 400px;
$depth: 100px;
.scene {
  // width: $width;
  // height: $height;
  // border: 1px solid #ccc;
  margin: 80px;
  // perspective: calc(#{$width} + #{$height} + #{$depth});
  perspective-origin: 50% -50%;
}

.box {
  // width: $width;
  // height: $height;
  position: relative;
  transform-style: preserve-3d;
  transform: translateZ(-50px);
  transition: transform 1s;
}

// .box.show-front {
//   transform: translateZ(-50px) rotateY(0deg);
// }
// .box.show-back {
//   transform: translateZ(-50px) rotateY(-180deg);
// }
// .box.show-right {
//   transform: translateZ(-150px) rotateY(-90deg);
// }
// .box.show-left {
//   transform: translateZ(-150px) rotateY(90deg);
// }
// .box.show-top {
//   transform: translateZ(-100px) rotateX(-90deg);
// }
// .box.show-bottom {
//   transform: translateZ(-100px) rotateX(90deg);
// }

.box__face {
  position: absolute;
  border: 2px solid black;
  font-size: 40px;
  font-weight: bold;
  color: white;
  text-align: center;
}

// .box__face--front,
// .box__face--back {
//   width: $width;
//   height: $height;
//   line-height: $height;
// }

// .box__face--right,
// .box__face--left {
//   width: $depth;
//   height: $height;
//   left: calc(#{$width}/2 - #{$depth}/2);
//   line-height: $height;
// }

// .box__face--top,
// .box__face--bottom {
//   width: $width;
//   height: $depth;
//   top: calc(#{$height}/2 - #{$depth}/2);
//   line-height: $depth;
// }

.box__face--front {
  background: hsla(0, 100%, 50%, 0.7);
}
.box__face--right {
  background: hsla(60, 100%, 50%, 0.7);
}
.box__face--back {
  background: hsla(120, 100%, 50%, 0.7);
}
.box__face--left {
  background: hsla(180, 100%, 50%, 0.7);
}
.box__face--top {
  background: hsla(240, 100%, 50%, 0.7);
}
.box__face--bottom {
  background: hsla(300, 100%, 50%, 0.7);
}

// .box__face--front {
  // transform: rotateY(0deg) translateZ(calc(#{$depth}/2));
// }
// .box__face--back {
  // transform: rotateY(180deg) translateZ(calc(#{$depth}/2));
// }

// .box__face--right {
  // transform: rotateY(90deg) translateZ(calc(#{$width}/2));
// }
// .box__face--left {
  // transform: rotateY(-90deg) translateZ(calc(#{$width}/2));
// }

// .box__face--top {
  // transform: rotateX(90deg) translateZ(calc(#{$height}/2));
// }
// .box__face--bottom {
  // transform: rotateX(-90deg) translateZ(calc(#{$height}/2));
// }
</style>
