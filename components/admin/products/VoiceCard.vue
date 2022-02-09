<template>
    <v-dialog v-model="dialog" max-width="700">
        <v-card :loading="loading" loader-height="2" v-if="item">
            <v-card-text class="text-center py-10">
                <v-btn class="my-1 elevation-5" block @click="openWindow(item.photo)">
                    دانلود تصویر
                </v-btn>
                <v-btn class="my-1 elevation-5" block @click="openWindow(item.audio)">
                    دانلود صدا
                </v-btn>
                <v-btn class="mt-1 elevation-5 mb-2" block @click="downloadQr">
                    دانلود QR
                </v-btn>
                محل QR: {{item.qrNumber | number}}
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
if (process.client) {
    var QRCode = require('qrcode')
}
export default {
    props: {
        value: Boolean,
        item: {
            type: Object
        }
    },
    data() {
        return {
            loading: false
        }
    },
    computed: {
        dialog: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        download(item) {
            this.loading = true
            fetch(item)
            .then(response => {
                this.loading = false
                return response.blob()
            })
            .then(blob => {
                let URL = window.URL
                const blobURL = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobURL;
                a.download = item;
                a.click();
            })
            .catch((err) => this.loading = false);
        },
        downloadQr() {
            QRCode.toDataURL(`https://b612theory.ir/remember-remember/${this.item._id}?password=000000`)
            .then(url => {
                const a = document.createElement("a");
                a.href = url;
                a.download = `qrCode-${this.item._id}`;
                a.click();
            })
            .catch(err => {
                console.error(err)
            })
        },
        openWindow(item) {
            window.open(item, {target: "_blank"})
        }
    },
}
</script>

<style lang="scss" scoped>

</style>