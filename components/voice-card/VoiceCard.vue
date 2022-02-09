<template>
    <v-card>
        <v-card-title>
            <v-btn @click="domToImage" block class="px-10">
                دانلود تصویر
            </v-btn>
        </v-card-title>
        <v-row class="justify-center my-0">
            <v-col cols="12" class="py-0 d-flex align-center">
                <!-- <v-progress-circular
                size="80"
                color="teal"
                width="13"
                :value="seek"
                rotate="180"
                >
                    <v-btn :ripple="false" :x-small="!!seek" icon @click="play" v-if="!playing">
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
                </v-progress-circular> -->
            </v-col>
            <v-col cols="12" class="py-0">
                <v-img
                id="my-node"
                :aspect-ratio="14.142/10"
                :src="voiceCard && voiceCard.photo">
                    <!-- <div :class="!playing && seek == 0 && 'hide-wave'" id="waveform"></div> -->
                    <!-- <v-row class="mx-0 align-center caption" style="position: absolute; top: 0; left: 0; height: 100%; width: 100%;">
                        <v-col cols="4" class="full-height" v-for="a in 6" :key="a">
                            <v-avatar
                            :style="{
                                opacity: qr != a ? '0.7' : '',
                                'font-size': !$vuetify.breakpoint.mdAndUp ? '9px' : ''
                            }
                            "
                            :size="height/8" tile>
                                <v-img v-if="qr == a" :src="require('@/static/b612-qrcode.png')"></v-img>
                            </v-avatar>
                        </v-col>
                    </v-row> -->
                </v-img>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
if(process.client) {
    var WaveSurfer = require("@/utils/wave.js")
    var  domToImage = require('dom-to-image');
}
export default {
    props: {
        voiceCard: {
            type: Object,
            default: () => {}
        },
        dialog: Boolean
    },
    data() {
        return {
            voice: [],
            qr: 1,
            seek: 0,
            playing: false,
            wavesurfer: null,
            progress: null,
            duration: 1,
            loaded: false,
            height: 1000,
            notEmpty: [
                v => !!v || ''
            ],
            loading: false,
            descDialog: false
            // progressColor: 'white'
        }
    },
    watch: {
        voiceCard(newValue, oldValue) {
            // if(newValue) {
            //     this.seek = 0
            //     this.loaded = false
            //     this.wavesurfer.load(newValue.audio);
            //     this.qr = newValue.qrNumber
            // } else {
            //     this.stop()
            // }
        },
    },
    mounted () {
        // this.setupWave()
        if (this.dialog) {
            this.seek = 0
            this.loaded = false
            this.wavesurfer.load(this.voiceCard.audio);
            this.qr = this.voiceCard.qrNumber
        }
    },
    computed: {
        breakpoints() {
            return this.$vuetify.breakpoint.lgOnly ? 4 :
                this.$vuetify.breakpoint.mdOnly ? 3 :
                this.$vuetify.breakpoint.smOnly ? 2 :
                this.$vuetify.breakpoint.xsOnly ? 1 : ''
        },
    },
    methods: {
        setupWave() {
            this.wavesurfer = WaveSurfer.create({
                container: '#waveform',
                scrollParent: true,
                waveColor: "#000000",
                barHeight: 1,
                minPxPerSec: 1,
                normalize: true,
                // interact: false,
                responsive: true,
                height: 128,
                progressColor: 'white',
                xhr : {
                    cache: "default",
                    mode: "no-cors",
                    method: "GET",
                    credentials: "include",
                    headers: [
                        { key: "cache-control", value: "no-cache" },
                        { key: "pragma", value: "no-cache" }
                    ]
                }
            });
            this.wavesurfer.on('ready', () => {
                this.loaded = true
                this.duration = this.wavesurfer.getDuration()
            })
            this.wavesurfer.on('finish', () => {
                this.stop()
            })
        },
        play() {
            this.wavesurfer.play()
            this.playing = true
            this.progress = setInterval(() => {
                this.seek = (this.wavesurfer.getCurrentTime()/this.duration).toFixed(3)*100
            }, 100);
        },
        pause() {
            clearInterval(this.progress)
            this.wavesurfer.pause()
            this.playing = false
        },
        stop() {
            clearInterval(this.progress)
            this.wavesurfer.stop()
            this.playing = false
            this.seek = 0
        },
        setHeight() {
            this.height = document.querySelector('#my-node .v-image__image.v-image__image--cover').clientHeight.toFixed(0)
            this.wavesurfer.setHeight(this.height/10);
            setTimeout(() => {
                this.height = document.querySelector('#my-node .v-image__image.v-image__image--cover').clientHeight.toFixed(0)
                this.wavesurfer.setHeight(this.height/10);
            }, 1000);
        },
        domToImage() {
            let node = document.getElementById('my-node');
            // domToImage.toPng(node)
            // .then((dataUrl) => {
            //     var img = new Image();
            //     img.src = dataUrl;
            //     this.dialog = true
            //     this.$nextTick(()=> {
            //         let imgs = document.querySelectorAll('#preview img')
            //         imgs.length > 0 && document.querySelector('#preview').removeChild(imgs[0])
            //         document.querySelector('#preview').appendChild(img)
            //     })
            // })
            // .catch(function (error) {
            //     console.error('oops, something went wrong!', error);
            // });
            domToImage.toJpeg(document.getElementById('my-node'))
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
            // domToImage.toBlob(document.getElementById('my-node'))
            // .then(function (blob) {
            //     window.saveAs(blob, 'my-node.png');
            // });
        },
    },
}
</script>

<style>
#waveform.hide-wave wave > wave {
    display: none !important;
}
</style>