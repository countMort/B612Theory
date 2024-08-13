<template>
  <div class="container">
    <video ref="webcam" crossorigin="anonymous" autoplay />
    <canvas ref="canvas" />
  </div>
</template>

<script>
let THREE
let tf
let faceLandmarksDetection
if (process.client) {
  THREE = require('three')
  tf = require('@tensorflow/tfjs-core')
  require('@tensorflow/tfjs-converter')
  require('@tensorflow/tfjs-backend-webgl')
  faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection')
}
// import * as THREE from 'three'
// import * as tf from '@tensorflow/tfjs-core'
// import '@tensorflow/tfjs-converter'
// import '@tensorflow/tfjs-backend-webgl'
// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection'
import glassesSrc from '@/assets/images/ar/sunglasses.png'

export default {
  data: () => ({
    model: null,
    glassesMesh: null,
    offsetX: 0,
    offsetY: 0,
    scaleX: 0,
    scaleY: 0,
  }),
  async mounted() {
    await this.loadResources()
    setInterval(() => {
      this.detectAndPositionGlasses()
    }, 120)
  },
  methods: {
    async loadResources() {
      try {
        const video = await this.loadVideo()
        // TensorFlow Model
        await tf.setBackend('webgl')
        const detectorConfig = {
          shouldLoadIrisModel: true,
          maxFaces: 1,
          runtime: 'mediapipe',
          solutionPath: 'https://dl.b612theory.ir/ar',
          // returnTensors: false,
          // predictIrises: false
        }
        const loadedModel = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          detectorConfig
        )
        this.model = loadedModel

        // Three.js Setup
        const canvasRef = this.$refs.canvas
        const width = canvasRef.clientWidth
        const height = canvasRef.clientHeight
        console.log('width: ', width, 'height: ', height);
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
          75,
          width / height,
          0.1,
          1000
        )
        camera.position.z = 5
        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef,
          alpha: true,
        })
        renderer.setSize(width, height)
        renderer.setAnimationLoop(() => renderer.render(scene, camera))

        // Glasses Mesh
        const textureLoader = new THREE.TextureLoader()
        textureLoader.load(glassesSrc, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace
          const geometry = new THREE.PlaneGeometry(2, 1)
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
          })
          const glasses = new THREE.Mesh(geometry, material)
          scene.add(glasses)
          this.glassesMesh = glasses
          this.offsetX = 0
          this.offsetY = 0
          this.scaleX = 8 / video.videoWidth
          this.scaleY = (6 / video.videoHeight) * -1
        })
      } catch (error) {
        console.error('Initialization error:', error)
      }
    },
    async loadVideo() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      })
      const video = this.$refs.webcam
      video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
      return video
    },
    async detectAndPositionGlasses() {
      const video = this.$refs.webcam
      if (!video || !this.model || !this.glassesMesh) return
      if (video.readyState !== 4) return

      const faceEstimates = await this.model.estimateFaces(video)
      if (faceEstimates.length > 0) {
        // Face mesh keypoints
        const keypoints = faceEstimates[0].keypoints
        const leftEye = keypoints[130]
        const rightEye = keypoints[359]
        const eyeCenter = keypoints[168]

        // Eye distance for glasses scaling
        const eyeDistance = Math.sqrt(
          Math.pow(rightEye.x - leftEye.x, 2) +
            Math.pow(rightEye.y - leftEye.y, 2)
        )
        const scaleMultiplier = eyeDistance / 110
        this.glassesMesh.scale.set(
          scaleMultiplier,
          scaleMultiplier,
          scaleMultiplier
        )

        // Glasses positioning
        this.glassesMesh.position.x =
          (eyeCenter.x - video.videoWidth / 2) * this.scaleX + this.offsetX
        this.glassesMesh.position.y =
          (eyeCenter.y - video.videoHeight / 2) * this.scaleY + this.offsetY
        this.glassesMesh.position.z = 1

        // Rotate glasses to align with eyes - rotation depth
        const eyeLine = new THREE.Vector2(
          rightEye.x - leftEye.x,
          leftEye.y - rightEye.y
        )
        const rotationZ = Math.atan2(eyeLine.y, eyeLine.x)
        this.glassesMesh.rotation.z = rotationZ
      }
    },
  },
}
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0;
}

.container video {
  width: 100%;
  height: 100%;
}

.container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
</style>
