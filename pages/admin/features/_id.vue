<template>
  <v-container fluid>
    
  </v-container>
</template>

<script>
export default {
  computed: {
    isEdit() {
      // return Boolean(Number(this.$route.params.id));
      return this.$route.params.id.toLocaleLowerCase() !== 'add'
    },
  },
  methods: {
    READ() {
      this.$axios.$get('/api/features/')
    }
  },
  mounted () {
    if (this.isEdit) this.READ();
  },
};
</script>

<style lang="scss" scoped>
</style>