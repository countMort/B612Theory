<template>
  <v-container fluid align="center">
    <SocialHead
      :title="`B612 Theory | خرید ${product.name}`"
      :description="product.description"
      :image="product.photos && product.photos[0]"
    />
    <v-row class="mt-0">
      <v-col cols="12" class="py-0">
        <v-breadcrumbs class="mx-0 px-0" :items="breadcrumbs" />
      </v-col>
      <v-col cols="12" sm="4" lg="3" class="mx-0 px-0 pb-0 d-flex align-center">
        <v-card
          :style="!type.photos[0] && 'height: 100%'"
          tile
          width="100%"
          outlined
          contain
          align="center"
          flat
        >
          <v-img
            height="100%"
            :src="type.photos[0] || product.photos[0]"
            :lazy-src="type.thumbnails[0] || product.thumbnails[0]"
          />
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" lg="9" class="mx-0 pt-0 px-0">
        <v-card style="height: 100%" flat tile>
          <v-card-title class="justify-center">
            {{ product.name }}
            <!-- <v-spacer></v-spacer>
              <v-rating
                  :value="Number(product.averageRating)"
                  color="amber"
                  half-increments
                  dense
                  size="14"
                  readonly
              >
              </v-rating>
              <div class="grey--text caption d-flex align-center">
                  {{product.averageRating | number}} ({{product.reviews.length | number}})
              </div> -->
          </v-card-title>
          <v-card-text class="px-0 pb-0">
            <v-select
              v-model="type"
              class="px-2"
              dense
              hide-details
              outlined
              :items="product.types"
              item-text="name"
              return-object
            />
            <v-list two-line>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    class="subtitle-2 d-flex justify-space-between align-center"
                  >
                    <div>
                      دسته بندی:
                      {{ product.category.name }}
                      <v-spacer class="my-3" />
                      قیمت:
                      {{ type.price | number }}&nbsp;&nbsp;تومان
                    </div>
                    <v-btn
                      v-if="type.custom"
                      class="primary"
                      :disabled="stockQuantity == 0"
                      @click="navigate(product, type)"
                    >
                      {{ stockQuantity == 0 ? "ناموجود" : "سفارش دهید" }}
                    </v-btn>
                  </v-list-item-title>
                  <v-list-item-subtitle class="mt-2">
                    موجودی در انبار:
                    {{ stockQuantity }}
                  </v-list-item-subtitle>
                  <v-row v-if="!type.custom" class="mx-0 my-0">
                    <v-form ref="form" class="d-flex justify-space-around">
                      <v-text-field
                        v-model="quantity"
                        :rules="rule"
                        outlined
                        style="max-width: 200px"
                        class="d-none"
                        hide-details
                        prepend-icon="mdi-light-switch"
                        label="تعداد سفارش"
                        type="number"
                        :disabled="stockQuantity == 0"
                      />
                    </v-form>
                    <div class="mx-auto text-center">
                      تعداد سفارشتان را انتخاب کنید
                      <br>
                      <QuantitySnippet
                        :color="snippetColor"
                        :quantity="Number(quantity)"
                        :stock-quantity="stockQuantity"
                        @increase="increaseQuantity"
                        @decrease="decreaseQuantity"
                      />
                    </div>
                    <div class="text-center mx-auto">
                      <v-chip label :color="snippetColor">
                        قیمت کل: &nbsp;
                        {{ (quantity * type.price) | number }}
                        &nbsp; تومان
                      </v-chip>
                      <br>
                      <v-btn
                        color="primary"
                        class="my-2"
                        :disabled="stockQuantity == 0"
                        @click="addProductToCart(type, quantity)"
                      >
                        <template v-if="stockQuantity != 0">
                          افزودن به سبد &nbsp;&nbsp;
                          <v-icon>mdi-cart-outline</v-icon>
                        </template>
                        <template v-else>
                          ناموجود
                        </template>
                      </v-btn>
                    </div>
                  </v-row>
                  <v-list-item-subtitle
                    v-if="type.description"
                    style="white-space: pre-line"
                  >
                    {{ type.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar
                  v-if="product.aboveMiddle"
                  class="mt-12"
                  icon
                  size="100"
                >
                  <v-tooltip top>
                    <template #activator="{ on, attrs }">
                      <v-progress-circular
                        size="80"
                        color="teal"
                        width="13"
                        :value="product.aboveMiddle"
                        rotate="180"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ product.aboveMiddle }}%
                      </v-progress-circular>
                    </template>
                    <span class="white--text">
                      به این محصول بالای {{ 3.5 | number }} از
                      {{ 5 | number }} داده اند
                    </span>
                  </v-tooltip>
                </v-list-item-avatar>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions
            v-if="
              $auth.user && ['admin', 'super_admin'].includes($auth.user.role)
            "
            class="d-flex justify-center pt-0"
          >
            <v-btn
              nuxt
              :to="'/admin/products/' + product._id"
              color="warning"
              class="white--text"
            >
              به روز رسانی
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <!-- <v-col cols=12 class="px-0">
                <section id="reviews">
                    <review-section :productID=product._id :reviews=reviews />
                </section>
            </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
