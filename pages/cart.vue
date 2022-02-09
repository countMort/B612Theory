<template>
  <client-only>
    <v-row class="my-0">
      <side-bar></side-bar>
      <v-col lg="10" md="9" cols="12">
        <v-card outlined>
          <v-card-title class="px-2 px-sm-4">
            <div :class="$vuetify.breakpoint.xsOnly && 'subtitle-2'">
              سبد خرید شما
            </div>
            <v-spacer></v-spacer>
            <v-chip
              outlined
              class="pl-0"
              v-if="getCart.length > 0"
              :small="$vuetify.breakpoint.xsOnly"
            >
              قیمت نهایی:&nbsp;
              <v-chip :small="$vuetify.breakpoint.xsOnly" color="primary">
                {{ getCartTotalPrice | number }} تومان
              </v-chip>
            </v-chip>
          </v-card-title>
          <v-card-text class="px-2 px-sm-4">
            <v-list class="px-0" v-if="getCart.length > 0">
              <v-list-item
                class="px-0"
                v-for="product in getCart"
                :key="product.id"
              >
                <v-list-item-avatar tile size="80">
                  <video
                    autoplay
                    muted
                    loop
                    style="max-width: 100%; max-height: 100%"
                    v-if="product.diaryBook"
                    :src="product.files[0]"
                  ></video>
                  <voice-card-avatar
                    v-else-if="product.voiceCard"
                    :product="product"
                  />
                  <v-img v-else :src="product.thumbnails ? product.thumbnails[0] : product.photos[0]"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <nuxt-link
                      :to="`/products/${
                        product.product && product.product._id
                      }`"
                      class="font-weight-bold links"
                    >
                      {{ product.product && product.product.name }}
                    </nuxt-link>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <nuxt-link
                      :to="`/products/${product._id}`"
                      class="font-weight-bold links"
                    >
                      {{ product.name }}
                    </nuxt-link>
                    <v-row class="mx-0 justify-space-around my-0">
                      <div class="mt-1">
                        تعداد سفارش:&nbsp;{{ product.quantity }}
                      </div>
                      <div class="mt-1">
                        قیمت واحد:&nbsp;{{ product.price | number }} تومان
                      </div>
                      <v-chip label small class="my-1">
                        قیمت کل:&nbsp;{{ product.totalPrice | number }} تومان
                      </v-chip>
                      <v-btn
                        small
                        :x-small="$vuetify.breakpoint.xsOnly"
                        outlined
                        @click="deleteProduct(product)"
                        color="red accent-4"
                      >
                        <v-icon>mdi-trash-can-outline</v-icon>
                        &nbsp;حذف از سبد
                      </v-btn>
                    </v-row>
                  </v-list-item-subtitle>
                  <v-list-item-action v-if="product.averageRating">
                    <v-row class="mx-0 justify-space-around my-0">
                      <v-rating
                        small
                        :value="Number(product.averageRating)"
                        color="amber"
                        half-increments
                        dense
                        size="15"
                        readonly
                      ></v-rating>
                    </v-row>
                  </v-list-item-action>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <template v-else> سبد خرید شما خالی‌ست </template>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              block
              class="white--text"
              :disabled="!getCart.length"
              nuxt
              to="/placeorder"
              color="primary"
            >
              <v-icon>mdi-truck-delivery-outline</v-icon>
              &nbsp;تایید سبد و ادامه فرایند خرید
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";
// import overlay from "~/components/overlay"
import SideBar from "~/components/SideBar";
import VoiceCardAvatar from "@/components/voice-card/VoiceCardAvatar";
export default {
  components: {
    // overlay,
    SideBar,
    VoiceCardAvatar,
  },
  computed: {
    ...mapGetters(["getCart", "getCartTotalPrice"]),
  },
  methods: {
    async deleteProduct(product) {
      try {
        if (product.voiceCard)
          await this.$axios.$delete(`/api/voice-card/${product.voiceCard}`);
        else if (product.diaryBook)
          await this.$axios.$delete(`/api/diary-book/${product.diaryBook}`);
        else if (product.polaroid)
          await this.$axios.$delete(`/api/polaroid/${product.polaroid}`);
        this.$store.commit("REMOVE_PRODUCT", product);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.links {
  text-decoration: none;
}
</style>