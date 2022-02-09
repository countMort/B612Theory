<template>
    <v-img :src="(product.photos && (product.photos[1] || product.photos[0])) || product.thumbnail || product.photo">
        <v-progress-circular
        v-show="product.files && product.files[0]"
        :size="size"
        color="grey darken-4"
        width="13"
        :value="seek || 0"
        rotate="180"
        >
            <audio
            :ref="id"
            @timeupdate="updateSeek"
            @ended="
                seek = 0
                playing = false
            "
            v-show="false"
            :src="product.files && product.files[0]"></audio>
            <v-btn
            color="white"
            :ripple="false"
            :x-small="!!seek"
            icon
            @click.stop.prevent="play()"
            v-if="!playing">
                <v-icon :small="!!seek">
                    mdi-play
                </v-icon>
            </v-btn>
            <v-btn
            color="white"
            :ripple="false"
            x-small
            icon
            @click.stop.prevent="pause"
            v-else>
                <v-icon small>
                    mdi-pause
                </v-icon>
            </v-btn>
            <v-btn
            color="white"
            :ripple="false"
            x-small
            icon
            @click.stop.prevent="stop"
            v-if="!!seek">
                <v-icon small>
                    mdi-stop
                </v-icon>
            </v-btn>
        </v-progress-circular>
    </v-img>
</template>

<script>
    export default {
        props: {
            product: {
                type: Object,
                default: () => {}
            },
            size: {
                type: Number,
                default: 80
            },
            uniqueId: {
                type: undefined,
            }
        },
        data() {
            return {
                seek: 0,
                playing: false,
                element: null
            }
        },
        mounted () {
            this.element = this.$refs[this.id];
        },
        computed: {
            id() {
                return this.uniqueId || this.product._id || 'sdsakd2qk'
            }
        },
        methods: {
            updateSeek() {
                this.seek = (this.element.currentTime/this.element.duration)*100
            },
            play() {
                this.playing = true
                this.element.play()
            },
            pause() {
                this.playing = false
                this.element.pause()
            },
            stop() {
                this.pause()
                this.element.currentTime = 0
            }
        },
    }
</script>