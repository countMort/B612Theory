<template>
  <a-scene
    v-if="loaded"
    mindar-image="imageTargetSrc: https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/examples/image-tracking/assets/card-example/card.mind;"
    color-space="sRGB"
    renderer="colorManagement: true, physicallyCorrectLights"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
  >
    <a-assets>
      <img
        id="card"
        src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/examples/image-tracking/assets/card-example/card.png"
      >
      <a-asset-item
        id="avatarModel"
        src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/examples/image-tracking/assets/card-example/softmind/scene.gltf"
      />
    </a-assets>

    <a-camera position="0 0 0" look-controls="enabled: false" />
    <a-entity mindar-image-target="targetIndex: 0">
      <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0" />
      <a-gltf-model
        rotation="0 0 0 "
        position="0 0 0.1"
        scale="0.005 0.005 0.005"
        src="#avatarModel"
        animation="property: position; to: 0 0.1 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
      />
    </a-entity>
  </a-scene>
</template>

<script>
export default {
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    const firstScript = document.createElement('script')
    firstScript.src = 'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/dist/mindar-image.prod.js'
    firstScript.onload = () => {
      const secondScript = document.createElement('script')
      secondScript.src = 'https://aframe.io/releases/1.2.0/aframe.min.js'
      secondScript.onload = () => {
        const thirdScript = document.createElement('script')
        thirdScript.src = 'https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.4/dist/mindar-image-aframe.prod.js'
        document.head.appendChild(thirdScript)
        thirdScript.onload = () => {
          this.loaded = true
        }
      }
      document.head.appendChild(secondScript)
    }
    document.head.appendChild(firstScript)
  }
}
</script>

<style lang="scss" scoped>
</style>
