<template>
  <v-container
    style="height: 100%"
    class="text-center justify-center d-flex align-center"
  >
    <v-progress-linear
      v-if="loading"
      style="top: 15px; position: absolute; z-index: 2"
      indeterminate
      height="2"
    />
    <transition name="fade">
      <v-progress-linear
        v-if="buffered > 0 && buffered < 100 && !!seek"
        style="top: 15px; position: absolute; z-index: 2"
        stream
        :buffer-value="buffered"
        :value="seek"
        height="3"
        color="primary"
      />
    </transition>
    <!-- <audio v-if="OS" v-show="false" preload="auto" id="audio" :src="voiceCard.audio" /> -->
    <audio
      v-show="false"
      id="audio"
      preload="auto"
      :style="playing ? 'opacity: 0.7' : ''"
    >
      <source :src="voiceCard.audio" type="audio/mpeg">
      <source :src="voiceCard.audio" type="audio/ogg">
      <source :src="voiceCard.audio" type="audio/flac">
      <source :src="voiceCard.audio" type="audio/mp4">
      <source :src="voiceCard.audio" type="audio/wav">
      <source :src="voiceCard.audio" type="audio/x-m4a">
      Does Not Support
    </audio>
    <AddVoice
      v-if="onInputProcess"
      :voice-card="voiceCard"
      dark
      @updated="refresh()"
      @sampleUpdated="sampleUpdated"
    />
    <template v-else>
      <v-img
        id="my-node"
        max-width="800"
        :aspect-ratio="14.142 / 10"
        class="align-center text-center my-auto"
        :src="voiceCard && voiceCard.photo"
      >
        <v-progress-circular
          :style="playing ? 'opacity: 0.7' : ''"
          :size="$vuetify.breakpoint.xsOnly ? 60 : 100"
          color="teal"
          :width="$vuetify.breakpoint.xsOnly || waiting ? 6 : 13"
          :value="seek"
          rotate="180"
          class="audio-snippet"
          :indeterminate="!loading && waiting"
        >
          <v-btn
            v-if="!playing"
            :ripple="false"
            :large="!$vuetify.breakpoint.xsOnly && !seek"
            :x-small="$vuetify.breakpoint.xsOnly && !!seek"
            :disabled="waiting"
            icon
            @click="play"
          >
            <v-icon
              :large="!$vuetify.breakpoint.xsOnly && !seek"
              :small="$vuetify.breakpoint.xsOnly && !!seek"
            >
              mdi-play
            </v-icon>
          </v-btn>
          <v-btn
            v-else
            :x-small="$vuetify.breakpoint.xsOnly"
            :ripple="false"
            icon
            @click="pause"
          >
            <v-icon :small="$vuetify.breakpoint.xsOnly">
              mdi-pause
            </v-icon>
          </v-btn>
          <v-btn
            v-if="seek"
            :x-small="$vuetify.breakpoint.xsOnly"
            :ripple="false"
            icon
            @click="stop"
          >
            <v-icon :small="$vuetify.breakpoint.xsOnly">
              mdi-stop
            </v-icon>
          </v-btn>
        </v-progress-circular>
        <!-- <div :class="!playing && seek == 0 && 'hide-wave'" id="waveform"></div> -->
      </v-img>
    </template>
  </v-container>
</template>

