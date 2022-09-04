<template>
  <v-container class="pt-0">
    <SocialHead
      title="B612 Theory | تئوری بی‌ششصدودوازده"
      description="کبریت رنگی B612 | خرید حس خوب برای دیگران"
      image="https://dl.b612theory.ir/admin/shazde1.jpg"
    />
    <v-chip label color="error" class="mt-4">
      دسته‌بندی های محصولات
    </v-chip>
    <v-row class="justify-center">
      <template v-for="category in categories">
        <!-- v-if="category.display !== 'none'" -->
        <v-col
          v-if="category.display !== 'none'"
          :key="category._id"
          cols="4"
          sm="3"
          md="2"
        >
          <v-card
            class="mx-auto mt-2"
            outlined
            nuxt
            :to="`/categories/${category._id}`"
            hover
            tile
          >
            <v-img
              :aspect-ratio="0.8"
              :src="category.thumbnails[0]"
              class="align-center"
            >
              <v-card-title
                :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'subtitle-1'"
                class="justify-center text-center py-1 white--text word-break"
              >
                {{ category.name }}
              </v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <v-chip label color="error" class="mb-1 mt-4">
      {{ sliders[0].name }}
    </v-chip>
    <Slider :items="sliders[0][sliders[0].type]" />
    <nuxt-link
      style="max-width: 500px"
      class="d-flex mx-auto mt-2"
      to="/products/VoiceCard/60a80142d6a7bbb590a2fc98"
    >
      <v-img
        max-width="500"
        src="https://dl.b612theory.ir/admin/voicecard.gif"
        alt="کارت صدا"
      />
    </nuxt-link>
    <v-chip label color="error" class="mb-1 mt-4">
      {{ sliders[1].name }}
    </v-chip>
    <Slider :items="sliders[1][sliders[1].type]" />
  </v-container>
</template>

<script>
import Slider from '@/components/Slider.vue'
import SocialHead from '@/components/SocialHead.vue'
export default {
  components: {
    Slider,
    SocialHead
  },
  async asyncData ({ query, redirect, $axios }) {
    try {
      switch (query.redirect) {
        case 'the-little-prince':
          redirect('https://dl.b612theory.ir/admin/Shazdeh.Koochooloo.mp3')
          break
        case 'b612-gift':
          redirect('https://B612theory.ir/articles/gift')
          break
        case 'post':
          redirect(`https://tracking.post.ir/search.aspx?id=${query.code}`)
          break
        case 'true':
          redirect('https://www.instagram.com/b612theory/')
          break
        default: {
          const catReq = $axios.$get('/api/categories')
          const sliderReq = $axios.$get('/api/sliders')
          const [catRes, sliderRes] = await Promise.all([catReq, sliderReq])
          const sliders = sliderRes.result
          return {
            categories: catRes.result,
            sliders
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      selected: null,
      addDialog: false,
      categories: []
    }
  }
}
</script>

<style lang="scss" scoped>
.word-break {
  background-color: rgba(175, 156, 156, 0.345);
  word-break: keep-all;
}
</style>
