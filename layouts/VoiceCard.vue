<template>
  <v-app style="background: black;">
    <nuxt />
    <v-footer fixed inset class="justify-center">
      <nuxt-link :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''" to="/">
        قدرت گرفته از تئوری بی ششصد و دوازده
      </nuxt-link>
    </v-footer>
  </v-app>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
