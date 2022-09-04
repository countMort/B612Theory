<template>
  <div class="example-container">
    <div id="scanning-overlay" class="hidden">
      <div class="inner">
        <img src="https://dl.b612theory.ir/admin/test-target.jpg">
        <div class="scanline" />
      </div>
    </div>

    <a-scene
      :mindar-image="`
      imageTargetSrc: https://dl.b612theory.ir/admin/test-target.mind;
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
        <!-- <img id="card" src="https://dl.b612theory.ir/admin/test-target.jpg"> -->
        <img id="icon-play" src="@/assets/images/card-example/play.svg">
        <img id="icon-pause" src="@/assets/images/card-example/pause.svg">
        <audio
          id="audio"
          src="https://dl.b612theory.ir/admin/Shazdeh.Koochooloo.mp3"
          autoplay="false"
          controls
          preload="auto"
        />
        <!-- <img id="icon-web" src="@/assets/images/card-example/web.png">
        <img
          id="icon-location"
          src="@/assets/images/card-example/location.png"
        >
        <img id="icon-profile" src="@/assets/images/card-example/profile.png">
        <img id="icon-phone" src="@/assets/images/card-example/phone.png">
        <img id="icon-email" src="@/assets/images/card-example/email.png">
        <img id="icon-left" src="@/assets/images/card-example/left.png">
        <img id="icon-right" src="@/assets/images/card-example/right.png">
        <img
          id="paintandquest-preview"
          src="@/assets/images/card-example/paintandquest-preview.png"
        >
        <video
          id="audio"
          autoplay="false"
          loop="true"
          src="@/assets/images/card-example/paintandquest.webm"
        /> -->
        <!-- <img
          id="coffeemachine-preview"
          src="@/assets/images/card-example/coffeemachine-preview.png"
        >
        <img
          id="peak-preview"
          src="@/assets/images/card-example/peak-preview.png"
        >

        <a-asset-item
          id="avatarModel"
          src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.0.0/examples/image-tracking/assets/card-example/softmind/scene.gltf"
        /> -->
      </a-assets>

      <a-camera
        position="0 0 0"
        look-controls="enabled: false"
        cursor="fuse: false; rayOrigin: mouse;"
        raycaster="far: 10000; objects: .clickable"
      />

      <a-entity id="mytarget" mytarget mindar-image-target="targetIndex: 0">
        <!-- <a-plane
          src="#card"
          position="0 0 0"
          height="0.552"
          width="1"
          rotation="0 0 0"
        /> -->

        <a-entity id="portfolio-panel" visible="false" position="0 0 -0.01">
          <a-entity id="portfolio-item0">
            <a-sound
              id="frame-audio"
              autoplay="false"
              position="0 2 5"
              src="#audio"
            />
            <a-image
              id="frame-play"
              class="clickable"
              src="#icon-play"
              alpha-test="0.5"
              position="0 0 0"
              height="0.5"
              width="0.5"
            />
            <a-image
              id="frame-pause"
              class="clickable"
              src="#icon-pause"
              alpha-test="0.5"
              position="0 0 0"
              height="0.5"
              width="0.5"
              visible="false"
            />
          </a-entity>
          <!-- <a-text
            value="Portfolio"
            color="black"
            align="center"
            width="2"
            position="0 0.4 0"
          />
          <a-entity id="portfolio-item1" visible="false">
            <a-image
              class="clickable"
              src="#coffeemachine-preview"
              alpha-test="0.5"
              position="0 0 0"
              height="0.552"
              width="1"
            />
          </a-entity>
          <a-entity id="portfolio-item2" visible="false">
            <a-image
              class="clickable"
              src="#peak-preview"
              alpha-test="0.5"
              position="0 0 0"
              height="0.552"
              width="1"
            />
          </a-entity> -->

          <!-- <a-image
            id="portfolio-left-button"
            visible="false"
            class="clickable"
            src="#icon-left"
            position="-0.7 0 0"
            height="0.15"
            width="0.15"
          />
          <a-image
            id="portfolio-right-button"
            visible="false"
            class="clickable"
            src="#icon-right"
            position="0.7 0 0"
            height="0.15"
            width="0.15"
          /> -->
        </a-entity>

        <!-- <a-image
          id="profile-button"
          visible="false"
          class="clickable"
          src="#icon-profile"
          position="-0.42 -0.5 0"
          height="0.15"
          width="0.15"
          animation="property: scale; to: 1.2 1.2 1.2; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
        />

        <a-image
          id="web-button"
          visible="false"
          class="clickable"
          src="#icon-web"
          alpha-test="0.5"
          position="-0.14 -0.5 0"
          height="0.15"
          width="0.15"
          animation="property: scale; to: 1.2 1.2 1.2; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
        />

        <a-image
          id="email-button"
          visible="false"
          class="clickable"
          src="#icon-email"
          position="0.14 -0.5 0"
          height="0.15"
          width="0.15"
          animation="property: scale; to: 1.2 1.2 1.2; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
        />

        <a-image
          id="location-button"
          visible="false"
          class="clickable"
          src="#icon-location"
          position="0.42 -0.5 0"
          height="0.15"
          width="0.15"
          animation="property: scale; to: 1.2 1.2 1.2; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate"
        />

        <a-gltf-model
          id="avatar"
          rotation="0 0 0"
          position="0 -0.25 0"
          scale="0.004 0.004 0.004"
          src="#avatarModel"
        />

        <a-text
          id="text"
          class="clickable"
          value=""
          color="black"
          align="center"
          width="2"
          position="0 -1 0"
          geometry="primitive:plane; height: 0.1; width: 2;"
          material="opacity: 0.5"
        /> -->
      </a-entity>
    </a-scene>
  </div>
