<template>
  <hooper
    rtl
    autoPlay
    infiniteScroll
    style="height: 100%;"
    :settings="settings"
  >
    <slide v-for="item in items" :key="item._id">
      <v-card
        nuxt
        :to="`/${type == 'category' ? 'categories' : 'products'}/${item._id}`"
        hover
        tile
        class=" mx-1"
        height="320"
        outlined
      >
        <v-chip
          label
          large
          v-if="soldOut(item)"
          class="sold-out px-sm-8 font-weight-bold headline"
          color="error"
          outlined
        >
          ناموجود
        </v-chip>
        <v-img
          height="200"
          :src="item.photo || item.photos[0]"
          :lazy-src="item.thumbnails && item.thumbnails[0]"
          :alt="item.name"
        >
        </v-img>
        <v-card-title style="word-break: keep-all" class="py-1 subtitle-2 px-1">
          {{ item.name }}
        </v-card-title>
        <v-card-text
          :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''"
          class="px-1 py-0"
          v-show="item.description"
        >
          <div
            style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
          >
            {{ item.description }}
          </div>
        </v-card-text>
        <div style="position: absolute; bottom: 0; left: 0;" class="pb-2 pl-2">
          {{ item.price | number }} تومان
        </div>
      </v-card>
    </slide>
    <hooper-navigation
      v-show="!$vuetify.breakpoint.xsOnly"
      slot="hooper-addons"
    ></hooper-navigation>
  </hooper>
</template>

<script>
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import "hooper/dist/hooper.css";
export default {
  components: {
    Hooper,
    Slide,
    HooperNavigation
  },
  props: {
    items: {
      type: Array
    },
    type: {
      type: String,
      default: "product"
    }
  },
  data() {
    return {
      settings: {
        itemsToShow: 2,
        centerMode: true,
        playSpeed: 3000,
        mouseDrag: false,
        wheelControl: false,
        breakpoints: {
          600: {
            itemsToShow: 2
          },
          800: {
            itemsToShow: 3
          },
          1000: {
            itemsToShow: 5
          }
        }
      }
    };
  },
  methods: {
    soldOut(product) {
      return product.stockQuantity == 0;
    }
  }
};
</script>

<style lang="scss" scoped></style>