// import reviewSection from '~/components/review-section'
import SocialHead from '@/components/SocialHead.vue'
import QuantitySnippet from '@/components/products/QuantitySnippet.vue'
export default {
  components: {
    // reviewSection,
    SocialHead,
    QuantitySnippet
  },
  async asyncData ({ $axios, params, store }) {
    try {
      const { result } = await $axios.$get(`/api/products/${params.id}`)
      const product = result.product
      const type = product.types[0]
      let quantity = 0
      if (product.stockQuantity > 0 && type.stockQuantity > 0) {
        quantity = 1
      }
      store.commit('cartWatchedPush', product)
      return {
        product,
        type,
        quantity
      }
    } catch (error) {
      // console.log(error)
    }
  },
  data () {
    return {
      loading: false,
      selection: 1,
      rule: [
        v => !!v || '',
        v => v > 0 || '',
        v => v <= this.stockQuantity || ''
      ],
      reviews: [],
      snippetColor: ''
    }
  },
  computed: {
    scrollOptions () {
      return {
        easing: 'linear',
        duration: 1000,
        offset: 1
      }
    },
    stockQuantity () {
      return Math.min(this.product.stockQuantity, this.type.stockQuantity)
    },
    breadcrumbs () {
      return [
        {
          text: 'صفحه اصلی',
          to: '/',
          nuxt: true
        },
        {
          text: this.product.category.name,
          to: '/categories/' + this.product.category._id,
          nuxt: true
        },
        {
          text: this.product.name
        }
      ]
    }
  },
  watch: {
    type (newValue) {
      this.quantity = 0
      if (this.product.stockQuantity > 0 && this.type.stockQuantity > 0) {
        this.quantity = 1
      }
    }
  },
  mounted () {
    this.READ()
  },
  methods: {
    READ () {
      const reviews = this.$axios.$get(`api/reviews/${this.product.id}`)
      this.reviews = reviews.reviews
    },
    addProductToCart (type, quantity) {
      if (this.$refs.form.validate()) {
        type = { ...type }
        type.product = this.product
        this.$store.dispatch('addProductToCart', {
          product: type,
          quantity
        })
        this.$nuxt.$router.push('/cart')
      }
    },
    async deleteProduct () {
      try {
        const result = await this.$axios.$delete(
          `/api/products/${this.$route.params.id}`
        )
        if (result.success) {
          this.$nuxt.$router.push('/')
        }
      } catch (error) {
        // console.log(error)
      }
    },
    navigate (product, type) {
      const value = product.category.value
      const route =
        '/products/' + value[0].toUpperCase() + value.slice(1) + '/' + type._id
      this.$nuxt.$router.push(route)
    },
    increaseQuantity () {
      if (this.quantity >= this.stockQuantity) {
        return
      }
      this.quantity++
      if (this.quantity == this.stockQuantity) {
        this.snippetColor = 'primary'
      } else {
        this.snippetColor = ''
      }
    },
    decreaseQuantity () {
      if (this.quantity <= 0) {
        return
      }
      this.quantity--
      if (this.quantity == 0) {
        this.snippetColor = 'error'
      } else {
        this.snippetColor = ''
      }
    }
  }
}
</script>