</template>

<script>
if (process.client) {
  require('mind-ar/dist/mindar-image.prod.js')
  require('aframe')
  require('mind-ar/dist/mindar-image-aframe.prod.js')
  // const showInfo = () => {
  // const profileButton = document.querySelector('#profile-button')
  // const webButton = document.querySelector('#web-button')
  // const emailButton = document.querySelector('#email-button')
  // const locationButton = document.querySelector('#location-button')
  // const text = document.querySelector('#text')
  // profileButton.setAttribute('visible', true)
  // setTimeout(() => {
  //   webButton.setAttribute('visible', true)
  // }, 300)
  // setTimeout(() => {
  //   emailButton.setAttribute('visible', true)
  // }, 600)
  // setTimeout(() => {
  //   locationButton.setAttribute('visible', true)
  // }, 900)
  // let currentTab = ''
  // webButton.addEventListener('click', function (evt) {
  //   text.setAttribute('value', 'https://softmind.tech')
  //   currentTab = 'web'
  // })
  // emailButton.addEventListener('click', function (evt) {
  //   text.setAttribute('value', 'hello@softmind.tech')
  //   currentTab = 'email'
  // })
  // profileButton.addEventListener('click', function (evt) {
  //   text.setAttribute('value', 'AR, VR solutions and consultation')
  //   currentTab = 'profile'
  // })
  // locationButton.addEventListener('click', function (evt) {
  //   console.log('loc')
  //   text.setAttribute('value', 'Vancouver, Canada | Hong Kong')
  //   currentTab = 'location'
  // })
  // text.addEventListener('click', function (evt) {
  //   if (currentTab === 'web') {
  //     window.location.href = 'https://softmind.tech'
  //   }
  // })
  // }

  let isPlaying = false
  let eventsAdded = false
  const showPortfolio = (done) => {
    const portfolio = document.querySelector('#portfolio-panel')
    // const portfolioLeftButton = document.querySelector('#portfolio-left-button')
    // const portfolioRightButton = document.querySelector(
    //   '#portfolio-right-button'
    // )
    const playElement = document.querySelector('#frame-play')
    const pauseElement = document.querySelector('#frame-pause')

    let z = 0
    // let currentItem = 0

    portfolio.setAttribute('visible', true)

    // const showPortfolioItem = (item) => {
    //   for (let i = 0; i <= 2; i++) {
    //     document
    //       .querySelector('#portfolio-item' + i)
    //       .setAttribute('visible', i === item)
    //   }
    // }
    const id = setInterval(() => {
      z += 0.002
      if (z >= 0.1) {
        clearInterval(id)
        // portfolioLeftButton.setAttribute('visible', true)
        // portfolioRightButton.setAttribute('visible', true)
        // portfolioLeftButton.addEventListener('click', () => {
        //   currentItem = (currentItem + 1) % 3
        //   showPortfolioItem(currentItem)
        // })
        // portfolioRightButton.addEventListener('click', () => {
        //   currentItem = (currentItem - 1 + 3) % 3
        //   showPortfolioItem(currentItem)
        // })

        if (!isPlaying) {
          if (eventsAdded) { return }
          playElement.addEventListener('click', () => {
            playElement.setAttribute('visible', false)
            playElement.setAttribute('position', '0 0 -1')
            pauseElement.setAttribute('visible', true)
            pauseElement.setAttribute('position', '0 0 0')
            document.querySelector('#audio').play()
            isPlaying = true
          })
          pauseElement.addEventListener('click', () => {
            playElement.setAttribute('visible', true)
            playElement.setAttribute('position', '0 0 0')
            pauseElement.setAttribute('visible', false)
            pauseElement.setAttribute('position', '0 0 -1')
            document.querySelector('#audio').pause()
            isPlaying = false
          })
        } else {
          document.querySelector('#audio').play()
        }
        eventsAdded = true

        // setTimeout(() => {
        //   done()
        // }, 500)
      }
      portfolio.setAttribute('position', '0 0 ' + z)
    }, 10)
  }

  // const showAvatar = (onDone) => {
  //   const avatar = document.querySelector('#avatar')
  //   let z = -0.3
  //   const id = setInterval(() => {
  //     z += 0.008
  //     if (z >= 0.3) {
  //       clearInterval(id)
  //       onDone()
  //     }
  //     avatar.setAttribute('position', '0 -0.25 ' + z)
  //   }, 10)
  // }
  /* global AFRAME */
  AFRAME.registerComponent('mytarget', {
    init () {
      this.el.addEventListener('targetFound', (event) => {
        document.querySelector('#scanning-overlay').classList.add('hidden')
        // showAvatar(() => {
        // setTimeout(() => {
        showPortfolio(() => {
          // setTimeout(() => {
          //   showInfo()
          // }, 300)
        })
        // }, 300)
        // })
      })
      this.el.addEventListener('targetLost', (event) => {
        document.querySelector('#audio').pause()
        document.querySelector('#scanning-overlay').classList.remove('hidden')
      })
      // this.el.emit('targetFound');
    }
  })
}
export default {}
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