<script>
// if(process.client) {
//     var WaveSurfer = require("@/utils/wave.js")
// }
import AddVoice from '~/components/voice-card/AddVoice.vue'
export default {
  components: {
    AddVoice
  },
  layout: 'VoiceCard',
  async asyncData ({ $axios, route, params }) {
    try {
      const isSample = params.id === 'sample-1'
      if (isSample) {
        return {
          voiceCard: {
            isSample: true,
            photo: 'https://dl.b612theory.ir/admin/kahkeshan.jpg',
            type: '60a80142d6a7bbb590a2fc99',
            qrNumber: 1,
            waveColor: '#000000'
          },
          onInputProcess: true
        }
      }
      const { result } = await $axios.$get(`/api/voice-card/${route.params.id}`, {
        params: {
          password: route.query.password
        }
      })
      if (!result.audio) {
        return {
          voiceCard: result,
          onInputProcess: true
        }
      } else {
        return {
          onInputProcess: false,
          voiceCard: result
        }
      }
    } catch (error) {
    }
  },
  data () {
    return {
      seek: 0,
      playing: false,
      wavesurfer: null,
      progress: null,
      duration: 1,
      loading: false,
      buffered: 0,
      height: 1000,
      voiceCard: {},
      onInputProcess: false,
      waiting: false
      // progressColor: 'white'
    }
  },
  computed: {
    OS () {
      if (!process.client) {
        return true
      }
      const userAgent = navigator.userAgent || navigator.vendor || window.opera

      // Windows Phone must come first because its UA also contains 'Android'
      if (/windows phone/i.test(userAgent)) {
        return true
      }

      if (/android/i.test(userAgent)) {
        return true
      }

      // iOS detection from: http://stackoverflow.com/a/9039885/177710
      if (/iPad|iPhone|iPod|Mac OS X/.test(userAgent) && !window.MSStream) {
        return false
      }
      return true
    }
  },
  mounted () {
    this.setupWave()
    // this.wavesurfer.load(result.audio)
  },
  methods: {
    // READ(password) {
    //     this.$try(async ()=> {
    //         let {result} = await this.$axios.$get(`/api/voice-card/${this.$route.params.id}`, {
    //             params: {
    //                 password: password || this.$route.query.password
    //             }
    //         })
    //         this.voiceCard = result
    //         if (!result.audio) return this.onInputProcess = true
    //         else this.onInputProcess = false
    //         this.setupWave()
    //         // this.wavesurfer.load(result.audio)
    //     }, this)
    // },
    setupWave () {
      this.wavesurfer = document.getElementById('audio')
      this.wavesurfer.addEventListener('waiting', () => (this.waiting = true))
      this.wavesurfer.addEventListener('canplay', () => (this.waiting = false))
      // this.duration = this.wavesurfer.duration

      // this.wavesurfer = WaveSurfer.create({
      //     container: '#waveform',
      //     scrollParent: true,
      //     waveColor: this.voiceCard.waveColor,
      //     barHeight: 1,
      //     minPxPerSec: 1,
      //     normalize: true,
      //     backend: 'MediaElement',
      //     // interact: false,
      //     responsive: true,
      //     height: 128,
      //     progressColor: 'white',
      // });
      // this.wavesurfer.on('ready', () => {
      //     this.loading = false
      //     this.duration = this.wavesurfer.getDuration()
      //     // this.wavesurfer.seekTo(this.seek/100)
      //     this.setHeight()
      // })
      // this.wavesurfer.on('finish', () => {
      //     this.stop()
      // })
      // this.wavesurfer.on('loading', (percentage) => this.buffered = percentage)
    },
    play () {
      this.$try(() => {
        if (!this.wavesurfer.duration) {
          return
        }
        this.wavesurfer.play()
        this.playing = true
        this.duration = this.wavesurfer.duration
        this.progress = setInterval(() => {
          // this.seek = (this.wavesurfer.getCurrentTime()/this.duration).toFixed(3)*100
          this.seek =
            (this.wavesurfer.currentTime / this.duration).toFixed(3) * 100
          this.buffered =
            (this.wavesurfer.buffered.end(0) / this.duration).toFixed(3) * 100
          if (this.seek == 100) {
            this.stop()
          }
        }, 300)
      })
    },
    pause () {
      clearInterval(this.progress)
      this.wavesurfer.pause()
      this.playing = false
    },
    stop () {
      clearInterval(this.progress)
      // this.wavesurfer.stop()
      this.wavesurfer.pause()
      this.playing = false
      this.wavesurfer.currentTime = 0
      this.seek = 0
    },
    setHeight () {
      this.height = document
        .querySelector('#my-node .v-image__image.v-image__image--cover')
        .clientHeight.toFixed(0)
      this.wavesurfer.setHeight(this.height / 10)
      setTimeout(() => {
        this.height = document
          .querySelector('#my-node .v-image__image.v-image__image--cover')
          .clientHeight.toFixed(0)
        this.wavesurfer.setHeight(this.height / 10)
      }, 1000)
    },
    refresh () {
      location.reload()
    },
    sampleUpdated (data) {
      this.wavesurfer = document.createElement('audio')
      this.wavesurfer.src = data.audio
      this.wavesurfer.addEventListener('waiting', () => (this.waiting = true))
      this.wavesurfer.addEventListener('canplay', () => (this.waiting = false))
      this.onInputProcess = false
    }
  }
}
</script>

<style>
#waveform.hide-wave wave > wave {
  display: none !important;
}
.audio-snippet {
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 100%;
  position: absolute;
  left: 50%;
  margin-right: -50%;
  top: 50%;
  margin-bottom: -50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: 1s;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
