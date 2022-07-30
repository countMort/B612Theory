<template>
  <v-list>
    <v-row class="justify-center">
      <v-col
        v-for="item in availableItems"
        :key="item._id"
        cols="12"
        :sm="6"
        :md="large ? 6 : 4"
      >
        <!-- {{soldOut(item)}} -->
        <v-list-item nuxt :to="`/products/${item._id}`" three-line>
          <v-chip
            v-if="soldOut(item)"
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
            <v-list-item-title> {{ item.name }} </v-list-item-title>
            <v-list-item-subtitle class="black--text">
              {{ item.price | number }} تومان
            </v-list-item-subtitle>
            <v-list-item-subtitle
              v-if="item.description"
              style="
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              "
            >
              {{ item.description }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </v-list>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    large: Boolean
  },
  computed: {
    availableItems () {
      return this.items.filter(item => item.stockQuantity > 0)
    }
  },
  methods: {
    soldOut (product) {
      return product.stockQuantity == 0
    }
  }
}
</script>

<style lang="scss" scoped></style>
