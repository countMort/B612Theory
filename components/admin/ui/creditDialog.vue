<template>
    <v-dialog v-model="dialog" max-width="600" scrollable>
        <v-card>
            <v-card-title>
                {{item ? `ویرایش ${type} ${item.name}` : `ایجاد ${type}`}}
                <v-icon class="mr-auto" @click="dialog = false">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="px-1 py-1">
                <b-text-field
                :label="`نام ${type}`"
                v-model="item_.name"
                class="mb-1"
                ></b-text-field>
                <v-textarea
                :label="`متن ${type}`"
                v-model="item_.description"
                hide-details
                class="mb-1"
                rows="2"
                outlined
                ></v-textarea>
                <b-text-field
                type="number"
                label="ترتیب"
                v-model="item_.sort"
                class="mb-1"
                ></b-text-field>
                <v-btn @click="addSlide" small class="primary float-left">
                    <v-icon>mdi-plus</v-icon>
                    افزودن تصویر
                </v-btn>
                <br>
                <v-list class="mt-2">
                    <v-list-item class="mt-1" v-for="(photo,i) in item_.photos" :key="i">
                        <v-row>
                            <v-col cols="1" class="d-flex align-center">
                                <v-icon color="red" @click="deleteSlide">
                                    mdi-close
                                </v-icon>
                            </v-col>
                            <v-col cols="10" sm="6">
                                <client-only>
                                    <upload
                                    style="max-width: 300px"
                                    v-model="file[i]"   
                                    :num=i
                                    @on-delete="photo.photo = ''"
                                    :filePath="photo.photo"
                                    mini
                                    />
                                    <b-uploader ref="uploader"></b-uploader>
                                </client-only>
                            </v-col>
                            <v-col cols="12" sm="5">
                                <v-textarea
                                dir="ltr"
                                label="لینک"
                                v-model="photo.link"
                                outlined
                                rows="2"
                                hide-details
                                class="mb-1"
                                ></v-textarea>
                                <b-text-field
                                label="alt"
                                v-model="photo.alt"
                                class="mb-1"
                                ></b-text-field>
                                <b-text-field
                                label="ترتیب"
                                type="number"
                                v-model="photo.sort"
                                ></b-text-field>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions class="px-1">
                <v-btn small @click="submit" class="primary mb-4" block>
                    ثبت
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Upload from "@/components/Upload.vue"
import BTextField from '~/components/BTextField.vue'
    export default {
        components: {
            Upload,
                BTextField,
        },
        props: {
            value: {
                type: Boolean,
                default: false
            },
            item: [Object,null],
            type: String
        },
        data() {
            return {
                item_: {},
                file: []
            }
        },
        watch: {
            item(newValue) {
                if(newValue) this.item_ = newValue
                else this.item_ = {}
                this.file = []
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
            addSlide() {
                this.item_.photos ? this.item_.photos.push({}) : this.item_ = {...this.item_, photos: [{}]}
            },
            deleteSlide(index) {
                this.file.splice(index, 1)
                this.item_.photos.splice(index, 1)
            },
            async submit() {
                let data = {...this.item_}
                for (let index = 0; index < this.file.length; index++) {
                    if(this.file[index][0] && this.file[index][0].file) {
                        const {info: {url}} = await this.$refs.uploader[index].upload(this.file[index][0].file , 'admin')
                        data.photos[index].photo = url
                    }
                }
                let result;
                if (this.item) {
                    result = await this.$axios.$put(`/api/${this.type == 'اسلایدر' ? 'sliders' : 'banners'}/${this.item._id}`, data)
                } else {
                    result = await this.$axios.$post(`/api/${this.type == 'اسلایدر' ? 'sliders' : 'banners'}`, data)
                }
                this.$toast.success(result.message)
                this.dialog = false
                this.file = []
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>