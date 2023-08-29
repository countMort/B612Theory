<template>
  <div>
    <v-row class="mt-2">
      <v-spacer />
      <v-btn
        small
        nuxt
        class="ml-5 white--text"
        color="primary"
        to="/admin/products/add"
      >
        افزودن محصول
      </v-btn>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          class="mx-10"
          name="جستجو"
          label="جستجو کنید"
        />
        <v-data-table
          dense
          :headers="headers"
          :items="filteredItems"
          :loading="loading"
          loader-height="2"
        >
          <template #item.photos="{ item }">
            <v-avatar>
              <v-img :src="item.photos[0]" :lazy-src="item.thumbnails[0]" />
            </v-avatar>
          </template>
          <template #item.actions="{ item }">
            <v-btn icon :to="`/admin/products/${item.id}`">
              <v-icon>
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn
              icon
              color="red"
              @click="
                deleteDialog = true;
                selected = item;
              "
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <delete-dialog
      v-model="deleteDialog"
      :item="selected"
      :loading="loading"
      @delete="DELETE"
    />
  </div>
</template>

<script>
import DeleteDialog from '@/components/admin/products/Delete'
export default {
  components: {
    DeleteDialog
  },
  data () {
    return {
      products: [],
      deleteDialog: false,
      selected: {},
      loading: false,
      search: '',
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
        },
        {
          text: 'عملیات',
          value: 'actions',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    filteredItems () {
      if (!this.search || !this.search.trim()) { return this.products }
      const filteredItems = this.products.filter((prod) => {
        return prod.name.includes(this.search.trim())
      })
      return filteredItems
    }
  },
  mounted () {
    this.READ()
  },
  methods: {
    async READ () {
      try {
        this.loading = true
        const { result } = await this.$axios.$get('/api/products')
        this.products = result
        this.loading = false
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    },
    async DELETE (id) {
      try {
        this.loading = true
        const result = await this.$axios.$delete(`/api/products/${id}`)
        this.$toast.success(result.message)
        this.deleteDialog = false
        this.READ()
      } catch (error) {
        console.log(error)
        this.loading = false
      }
    }
  }
}
</script>

<style scoped></style>
