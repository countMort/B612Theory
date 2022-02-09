<template>
    <v-container fluid class="mt-2 mb-10">
        <v-card max-width="700" class="mx-auto">
            <v-card-title
            class="title justify-center"
            >
                ویرایش محصول
                &nbsp;
                <span class="primary--text">
                    {{data.name}}
                </span>
            </v-card-title>
            <v-card-text class="mt-5">
                    <v-form ref="form">
                        <v-row class="my-0" justify="center" align="center">
                            <v-col lg="6" cols="12">
                                <v-select
                                dense
                                outlined
                                label="دسته‌بندی"
                                v-model="data.categoryID"
                                item-text="name"
                                item-value="_id"
                                hide-details
                                :rules="notEmpty"
                                :items="categories">
                                </v-select>
                            </v-col>
                            <v-col lg="6" cols="12">
                                <v-text-field
                                dense
                                outlined
                                hide-details
                                :rules="notEmpty"
                                label="نام محصول"
                                v-model="data.name"
                            ></v-text-field>
                            </v-col>
                            <v-col lg="6" cols="12">
                                <v-text-field
                                dense
                                outlined
                                hide-details
                                label="قیمت"
                                type="number"
                                v-model="data.price"
                            ></v-text-field>
                            </v-col>
                            <v-col lg="6" cols="12">
                                <v-text-field
                                dense
                                outlined
                                label="تعداد موجود"
                                type="number"
                                v-model="data.stockQuantity"
                                hide-details
                                ></v-text-field>
                            </v-col>
                            <v-col lg=6 cols=12>
                                <v-textarea
                                :rows="4"
                                auto-grow
                                dense
                                outlined
                                label="توضیحات"
                                v-model="data.description"
                                ></v-textarea>
                            </v-col>
                            <v-col lg="6" cols="12">
                                <client-only>
                                    <upload
                                    :filePath="data.photos[0]"
                                    v-model="file"
                                    :num=1
                                    @on-delete="data.photos = []"
                                    label="عکس محصول" />
                                    <b-uploader ref="uploader"></b-uploader>
                                </client-only>
                            </v-col>
                        </v-row>
                        <v-row class="my-0 mx-0 align-center">
                            <template v-if="data.types.length">
                                <v-tooltip top v-for="(type, index) in data.types" :key="index">
                                    <template v-slot:activator="{on, attrs}">
                                        <v-avatar
                                        class="ml-1 mb-1"
                                        :style="
                                        !type.photos[0] ?
                                        'border: 1px solid black;':
                                        ''"
                                        tile
                                        @click="
                                            isEdit = true
                                            selected = {...type, index}
                                            typeDialog = true
                                        "
                                        v-bind="attrs"
                                        v-on="on"
                                        >
                                            <v-img :src="type.photos[0]"></v-img>
                                        </v-avatar>
                                    </template>
                                    {{type.name}}
                                </v-tooltip>
                                <v-spacer></v-spacer>
                                <v-tooltip top>
                                    <template v-slot:activator="{on, attrs}">
                                        <v-btn
                                        @click="
                                        isEdit = false
                                        typeDialog = true
                                        "
                                        v-on="on"
                                        v-bind="attrs"
                                        icon
                                        outlined
                                        color="primary">
                                            <v-icon>mdi-plus</v-icon>
                                        </v-btn>
                                    </template>
                                    افزودن نوع
                                </v-tooltip>
                            </template>
                            <v-btn
                            class="primary"
                            @click="
                            isEdit = false
                            typeDialog = true
                            "
                            v-else
                            block>
                                افزودن نوع
                            </v-btn>
                        </v-row>
                        <v-row class="my-0">
                            <v-col cols="6" class="text-center">
                                <v-btn class="primary" :loading="loading" @click="UPDATE(data.id)">
                                    ویرایش
                                </v-btn>
                            </v-col>
                            <v-col cols="6" class="text-center">
                                <v-btn @click="clear">
                                    پاک کردن
                                </v-btn>
                            </v-col>
                        </v-row>
                </v-form>
            </v-card-text>
        </v-card>
        <type-dialog
        @add-type="data.types.push($event)"
        @edit-type="data.types[$event.index] = $event"
        :isEdit="isEdit"
        :item="selected"
        v-model="typeDialog"
        ></type-dialog>
    </v-container>
</template>

<script>
import TypeDialog from "@/components/admin/products/Type"
import Upload from "@/components/Upload"
    export default {
        components: {
            TypeDialog,
            Upload,
        },            
        async asyncData({$axios}) {
            try {
                let {result} = await $axios.$get("/api/categories")
                // let owners = $axios.$get("/api/owners")
                // const [catResponse, ownerResponse] = await Promise.all([
                //     categories,
                //     owners
                // ])
                return {
                    categories: result
                    // categories : catResponse.categories,
                    // owners : ownerResponse.owners
                }
            } catch (error) {
                console.log(error);
            }
        },
        data() {
            return {
                ownerID: null,
                data: {
                    categoryID: null,
                    name: "",
                    price: 0,
                    description : "",
                    photos : [],
                    stockQuantity : 1,
                    types: [],
                    dimensions: ""
                },
                file: [],
                notEmpty: [
                    v => !!v || "نمی‌تواند خالی باشد"
                ],
                loading : false,
                typeDialog: false,
                isEdit: false,
                selected: {}
            }
        },
        mounted () {
            this.READ(this.$route.params.id);
        },
        methods : {
            async READ(id) {
                try {
                    this.loading = true
                    const {result} = await this.$axios.$get(`/api/products/${id}`)
                    this.data = result.product
                    this.data.categoryID = result.product.category._id
                    this.loading = false
                } catch (error) {
                    console.log(error);
                    this.loading = false
                }
            },
            async UPDATE(id) {
                try {
                    if(this.$refs.form.validate()) {
                        this.loading = true
                        let data = {...this.data};
                        for (let index = 0; index < data.types.length; index++) {
                            data.types[index].product = this.data.id
                        }
                        if(this.file[0]) {
                            let res = await this.$refs.uploader.upload(this.file[0].newFile, 'admin')
                            data.photos[0] = res.info.url
                        }
                        const result = await this.$axios.$put(`/api/products/${id}`, data)
                        this.$toast.success(result.message)
                        this.loading = false
                        this.$nuxt.$router.push('/admin/products')
                    }
                } catch (error) {
                    console.log(error);
                    this.loading = false
                }
            },
            clear() {
                this.file = []
                this.data.photos = []
                this.$refs.form.reset()
            }
        }
    }
</script>

<style scoped>
.select {
    width: 100%;
    border: black 1px solid;
    border-radius: 30%;
}
</style>