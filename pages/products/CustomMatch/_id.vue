<template>
  <v-container>
    <CustomMatchPrev />
  </v-container>
</template>

<script>
import CustomMatchPrev from '@/components/products/CustomMatchPrev.vue'
// import Upload from '~/components/Upload.vue'
export default {
  components: {
    CustomMatchPrev
    // Upload
  },
  async asyncData ({ $axios, params }) {
    try {
      const { result } = await $axios.$get('/api/products/' + params.id)
      const cusotmMatch = result.product
      const type = result.type || cusotmMatch.types[0]
      console.log(type)
      return {
        cusotmMatch,
        type
      }
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss" scoped></style>
