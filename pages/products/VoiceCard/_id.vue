<template>
  <v-container>
    <SocialHead
      :title="`B612 Theory | خرید ${voiceCard.name}`"
      :description="voiceCard.description"
      :image="voiceCard.photos && voiceCard.photos[0]"
    ></SocialHead>
    <v-form ref="form">
      <v-row class="my-0 justify-center">
        <v-col
          v-if="type.photos && type.photos[0]"
          cols="12"
          sm="4"
          lg="3"
          class="pb-0"
        >
          <v-card
            style="height: 100%"
            tile
            class="full-width"
            align="center"
            flat
          >
            <v-img height="100%" :src="type.photos[0]"></v-img>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" lg="9" class="pb-0 mt-sm-0 mt-3">
          <v-select
            label="نوع کارت صدا"
            dense
            outlined
            item-text="name"
            return-object
            :disabled="loading"
            :items="voiceCard.types"
            v-model="type"
          ></v-select>
          <!-- <label class="align-center justify-center d-flex">
                        <div class="mt-n2">
                            رنگ موج:
                        </div>
                        &nbsp;
                        <v-swatches
                            v-model="waveColor"
                            popover-x="left"
                            swatches="text-advanced"
                        ></v-swatches>
                    </label> -->
          <v-btn
            small
            elevation="0"
            block
            color="info"
            @click="descDialog = true"
          >
            راهنما
          </v-btn>
        </v-col>
        <v-col
          v-if="type.photos && !type.photos[0]"
          cols="12"
          lg="6"
          md="8"
          class="py-0"
        >
          <client-only>
            <photo-upload
              forceAspect
              aspect_ratio="1.4142*1"
              label="تصویرتو اینجا بذار"
              :num="2"
              v-model="image"
              mini
              :rules="imageRules"
            ></photo-upload>
          </client-only>
          <uploader ref="imageUpload"></uploader>
        </v-col>
        <v-col cols="12" lg="6" md="8" class="py-0">
          <client-only>
            <voice-upload
              label="وویستو اینجا بذار"
              :num="1"
              v-model="voice"
              mini
              type="audio"
              :maxSize="10"
              :rules="notEmpty"
            >
              <template v-if="loaded" v-slot:item>
                <v-progress-circular
                  size="80"
                  color="teal"
                  width="13"
                  :value="seek"
                  rotate="180"
                >
                  <v-btn
                    :ripple="false"
                    :x-small="!!seek"
                    icon
                    @click="play"
                    v-if="!playing"
                  >
                    <v-icon :small="!!seek">
                      mdi-play
                    </v-icon>
                  </v-btn>
                  <v-btn :ripple="false" x-small icon @click="pause" v-else>
                    <v-icon small>
                      mdi-pause
                    </v-icon>
                  </v-btn>
                  <v-btn :ripple="false" x-small icon @click="stop" v-if="seek">
                    <v-icon small>
                      mdi-stop
                    </v-icon>
                  </v-btn>
                </v-progress-circular>
              </template>
            </voice-upload>
          </client-only>
        </v-col>
        <!-- <label class="align-center d-flex">
                            <div class="mt-n2">
                                رنگ دنبال کننده:
                            </div>
                            &nbsp;
                            <v-swatches
                                v-model="progressColor"
                                popover-x="left"
                                swatches="text-advanced"
                            ></v-swatches>
                        </label> -->
        <!-- <v-btn :class="$vuetify.breakpoint.xsOnly && 'mb-2'" rounded color="info" @click="domToImage">
                            <v-icon>
                                mdi-eye
                            </v-icon>
                            &nbsp;
                            پیش‌نمایش تصویر
                        </v-btn> -->
        <v-col cols="12" md="11" class="py-0">
          <v-img
            id="my-node"
            :aspect-ratio="14.142 / 10"
            @load="setHeight"
            @click="setHeight"
            class="text-center align-center justify-center"
            :src="
              notCustom
                ? type.photos[0]
                : (image[0] && (image[0].url || image[0].path)) ||
                  require('~/static/images/no-picture.jpg')
            "
          >
            <div
              :class="!playing && seek == 0 && 'hide-wave'"
              id="waveform"
            ></div>
            <v-row
              class="my-0 mx-0 align-center caption"
              style="position: absolute; top: 0; left: 0; height: 100%; width: 100%;"
            >
              <v-col cols="4" v-for="a in 6" :key="a">
                <v-avatar
                  class="pointer opacity-on-hover qr-code"
                  :style="{
                    opacity: qr != a ? '0.7' : '',
                    'font-size': !$vuetify.breakpoint.mdAndUp ? '9px' : ''
                  }"
                  @click="qr = a"
                  :size="height / 8"
                  tile
                >
                  <v-img
                    v-if="qr == a"
                    :src="require('@/static/b612-qrcode.png')"
                  ></v-img>
                  <template v-else>
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                      محل قرارگیری
                    </template>
                    QR CODE
                  </template>
                </v-avatar>
              </v-col>
            </v-row>
          </v-img>
        </v-col>
        <v-col cols="12" md="11">
          <uploader ref="voiceUpload"></uploader>
          <v-btn
            :disabled="stockQuantity == 0"
            :loading="loading"
            @click="submit"
            block
            class="primary px-8 mb-2"
          >
            {{
              stockQuantity == 0
                ? "در حال حاضر این نوع کارت صدا موجود نیست"
                : "تایید و ارسال صدا و عکس"
            }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <desc-dialog :item="type" v-model="descDialog"></desc-dialog>
    <check-user></check-user>
    <!-- <v-dialog v-model="dialog">
            <v-card class="full-width text-center">
                <v-card-title class="pb-0">
                    تصویری که برای شما چاپ خواهد شد
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false">
                        <v-icon>
                            mdi-close
                        </v-icon>
                    </v-btn>
                </v-card-title>
                <v-card-text id="preview">
                </v-card-text>
            </v-card>
        </v-dialog> -->
  </v-container>
</template>

<script>
import PhotoUpload from "@/components/Upload";
import VoiceUpload from "@/components/SmallerUpload";
import SocialHead from "@/components/SocialHead.vue";
// import VSwatches from 'vue-swatches'
import Uploader from "@/components/Uploader";
import DescDialog from "@/components/products/Info";
// Import the styles too, globally
import "vue-swatches/dist/vue-swatches.css";
import CheckUser from "@/components/CheckUser.vue";
if (process.client) {
  var WaveSurfer = require("@/utils/wave.js");
  // var  domToImage = require('dom-to-image');
}
export default {
  components: {
    PhotoUpload,
    VoiceUpload,
    // VSwatches,
    Uploader,
    DescDialog,
    SocialHead,
    CheckUser
  },
  async asyncData({ $axios, params }) {
    let { result } = await $axios.$get("/api/products/" + params.id);
    const voiceCard = result.product;
    const type = result.type || voiceCard.types[0];
    return {
      voiceCard,
      type
    };
  },
  data() {
    return {
      voice: [],
      image: [],
      qr: 1,
      seek: 0,
      playing: false,
      wavesurfer: null,
      progress: null,
      duration: 1,
      loaded: false,
      dialog: false,
      waveColor: "#000000",
      height: 1000,
      notEmpty: [v => !!v || ""],
      loading: false,
      descDialog: false,
      imageRules: [
        v => !!v || "",
        v =>
          [
            "image/png",
            "image/x-png",
            "image/gif",
            "image/jpeg",
            "image/webp",
            "image/wmf",
            "image/aces",
            "image/avci",
            "image/avcs",
            "image/avif",
            "image/bmp",
            "image/cgm",
            "image/emf"
          ].indexOf((v || "").type) !== -1 || "فرمت وارد شده صحیح نیست"
      ]
      // progressColor: 'white'
    };
  },
  watch: {
    voice(newValue, oldValue) {
      if (newValue[0] && newValue[0].file) {
        this.loaded = false;
        this.seek = 0;
        this.wavesurfer.load(newValue[0].url || newValue[0].path);
      } else {
        this.loading = false;
        this.stop();
      }
    },
    waveColor(nv) {
      this.wavesurfer.setWaveColor(nv);
    }
    // progressColor(nv) {
    //     this.wavesurfer.setProgressColor(nv)
    // }
  },
  mounted() {
    this.setupWave();
  },
  computed: {
    breakpoints() {
      return this.$vuetify.breakpoint.lgOnly
        ? 4
        : this.$vuetify.breakpoint.mdOnly
        ? 3
        : this.$vuetify.breakpoint.smOnly
        ? 2
        : this.$vuetify.breakpoint.xsOnly
        ? 1
        : "";
    },
    notCustom() {
      return this.type.photos && this.type.photos[0];
    },
    stockQuantity() {
      return Math.min(this.voiceCard.stockQuantity, this.type.stockQuantity);
    }
  },
  methods: {
    setupWave() {
      this.wavesurfer = WaveSurfer.create({
        container: "#waveform",
        scrollParent: true,
        waveColor: "#000000",
        barHeight: 1,
        minPxPerSec: 1,
        normalize: true,
        // interact: false,
        responsive: true,
        height: 128,
        progressColor: "white"
      });
      this.wavesurfer.on("ready", () => {
        this.loaded = true;
        this.duration = this.wavesurfer.getDuration();
      });
      this.wavesurfer.on("finish", () => {
        this.stop();
      });
    },
    play() {
      this.wavesurfer.play();
      this.playing = true;
      this.progress = setInterval(() => {
        this.seek =
          (this.wavesurfer.getCurrentTime() / this.duration).toFixed(3) * 100;
      }, 100);
    },
    pause() {
      clearInterval(this.progress);
      this.wavesurfer.pause();
      this.playing = false;
    },
    stop() {
      clearInterval(this.progress);
      this.wavesurfer.stop();
      this.playing = false;
      this.seek = 0;
    },
    setHeight() {
      this.height = document
        .querySelector("#my-node .v-image__image.v-image__image--cover")
        .clientHeight.toFixed(0);
      this.wavesurfer.setHeight(this.height / 10);
      setTimeout(() => {
        this.height = document
          .querySelector("#my-node .v-image__image.v-image__image--cover")
          .clientHeight.toFixed(0);
        this.wavesurfer.setHeight(this.height / 10);
      }, 1000);
    },
    // domToImage() {
    //     let node = document.getElementById('my-node');
    //     domToImage.toPng(node)
    //     .then((dataUrl) => {
    //         var img = new Image();
    //         img.src = dataUrl;
    //         this.dialog = true
    //         this.$nextTick(()=> {
    //             let imgs = document.querySelectorAll('#preview img')
    //             imgs.length > 0 && document.querySelector('#preview').removeChild(imgs[0])
    //             document.querySelector('#preview').appendChild(img)
    //         })
    //     })
    //     .catch(function (error) {
    //         console.error('oops, something went wrong!', error);
    //     });
    //     // domToImage.toJpeg(document.getElementById('my-node'))
    //     // .then(function (dataUrl) {
    //     //     var link = document.createElement('a');
    //     //     link.download = 'my-image-name.jpeg';
    //     //     link.href = dataUrl;
    //     //     console.log(link);
    //     //     link.click();
    //     // });
    //     // domToImage.toBlob(document.getElementById('my-node'))
    //     // .then(function (blob) {
    //     //     window.saveAs(blob, 'my-node.png');
    //     // });
    // },
    async submit() {
      this.$try(async () => {
        if (this.$refs.form.validate()) {
          this.loading = true;
          let photoRes;
          let voiceRes;
          let data = {
            type: this.type._id
          };
          if (!this.notCustom) {
            photoRes = this.$refs.imageUpload.upload(this.image[0].newFile);
            voiceRes = this.$refs.voiceUpload.upload(this.voice[0].file);
            const [photoResult, voiceResult] = await Promise.all([
              photoRes,
              voiceRes
            ]);
            if (photoResult)
              (data.photo = photoResult.info.url),
                (data.thumbnail = photoResult.info.thumbnail);
            else throw { message: "ارسال قطع شد." };
            if (voiceResult) data.audio = voiceResult.info.url;
            else throw { message: "ارسال قطع شد." };
          } else {
            data.photo = this.type.photos[0];
            const voiceResult = await this.$refs.voiceUpload.upload(
              this.voice[0].file
            );
            if (voiceResult) data.audio = voiceResult.info.url;
            else throw { message: "ارسال قطع شد." };
          }
          data.waveColor = this.waveColor;
          data.qrNumber = this.qr;
          let result = await this.$axios.$post("/api/voice-card", data);
          this.loading = false;
          this.$toast.success(result.message);
          let product = { ...this.type };
          product.product = { ...this.voiceCard };
          product.files = [data.audio];
          product.voiceCard = result.voiceCard._id;
          product.photos = [data.photo, data.thumbnail];
          this.$store.dispatch("addProductToCart", {
            product,
            quantity: 1
          });
          this.$nuxt.$router.push("/cart");
        }
      }, this);
    }
  }
};
</script>

<style>
#waveform.hide-wave wave > wave {
  display: none !important;
}
.v-application .qr-code {
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
