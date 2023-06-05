<template>
  <div class="example-container">
    <div id="scanning-overlay" class="hidden">
      <div class="inner">
        <img :src="`https://dl.b612theory.ir/admin/${path}.jpg`">
        <div class="scanline" />
      </div>
    </div>

    <a-scene
      :mindar-image="`
        imageTargetSrc: https://dl.b612theory.ir/admin/${path}.mind;
        showStats: false;
        uiScanning: #scanning-overlay;
        filterBeta: 0;`"
      embedded
      color-space="sRGB"
      renderer="colorManagement: true, physicallyCorrectLights"
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <a-asset-item
          id="avatarModel"
          :src="`https://dl.b612theory.ir/admin/${path}.glb`"
        />
      </a-assets>
      <a-camera
        position="0 0 0"
        look-controls="enabled: false"
        cursor="fuse: false; rayOrigin: mouse;"
        raycaster="far: 10000; objects: .clickable"
      />

      <a-entity
        id="mytarget"
        mytarget
        mindar-image-target="targetIndex: 0"
      >
        <a-gltf-model
          id="avatar"
          rotation="0 0 0"
          :position="position"
          :scale="scale"
          src="#avatarModel"
          animation-mixer
        />
      </a-entity>
    </a-scene>
  </div>
</template>

<script>
if (process.client) {
  require('mind-ar/dist/mindar-image.prod.js')
  require('aframe')
  require('mind-ar/dist/mindar-image-aframe.prod.js')
  require('aframe-extras')
  const showAvatar = () => {
    const avatar = document.querySelector('#avatar')
    let z = -0.3
    const id = setInterval(() => {
      z += 0.008
      if (z >= 0.25) {
        clearInterval(id)
      }
      avatar.setAttribute('position', '0 -0.25 ' + z)
    }, 10)
  }

  /* global AFRAME */
  AFRAME.registerComponent('mytarget', {
    init () {
      this.el.addEventListener('targetFound', (event) => {
        document.querySelector('#scanning-overlay').classList.add('hidden')
        showAvatar()
      })
      this.el.addEventListener('targetLost', (event) => {
        document.querySelector('#scanning-overlay').classList.remove('hidden')
      })
    }
  })
}
export default {
  props: {
    path: {
      type: String,
      default: ''
    },
    scale: {
      type: String,
      default: '1 1 1'
    },
    position: {
      type: String,
      default: '0 -0.25 0'
    }
  }
}
</script>

<style lang="scss" scoped>
.example-container {
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
}

#scanning-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: transparent;
  z-index: 2;
}

@media (min-aspect-ratio: 1/1) {
  #scanning-overlay .inner {
    width: 50vh;
    height: 50vh;
  }
}

@media (max-aspect-ratio: 1/1) {
  #scanning-overlay .inner {
    width: 80vw;
    height: 80vw;
  }
}

#scanning-overlay .inner {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  background: linear-gradient(to right, white 10px, transparent 10px) 0 0,
    linear-gradient(to right, white 10px, transparent 10px) 0 100%,
    linear-gradient(to left, white 10px, transparent 10px) 100% 0,
    linear-gradient(to left, white 10px, transparent 10px) 100% 100%,
    linear-gradient(to bottom, white 10px, transparent 10px) 0 0,
    linear-gradient(to bottom, white 10px, transparent 10px) 100% 0,
    linear-gradient(to top, white 10px, transparent 10px) 0 100%,
    linear-gradient(to top, white 10px, transparent 10px) 100% 100%;
  background-repeat: no-repeat;
  background-size: 40px 40px;
}

#scanning-overlay.hidden {
  display: none;
}

#scanning-overlay img {
  opacity: 0.6;
  width: 90%;
  align-self: center;
}

#scanning-overlay .inner .scanline {
  position: absolute;
  width: 100%;
  height: 10px;
  background: white;
  animation: move 2s linear infinite;
}

@keyframes move {
  0%,
  100% {
    top: 0%;
  }

  50% {
    top: calc(100% - 10px);
  }
}
</style>
