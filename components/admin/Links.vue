<template>
    <v-menu
        :close-on-content-click="false"
        fixed
        auto
        v-model="menu"
        min-width="300"
        max-width="500"
        over
        transition="scale-transition"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="primary"
            icon
            class="mt-1"
            v-bind="attrs"
            v-on="on"
            >
                <v-icon>
                    mdi-link-variant
                </v-icon>
            </v-btn>
        </template>
        <v-card class="justify-center text-center" :loader-height="2" :loading="loading">
            <v-row class="mx-0 my-0">
                <v-col cols="12">
                    <v-radio-group
                    row
                    class="mt-0 _text _input justify-center text-center"
                    dense
                    v-model="type"
                    hide-details
                    >
                        <v-radio value="products" label="دسته‌بندی محصولات"></v-radio>
                        <v-radio value="categories" label="محصولات"></v-radio>
                    </v-radio-group>
                </v-col>
                <v-col cols="12" class="my-auto pt-0">
                        <div>
                            <v-select
                            v-if="['first_page','cart_page'].indexOf(type) == -1"
                            @input="setType"
                            dense
                            hide-details
                            outlined
                            class="mb-2 _input _text"
                            :items="items"
                            >
                                <template v-slot:item={item}>
                                    <v-row v-if="type == 'page'" class="mx-0 subtitle-2">
                                        {{item.title}}
                                        <v-spacer></v-spacer>
                                        <div dir="ltr">
                                            /{{item.slug}}
                                        </div>
                                    </v-row>
                                    <div v-else>
                                        {{item.name}}
                                    </div>
                                </template>
                                <template v-slot:selection={item}>
                                    {{item.title || item.name}}
                                </template>
                            </v-select>
                            <v-text-field
                            readonly
                            dense
                            dir="ltr"
                            class="_input _text mb-2"
                            hide-details
                            outlined
                            v-model="url"
                            ></v-text-field>
                            <v-btn @click="submit" :loading="loading" class="primary" small rounded>
                                انتخاب
                            </v-btn>
                        </div>
                </v-col>
            </v-row>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                menu: false,
                type: "first_page",
                loaded: [],
                url: "",
                items: [],
                pages: [],
                article: [],
                reference: [],
            }
        },
        watch: {
            menu(nv) {
                if(nv && this.type == "first_page") this.getData("first_page") 
            } ,
            type(newValue) {
                this.getData(newValue)
            }
        },
        computed: {
            shop() {
                return this.$store.getters.shop
            },
            domain() {
                return this.shop.domain ?
                this.shop.domain.startsWith('http') ?
                this.shop.domain :
                `https://${this.shop.domain}` : this.shop.domains ?
                this.shop.domains[0].domain.startsWith('http') ?
                this.shop.domains[0].domain :
                `https://${this.shop.domains[0].domain}` :
                ''
            }
        },
        methods: {
            async getData(newValue) {
                try {
                    if (newValue) {
                        switch(newValue) {
                            case "first_page" :
                                return this.url = this.domain
                            case "cart_page" :
                                return this.url = this.domain + "/cart"
                            case "page" : {
                                if (this.pages.length == 0) {
                                    this.loading = true
                                    let {data} = await readPages({per_page: 1000 , store_id: this.$route.params.id})
                                    this.loading = false
                                    this.pages = data
                                }
                                return this.items = this.pages
                            }
                            default :
                            if (this[newValue].length == 0) {
                                this.getCategory(newValue)
                            }
                            return this.items = this[newValue]
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            async getCategory(type) {
                try {
                    this.loading = true
                    const store_id = this.$route.params.id
                    let requests = []
                    let categories = []
                    if (type == 'reference') {
                        let result = await getCategory({store_id , type})
                        const ids = result.map(cat => cat.id)
                        requests = ids.map(id => {
                            return getCategoryItem({store_id , group_category_id: id})
                        })
                        let responses = await Promise.all(requests)
                        responses.forEach(res => {
                            categories = categories.concat(res)
                        })
                    } else {
                        categories = await getCategoryItem({store_id , group_category_id: 0 , type})
                    }
                    this.items = this[type] = categories
                    this.loading = false
                } catch (error) {
                    this.loading = false
                    console.log(error);
                }
            } ,
            setType(item) {
                if (item) {
                    if (this.type == 'article') {
                        this.url = `${this.domain}/category/article/${item.id}`
                    } else if (this.type == 'reference') {
                        this.url = `${this.domain}/category/${item.id}`
                    } else {
                        this.url = `${this.domain}/page/${item.slug}`
                    }
                }
            },
            submit() {
                this.$emit('set-url' , this.url)
                this.menu = false
            }
        },
    }
</script>

<style>
.v-menu__content.theme--light.v-menu__content--auto.v-menu__content--fixed.menuable__content__active {
    max-height: 400px !important;
}
</style>