<template>
  <v-card :loading="loading" class="card d-flex">
    <client-only>
      <TextEditor v-model="text" />
    </client-only>
    <v-tooltip
      v-for="item in data.slice(0, 30)"
      :key="item.id"
      top
    >
      <template #activator="{ on, attrs }">
        <v-img
          :src="item.polaroid.photo"
          :lazy-src="item.polaroid.thumbnail"
          width="100"
          v-bind="attrs"
          v-on="on"
        />
      </template>
      <span> سفارش {{ item.order.trackingCode }}</span>
    </v-tooltip>
  </v-card>
</template>

<script>
import TextEditor from '~/components/text-editor/TextEditor.vue'
if (process.client) {
  // eslint-disable-next-line no-var, no-unused-vars
  var domToImage = require('dom-to-image')
}
export default {
  components: {
    TextEditor
  },
  data () {
    return {
      data: [],
      loading: false,
      text: ''
    }
  },
  watch: {
    text (nv, pv) {
      console.log(nv)
    }
  }
  // async mounted () {
  //   try {
  //     this.loading = true
  //     this.data = (await this.$axios.$get('/api/polaroid')).data
  //     console.log(this.data)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     this.loading = false
  //   }
  // }
}
</script>

<style lang="scss" scoped>
$height: 1000px;
.card {
  height: $height;
  width: calc($height * 1.41);
  overflow: hidden;
}
</style>
