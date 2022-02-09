<template>
    <v-dialog v-model="dialog" max-width="500">
        <v-card light>
            <v-card-title>
                {{!isEdit ? 'افزودن' : 'ویرایش'}}
                نوع
                <span v-if="isEdit" class="primary--text mr-2">
                    {{item.name}}
                </span>
            </v-card-title>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field
                    hide-details class="my-2"
                    label="نام محصول"
                    v-model="data.name"
                    dense
                    outlined
                    :rules="notEmpty"
                    ></v-text-field>
                    <client-only>
                        <upload
                        :filePath="data.photos[0]"
                        v-model="file"
                        :num="2"
                        @on-delete="data.photos = []"
                        label="عکس محصول" />
                        <b-uploader ref="upload"></b-uploader>
                    </client-only>
                    <v-row class="my-0">
                        <v-col cols="7">
                            <v-text-field
                            hide-details
                            class="my-2"
                            label="قیمت"
                            v-model="data.price"
                            type="number"
                            dense
                            outlined
                            ></v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-text-field
                            hide-details
                            class="my-2"
                            label="موجودی"
                            v-model="data.stockQuantity"
                            type="number"
                            dense
                            outlined></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-checkbox
                            hide-details
                            class="my-0"
                            label="سفارشی"
                            v-model="data.custom"
                            dense
                            ></v-checkbox>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                            hide-details
                            class="my-0"
                            label="ابعاد(در صورت نیاز)"
                            dense
                            outlined
                            dir="ltr"
                            v-model="data.dimensions">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-textarea
                    rows="2"
                    hide-details
                    class="my-2"
                    label="توضیحات"
                    v-model="data.description"
                    dense
                    outlined
                    ></v-textarea>
                    <v-row class="justify-center my-0">
                        <v-btn
                        @click="submit"
                        color="primary"
                        :loading="uploading"
                        >
                            آپلود تصویر و ثبت
                        </v-btn>
                    </v-row>
                </v-form>
            </v-card-text>
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
                default: false
            },
            isEdit: {
                type: Boolean ,
                default: false
            },
            item: Object,
            loading: Boolean
        },
        data() {
            return {
                data: {
                    custom: false,
                    name: "",
                    price: 0,
                    stockQuantity: 0,
                    photos: [],
                    description: ""
                },
                file: [],
                uploading: false,
                notEmpty: [
                    v => !!v || "نمی‌تواند خالی باشد"
                ] ,
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
        watch: {
            dialog(newValue) {
                if(newValue) {
                    this.file = []
                    if(this.isEdit) {
                        this.data = {...this.item}
                    } else {
                        this.$nextTick(()=>{
                            this.data.photos = []
                            this.$refs.form.reset()
                        })
                    }
                }
            },
        },
        methods: {
            async submit() {
                try {
                    if(this.$refs.form.validate()) {
                        this.uploading = true
                        let data = {...this.data}
                        if (this.file[0]) {
                            let res = await this.$refs.upload.upload(this.file[0].file , 'admin')
                            data.photos[0] = res.info.url
                        }
                        this.uploading = false
                        if(this.isEdit) {
                            this.$emit('edit-type' , data)
                        } else {
                            this.$emit('add-type' , data)
                        }
                        this.dialog = false
                    }
                } catch (error) {
                    console.log(error);
                    this.uploading = false
                }
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>