<template>
    <v-container style="height: 100%;" class="align-center d-flex">
        <product-list
        :items="products"
        :large="$vuetify.breakpoint.mdAndUp && products.length < 8"
        ></product-list>
    </v-container>
</template>

<script>
import ProductList from "@/components/products/ProductsList.vue"
    export default {
        components: {
            ProductList,
        },
        async asyncData({$axios, params, redirect}) {
            try {
                const {result} = await $axios.$get(`/api/categories/${params.id}`)
                if (result.products.length == 1) redirect(`/products/${result.products[0]._id}`)
                return {
                    products: result.products
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>