<template>
  <div
    class="no-product full-height d-flex align-center justify-center body text-center"
  >
    در حال حاضر محصولی در دسته‌بندی
    <span class="text-bold">
      &nbsp;
      {{ category.name }}
      &nbsp;
    </span>
    موجود نیست.
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Category } from '~/types/DB.type'

export default Vue.extend({
  name: 'NoProduct',
  props: {
    category: {
      type: Object as PropType<Category>,
    },
  },
})
</script>

<style scoped></style>
