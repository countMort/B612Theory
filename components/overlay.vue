<template>
  <div>
    <!-- :max-width="maxWidth*0.8" -->
    <v-dialog :max-width="500" v-model="addDialog" @click:outside="onAddDialog">
      <v-card
        class="full-width"
        tile
        v-if="product"
      >
        <v-img
          max-height="30rem"
          src="https://i.pinimg.com/originals/73/5c/ab/735cabd7d4b6dd810dc33c3978edb756.jpg"
        >
          <v-card-title style="background-color: rgba(0,0,0,0.3);">
            {{product.name}}
            <v-spacer></v-spacer>
            <v-btn
              @click="onAddDialog"
              icon
              >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="px-0 py-0">
            <v-list color="rgba(0,0,0,0.4)">
              <v-list-item
                three-line
              >
                <v-list-item-content>
                  <v-list-item-title>نوع: {{product.category.name}}</v-list-item-title>
                  <v-list-item-subtitle v-if="product.description">{{product.description}}</v-list-item-subtitle>
                  <div class="font-weight-bold">قیمت هر یک عدد: {{product.price}}  تومان</div>
                  <div v-if="product.stockQuantity > 0" class="primary py-1 text-center">موجود در فروشگاه &nbsp;<v-icon>mdi-check</v-icon></div>
                  <hr class="my-1">
                  <v-row class="mx-2 mt-0 mb-2 justify-space-between">
                      <v-form ref="form">
                        <v-text-field
                        :rules="rule"
                        outlined
                        prepend-icon="mdi-light-switch"
                        label="تعداد سفارش"
                        type="number"
                        hide-details
                        :error="product.stockQuantity - quantity < 0"
                        @update:error="error = $event"
                        v-model="quantity"></v-text-field>
                      </v-form>
                      <v-btn :disabled="product.stockQuantity < 1" color="primary" class="my-2 mx-auto" @click="addProductToCart(product , quantity)">افزودن به سبد &nbsp;&nbsp; <v-icon>mdi-cart-outline</v-icon> </v-btn>
                  </v-row>
                </v-list-item-content>
                <v-list-item-avatar class="mt-12" icon :size="maxWidth*0.19" color=grey>
                  <v-img :src="product.photo"></v-img>
                </v-list-item-avatar>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-img>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { EventBus } from "@/utils/event-bus"
  export default {
    props: [
      "product" ,
      "addDialog"
    ]
    ,
    data: () => ({
      quantity : 1 ,
      maxWidth : 0 ,
      rule : [
        v => !!v || "" ,
        v => v > 0 || "" ,
      ] ,
      error : false
    }),
    methods: {
      addProductToCart (product , quantity) {
        if(this.$refs.form.validate() && !this.error) {
          this.$store.dispatch("addProductToCart" , {product : product , quantity : quantity})
          this.onAddDialog()
          EventBus.$emit("openNav")
        }
      } ,
      onAddDialog() {
        this.$emit('on-add-dialog')
      }
    },
    mounted () {
      let maxWidth = window.innerWidth
      this.maxWidth = maxWidth
    },
  }
</script>

<style scoped>

</style>