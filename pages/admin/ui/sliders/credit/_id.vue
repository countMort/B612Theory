<template>
    <v-container>
        <v-progress-linear
        indeterminate
        v-if="loading"
        height="2"
        ></v-progress-linear>
        <v-select
        label="نوع اسلایدر"
        v-model="data.type"
        :items="[{text: 'دسته‌بندی', value: 'categories'}, {text: 'محصول', value: 'products'}]"
        ></v-select>
        <v-text-field
        type="number"
        label="ترتیب"
        v-model="data.sort"
        ></v-text-field>
        <v-text-field
        type="text"
        v-model="data.name"
        label="نام اسلایدر"
        ></v-text-field>
        <v-textarea
        v-model="data.description"
        label="توضیحات اسلایدر"
        rows="2"
        ></v-textarea>
        <slider
        :items="items"
        admin
        />
        <v-data-table
        v-for="(panel, key) in panels"
        :key="key"
        dense
        v-model="items"
        :headers="headers"
        :items="panel"
        item-key="_id"
        show-select
        v-show="key == 'categories' ? data.type == 'categories' : data.type != 'categories'"
        >
            <template v-slot:top>
                {{key}}
            </template>
            <template v-slot:item.photos="{item}">
                <v-avatar>
                    <v-img :src="item.photos[0]">
                    </v-img>
                </v-avatar>
            </template>
        </v-data-table>
        <v-btn :loading="loading" class="primary" block @click="submit">{{isEdit ? 'ویرایش' : 'ایجاد'}} اسلایدر</v-btn>
    </v-container>
</template>

<script>
import Slider from "@/components/Slider.vue"
    export default {
        components: {
            Slider,
        },
        async asyncData({$axios}) {
            try {
                const catReq = $axios.$get("/api/categories")
                const prodReq = $axios.$get("/api/products")
                const [catRes, prodRes] = await Promise.all([catReq, prodReq])
                const products = prodRes.result
                const productsGroup = products.reduce(function(rv, x) {
                    (rv[x.category.value] = rv[x.category.value] || []).push(x);
                    return rv;
                }, {});
                return {
                    categories: catRes.result,
                    productsGroup
                }
            } catch (error) {
                console.log(error.message || error);
            }
        },
        data() {
            return {
                data: {},
                items: [],
                loading: false,
                headers: [
                    {
                        text: 'تصویر',
                        value: 'photos',
                        sortable: false,
                        align: 'center'
                    },
                    {
                        text: 'نام',
                        value: 'name',
                        align: 'center'
                    },
                    {
                        text: 'تعداد',
                        value: 'stockQuantity',
                        align: 'center'
                    },
                ]
            }
        },
        watch: {
            "data.type": {
                handler() {
                    !this.loading ? this.items = [] : ''
                }
            }
        },
        computed: {
            panels() {
                let panels = {
                    categories: this.categories,
                    ...this.productsGroup
                }
                return panels
            },
            isEdit() {
                return !!this.$route.params.id
            }
        },
        mounted () {
            this.$try(async ()=> {
                if (this.isEdit) {
                    const {result} = await this.$axios.$get(`/api/sliders/${this.$route.params.id}`)
                    this.data = result
                    this.items = result[result.type]
                };
            }, this)
        },
        methods: {
            submit() {
                this.$try(async ()=> {
                    let data = {...this.data}
                    data[this.data.type] = this.items.map(item => item._id)
                    const result = this.isEdit ? await this.$axios.$put('/api/sliders/' + this.$route.params.id, data)
                    : await this.$axios.$post('/api/sliders', data)
                    this.$toast.success(result.message)
                    this.$nuxt.$router.push('/admin/ui/sliders')
                },this)
            }
        },
    }
</script>