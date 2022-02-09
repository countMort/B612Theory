<template>
    <!-- :src="require('../static/footer-bg.jpg')" -->
  <v-parallax
    dark
    class="pl-0 mx-n2"
    :src="require('../static/footer-bg.jpg')"
  >
    <v-layout
    align-center
    justify-center
    >
      <h1 class="font-weight-bold" style="font-family: none !important;">
        <v-icon class="up_and_down" large>mdi-auto-fix</v-icon>
        &nbsp;B612
      </h1>
    </v-layout>
    <!-- <v-layout align-center="true" justify-center>
        <v-btn :style="{opacity : 0.8}">پیشنهاد امروز</v-btn>
    </v-layout> -->
  </v-parallax>
</template>

<script>
    export default {
        
    }
</script>

<style scoped>
/* div {
  margin-top: 8rem;
} */
</style>