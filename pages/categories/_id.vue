<template>
  <div class="full-height">
    <ProductList
      v-if="products?.length"
      :items="products"
      :large="$vuetify.breakpoint.mdAndUp && products.length < 8"
    />
    <NoProducts v-else :category="category" />
  </div>
</template>

<script>
import ProductList from '~/features/categories/components/ProductsList.vue'
import NoProducts from '~/features/categories/components/NoProducts.vue'

export default {
  components: {
    ProductList,
    NoProducts,
  },
  async asyncData({ $axios, params, redirect }) {
    try {
      const { result } = await $axios.$get(`/api/categories/${params.id}`)
      const availableItems = result.products.filter(
        (item) => item.stockQuantity
      )
      if (availableItems.length == 1) {
        redirect(`/products/${result.products[0]._id}`)
      }
      return {
        products: availableItems,
        category: result,
      }
    } catch (error) {
      console.log(error)
    }
  },
}
</script>

<style lang="scss" scoped></style>
