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

<script>
export default {
  name: 'NoProduct',
  props: {
    category: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped></style>
