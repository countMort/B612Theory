<template>
    <v-dialog v-model="dialog" max-width="700">
        <v-card v-if="item">
            <v-card-text class="text-center py-10">
                <v-btn class="my-1 elevation-5" block @click="openWindow(item.photo)">
                    دانلود تصویر
                </v-btn>
                <label v-if="item.quote" for="quote" class="title">
                    متن
                </label>
                <pre id="quote" style="overflow-x: auto;overflow-y: hidden">{{item.quote}}</pre>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        value: Boolean,
        item: {
            type: Object
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
            fetch(item)
            .then(response => response.blob())
            .then(blob => {
                let URL = window.URL
                const blobURL = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobURL;
                a.download = item;
                a.click();
            })
            .catch((err) => console.log(err));
        },
        openWindow(item) {
            window.open(item, {target: "_blank"})
        }
    },
}
</script>

<style lang="scss" scoped>

</style>