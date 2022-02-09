<template>
  <div class="justify-space-between align-center px-2 d-flex">
    <div>
      <slot name="label">
        <span :class="{ 'caption': small }">
          {{label}}
        </span>
      </slot>
      <v-btn :disabled="disabled" text :small="!small" :x-small="small" tile class="py-5" @click="changeQuantity(true)"><v-icon>mdi-plus</v-icon></v-btn>
      <v-chip>{{ quantity }}</v-chip>
      <v-btn :disabled="disabled" text :small="!small" :x-small="small" tile class="py-5" @click="changeQuantity(false)"><v-icon>mdi-minus</v-icon></v-btn>
    </div>
    <v-chip
    small
    color="primary"
    >
      {{ (quantity * price) | number}} تومان
    </v-chip>
    <!-- <v-text-field
    outlined
    dense
    :rules="rules"
    :error="error"
    :error-messages="errorMessage"
    v-model="quantity"
    style="max-width: 50px;"
    hide-details
    ></v-text-field> -->
  </div>
</template>

<script>
  export default {
    name: 'QuantityButtons',
    props: {
      value: {
        type: Number,
        default: 1
      },
      stockQuantity: {
        type: Number,
        default: 1
      },
      rules: {
        type: Array,
        default: () => []
      },
      price: {
        type: Number,
        default: 0
      },
      label: {
        type: String,
        default: 'تعداد'
      },
      small: Boolean,
      disabled: Boolean
    },
    data() {
      return {
        errorMessage: '',
        error: false
      }
    },
    computed: {
      quantity: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    methods: {
      changeQuantity(incrementing) {
        if (this.disabled) return
        const change = incrementing ? 1 : -1
        const newQuantity = this.quantity + change
        if (newQuantity < 1 || newQuantity > this.stockQuantity) {
          this.error = true
          return
        }
        this.quantity = newQuantity
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>