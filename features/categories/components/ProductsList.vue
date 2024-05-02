<template>
  <v-row>
    <v-col v-for="item in items" :key="item._id">
      <v-list-item nuxt :to="`/products/${item._id}`" three-line>
        <v-chip
          v-if="item.stockQuantity === 0"
          label
          large
          class="sold-out px-8 font-weight-bold headline"
          color="error"
          outlined
        >
          ناموجود
        </v-chip>
        <v-list-item-avatar tile :size="large ? 160 : 110">
          <v-img :src="item.thumbnails[0]" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="nowrap">
            {{ item.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="black--text nowrap">
            {{ item.price | number }} تومان
          </v-list-item-subtitle>
          <v-list-item-subtitle v-if="item.description">
            {{ item.description }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    large: Boolean,
  },
}
</script>

<style lang="scss" scoped>
</style>
