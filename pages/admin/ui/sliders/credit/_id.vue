<template>
  <v-container>
    <v-progress-linear
      v-if="loading"
      indeterminate
      height="2"
    />
    <v-select
      v-model="data.type"
      label="نوع اسلایدر"
      :items="[{text: 'دسته‌بندی', value: 'categories'}, {text: 'محصول', value: 'products'}]"
    />
    <v-text-field
      v-model="data.sort"
      type="number"
      label="ترتیب"
    />
    <v-text-field
      v-model="data.name"
      type="text"
      label="نام اسلایدر"
    />
    <v-textarea
      v-model="data.description"
      label="توضیحات اسلایدر"
      rows="2"
    />
    <slider
      :items="items"
      admin
    />
    <v-data-table
      v-for="(panel, key) in panels"
      v-show="key == 'categories' ? data.type == 'categories' : data.type != 'categories'"
      :key="key"
      v-model="items"
      dense
      :headers="headers"
      :items="panel"
      item-key="_id"
      show-select
    >
      <template #top>
        {{ key }}
      </template>
      <template #item.photos="{item}">
        <v-avatar>
          <v-img :src="item.photos[0]" />
        </v-avatar>
      </template>
    </v-data-table>
    <v-btn :loading="loading" class="primary" block @click="submit">
      {{ isEdit ? 'ویرایش' : 'ایجاد' }} اسلایدر
    </v-btn>
  </v-container>
</template>

<script>
import Slider from '~/components/SliderComponent.vue'
export default {
  components: {
    Slider
  },
  async asyncData ({ $axios }) {
    try {
      const catReq = $axios.$get('/api/categories')
      const prodReq = $axios.$get('/api/products')
      const [catRes, prodRes] = await Promise.all([catReq, prodReq])
      const products = prodRes.result
      const productsGroup = products.reduce(function (rv, x) {
        (rv[x.category.value] = rv[x.category.value] || []).push(x)
        return rv
      }, {})
      return {
        categories: catRes.result,
        productsGroup
      }
    } catch (error) {
      console.log(error.message || error)
    }
  },
  data () {
    return {
      data: {},
      items: [],
      loading: false,
      headers: [
        {
          text: 'تصویر',
          value: 'photos',
          sortable: false,
          align: 'center'
        },
        {
          text: 'نام',
          value: 'name',
          align: 'center'
        },
        {
          text: 'تعداد',
          value: 'stockQuantity',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    panels () {
      const panels = {
        categories: this.categories,
        ...this.productsGroup
      }
      return panels
    },
    isEdit () {
      return !!this.$route.params.id
    }
  },
  watch: {
    'data.type': {
      handler () {
        if (!this.loading) { this.items = [] }
      }
    }
  },
  mounted () {
    this.$try(async () => {
      if (this.isEdit) {
        const { result } = await this.$axios.$get(`/api/sliders/${this.$route.params.id}`)
        this.data = result
        this.items = result[result.type]
      };
    }, this)
  },
  methods: {
    submit () {
      this.$try(async () => {
        const data = { ...this.data }
        data[this.data.type] = this.items.map(item => item._id)
        const result = this.isEdit
          ? await this.$axios.$put('/api/sliders/' + this.$route.params.id, data)
          : await this.$axios.$post('/api/sliders', data)
        this.$toast.success(result.message)
        this.$nuxt.$router.push('/admin/ui/sliders')
      }, this)
    }
  }
}
</script>
