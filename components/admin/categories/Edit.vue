<template>
    <v-dialog max-width="500" v-model="dialog">
        <v-card>
            <v-card-title :class="$vuetify.breakpoint.xsOnly && 'caption'">
                ویرایش دسته‌بندی
                &nbsp;
                <span class="primary--text">
                    {{item.name}}
                </span>
                <v-spacer></v-spacer>
                <v-icon @click="dialog = false">
                    mdi-close
                </v-icon>
            </v-card-title>
            <v-card-text class="text-center pb-0">
                <v-form ref="form">
                    <v-row class="align-center my-0">
                        <v-col md="6" cols="12">
                            <b-text-field
                            label="نوع"
                            :rules="notEmpty"
                            v-model="data.name"
                            @keydown.enter.prevent="CREATE"
                            ></b-text-field>
                        </v-col>
                        <v-col md="6" cols="12">
                            <b-text-field
                            dir="ltr"
                            label="نام متغیر در سرور"
                            :rules="notEmpty"
                            v-model="data.value"
                            @keydown.enter.prevent="CREATE"
                            ></b-text-field>
                        </v-col>
                        <v-col cols="12">
                            <client-only>
                                <upload
                                v-model="file"
                                :num=2
                                @on-delete="data.photos = []"
                                :filePath="data.photos[0]"
                                />
                            </client-only>
                            <b-uploader ref="uploader"></b-uploader>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn :loading="loading" class="primary px-8" @click="UPDATE">
                    ویرایش
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import Upload from "@/components/Upload"
    export default {
        components: {
            Upload,
        },
        props: {
            value: {
                type: Boolean,
            },
            item: {
                type: Object
            },
        },
        data() {
            return {
                data: {
                    name: "",
                    photos: [],
                    value: ''
                },
                file: [],
                loading: false,
                notEmpty: [
                    v => !!v || ""
                ],
            }
        },
        watch: {
            dialog(newValue) {
                if(newValue && !this.loading) {
                    this.file = []
                    this.data = {...this.item}
                }
            }
        },
        computed: {
            dialog: {
                get() {
                    return this.value 
                },
                set(val) {
                    this.$emit('input' , val)
                }
            }
        },
        methods: {
            async UPDATE() {
                try {
                    if(this.$refs.form.validate()) {
                    this.loading = true
                    let data = {...this.data} ;
                    if(this.file[0]) {
                        const response = await this.$refs.uploader.upload(this.file[0].file , 'admin')
                        data.photos[0] = response.info.url
                    }
                    this.loading = false
                    this.$emit('update' , data)
                }
                } catch (error) {
                    console.log(error);
                    this.loading = false
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>