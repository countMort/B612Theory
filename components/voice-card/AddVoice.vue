<template>
  <v-container>
    <v-form ref="form">
      <v-row class="my-0 justify-center">
        <v-col cols="12" sm="6" class="py-0">
          <v-alert dark outlined>
            سلام به استدیو ضبط کارت پستال صوتی B612 خوش اومدی
            <br>
            توی اینجا می‌تونی صدا یا آهنگی که آماده کردی رو، روی کارتت ثبت کنی
            <br>
          </v-alert>
          <client-only>
            <VoiceUpload
              v-model="voice"
              hide-details
              :num="1"
              mini
              type="audio"
              :max-size="10"
              :rules="notEmpty"
              :dark="dark"
              :show-icon="false"
            >
              <template #item>
                <v-progress-circular
                  v-if="voice && voice[0] && loaded"
                  size="80"
                  color="teal"
                  width="13"
                  :value="seek"
                  rotate="180"
                >
                  <v-btn
                    v-if="!playing"
                    :dark="dark"
                    :ripple="false"
                    :x-small="!!seek"
                    icon
                    @click="play"
                  >
                    <v-icon :small="!!seek">
                      mdi-play
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    :dark="dark"
                    :ripple="false"
                    x-small
                    icon
                    @click="pause"
                  >
                    <v-icon small>
                      mdi-pause
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="seek"
                    :dark="dark"
                    :ripple="false"
                    x-small
                    icon
                    @click="stop"
                  >
                    <v-icon small>
                      mdi-stop
                    </v-icon>
                  </v-btn>
                </v-progress-circular>
                <v-progress-circular
                  v-else-if="voice && voice[0]"
                  size="30"
                  color="blue"
                  indeterminate
                />
              </template>
              <template #label>
                از اینجا فایلت رو انتخاب کن
                <br>
                یادت باشه که فایلت باید فرمت های رایج صوتی باشه و حجمش زیر ده
                مگابایت
              </template>
            </VoiceUpload>
          </client-only>
        </v-col>
        <v-col cols="12" md="11" class="py-0">
          <v-img
            id="my-node"
            :aspect-ratio="14.142 / 10"
            class="text-center align-center justify-center"
            :src="voiceCard.photo"
            @load="setHeight"
            @click="setHeight"
          >
            <div
              id="waveform"
              :class="!playing && seek == 0 && 'hide-wave'"
            />
          </v-img>
        </v-col>
        <v-col cols="12" md="11">
          <uploader ref="voiceUpload" />
          <v-progress-linear
            v-show="Boolean(sampleUploadProggress)"
            class="my-2"
            :height="10"
            striped
            stream
            :buffer-value="0"
            :value="sampleUploadProggress"
          />
          <v-btn
            dark
            :disabled="!loaded || !voice || !voice[0]"
            :loading="loading"
            block
            class="primary px-8 mb-2"
            @click="confirm"
          >
            تایید و ارسال صدا
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <confirm-dialog v-model="confirmDialog" @confirm="submit" />
  </v-container>
</template>

<script>
// import VSwatches from 'vue-swatches'
import ConfirmDialog from './ConfirmVoice.vue'
import VoiceUpload from '@/components/SmallerUpload.vue'
import Uploader from '@/components/Uploader'
// Import the styles too, globally
import 'vue-swatches/dist/vue-swatches.css'
let WaveSurfer
if (process.client) {
  WaveSurfer = require('@/utils/wave.js')
}
export default {
  components: {
    VoiceUpload,
    // VSwatches,
    Uploader,
    ConfirmDialog
  },
  props: {
    voiceCard: {
      type: Object,
      default: () => {}
    },
    dark: Boolean
  },
  data () {
    return {
      voice: [],
      amr: '',
      seek: 0,
      playing: false,
      wavesurfer: null,
      progress: null,
      duration: 1,
      loaded: false,
      dialog: false,
      waveColor: '#000000',
      height: 1000,
      notEmpty: [v => !!v || ''],
      loading: false,
      confirmDialog: false,
      sampleUploadProggress: 0
      // progressColor: 'white'
    }
  },
  watch: {
    voice (newValue, oldValue) {
      this.checkVoiceType(newValue)
    },
    waveColor (nv) {
      this.wavesurfer.setWaveColor(nv)
    }
    // progressColor(nv) {
    //     this.wavesurfer.setProgressColor(nv)
    // }
  },
  mounted () {
    this.setupWave()
  },
  methods: {
    setupWave () {
      this.wavesurfer = WaveSurfer.create({
        container: '#waveform',
        scrollParent: true,
        waveColor: '#000000',
        barHeight: 1,
        minPxPerSec: 1,
        normalize: true,
        // interact: false,
        responsive: true,
        height: 128,
        progressColor: 'white'
      })
      this.wavesurfer.on('ready', () => {
        this.loaded = true
        this.duration = this.wavesurfer.getDuration()
      })
      this.wavesurfer.on('finish', () => {
        this.stop()
      })
    },
    play () {
      this.wavesurfer.play()
      this.playing = true
      this.progress = setInterval(() => {
        this.seek =
          (this.wavesurfer.getCurrentTime() / this.duration).toFixed(3) * 100
      }, 100)
    },
    pause () {
      clearInterval(this.progress)
      this.wavesurfer.pause()
      this.playing = false
    },
    stop () {
      clearInterval(this.progress)
      this.wavesurfer.stop()
      this.playing = false
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
    confirm () {
      if (this.$refs.form.validate()) {
        this.confirmDialog = true
      }
    },
    submit () {
      this.$try(async () => {
        const data = {}
        data.waveColor = this.waveColor
        data.password = this.$route.query.password
        if (this.amr) {
          data.audio = this.amr
        }
        if (this.voiceCard.isSample) {
          if (!data.audio) {
            data.audio = URL.createObjectURL(this.voice[0].file)
          }
          await this.sampleUpload(2000)
          this.$emit('sampleUpdated', data)
        } else {
          const result = await this.$refs.voiceUpload.upload(
            this.voice[0].file,
            '',
            'put',
            `/api/voice-card/plenty/${this.voiceCard._id}`,
            data
          )
          this.$toast.success(result.message)
          this.$emit('updated')
        }
        // let result = await this.$axios.$put(`/api/voice-card/plenty/${this.voiceCard._id}`, data)
      }, this)
    },
    async checkVoiceType (newValue) {
      try {
        const file = newValue[0] && newValue[0].file
        if (file) {
          this.loaded = false
          if (file.type == 'audio/amr') {
            this.transforming = true
            const formData = new FormData()
            formData.append('file', file)
            const { result } = await this.$axios.$post(
              '/api/upload/amr',
              formData
            )
            this.amr = result.url
            this.$toast.success(this.amr)
            this.transforming = false
          }
          this.seek = 0
          this.wavesurfer.load(this.amr || newValue[0].url || newValue[0].path)
        } else {
          this.loading = false
          this.stop()
        }
      } catch (error) {
        this.loading = false
        this.$toast.error(error)
        this.transforming = false
      }
    },
    sampleDelay (delay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, delay)
      })
    },
    sampleUpload (time) {
      const timeChunk = (100 / 2) / (time / 1000) // /2 to perform it each 500ms
      const interval = setInterval(() => {
        this.sampleUploadProggress += timeChunk
        if (this.sampleUploadProggress >= 100) {
          clearInterval(interval)
          this.sampleUploadProggress = 0
        }
      }, 500)
      return this.sampleDelay(time)
    }
  }
}
</script>

<style>
#waveform.hide-wave wave > wave {
  display: none !important;
}
.v-application .qr-code {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
