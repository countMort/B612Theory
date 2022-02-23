<template>
  <v-container fluid class="mt-2 mb-10">
    <v-card light max-width="700" class="mx-auto">
      <v-card-title class="title justify-center">
        اضافه کردن محصول
      </v-card-title>
      <v-card-text class="mt-5">
        <v-form ref="form">
          <v-row class="my-0" justify="center" align="center">
            <v-col lg="6" cols="12">
              <v-select
                v-model="data.categoryID"
                dense
                outlined
                label="دسته‌بندی"
                item-text="name"
                item-value="_id"
                hide-details
                :rules="notEmpty"
                :items="categories"
              />
            </v-col>
            <v-col lg="6" cols="12">
              <b-text-field
                v-model="data.name"
                :rules="notEmpty"
                label="نام محصول"
              />
            </v-col>
            <v-col lg="6" cols="12">
              <b-text-field
                v-model="data.price"
                label="قیمت"
                type="number"
              />
            </v-col>
            <v-col lg="6" cols="12">
              <b-text-field
                v-model="data.stockQuantity"
                label="تعداد موجود"
                type="number"
              />
            </v-col>
            <v-col lg="6" cols="12">
              <v-textarea
                v-model="data.description"
                :rows="4"
                auto-grow
                dense
                outlined
                label="توضیحات"
              />
            </v-col>
            <v-col lg="6" cols="12">
              <client-only>
                <upload
                  v-model="file"
                  label="عکس محصول"
                  :file-path="data.photos[0]"
                  :num="1"
                  @on-delete="data.photos = []"
                />
                <b-uploader ref="uploader" />
              </client-only>
            </v-col>
          </v-row>
          <v-row class="my-0 mx-0 align-center">
            <template v-if="data.types.length">
              <v-tooltip v-for="(type, index) in data.types" :key="index" top>
                <template #activator="{ on, attrs }">
                  <v-avatar
                    class="ml-1 mb-1"
                    tile
                    v-bind="attrs"
                    v-on="on"
                    @click="
                      isEdit = true;
                      selected = { ...type, index };
                      typeDialog = true;
                    "
                  >
                    <v-img :src="type.photos[0]" />
                  </v-avatar>
                </template>
                {{ type.name }}
              </v-tooltip>
              <v-spacer />
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    outlined
                    color="primary"
                    @click="
                      isEdit = false;
                      typeDialog = true;
                    "
                    v-on="on"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                افزودن نوع
              </v-tooltip>
            </template>
            <v-btn
              v-else
              class="primary"
              block
              @click="
                isEdit = false;
                typeDialog = true;
              "
            >
              افزودن نوع
            </v-btn>
          </v-row>
          <v-row class="my-0">
            <v-col cols="6" class="text-center">
              <v-btn class="primary" :loading="loading" @click="CREATE">
                ثبت
              </v-btn>
            </v-col>
            <v-col cols="6" class="text-center">
              <v-btn @click="clear">
                پاک کردن
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <TypeDialog
      v-model="typeDialog"
      :is-edit="isEdit"
      :item="selected"
      @add-type="data.types.push($event)"
      @edit-type="data.types[$event.index] = $event"
    />
  </v-container>
</template>

<script>
import TypeDialog from '@/components/admin/products/Type.vue'
import Upload from '@/components/Upload'
export default {
  components: {
    TypeDialog,
    Upload
  },
  async asyncData ({ $axios }) {
    try {
      const { result } = await $axios.$get('/api/categories')
      // let owners = $axios.$get('/api/owners')
      // const [catResponse, ownerResponse] = await Promise.all([
      //     categories,
      //     owners
      // ])
      return {
        categories: result
        // categories : catResponse.categories,
        // owners : ownerResponse.owners
      }
    } catch (error) {
    }
  },
  data () {
    return {
      ownerID: null,
      data: {
        categoryID: null,
        name: '',
        price: 0,
        description: '',
        photos: [],
        stockQuantity: 1,
        type: 'normal',
        typeList: [
          {
            text: 'غیر سفارشی',
            value: 'normal'
          },
          {
            text: 'کارت صدا',
            value: 'voiceCard'
          },
          {
            text: 'کتاب خاطره',
            value: 'diaryBook'
          },
          {
            text: 'کبریت سفارشی',
            value: 'matches'
          },
          {
            text: 'پولاروید',
            value: 'polaroid'
          }
        ]
      },
      file: [],
      notEmpty: [v => !!v || 'نمی‌تواند خالی باشد'],
      loading: false,
      typeDialog: false,
      isEdit: false,
      selected: {}
    }
  },
  methods: {
    async CREATE () {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true
          const data = { ...this.data }
          if (this.file[0]) {
            const res = await this.$refs.uploader.upload(
              this.file[0].newFile,
              'admin'
            )
            data.photos[0] = res.info.url
            data.thumbnails[0] = res.info.thumbnail
          }
          const result = await this.$axios.$post('/api/products', data)
          this.$toast.success(result.message)
          this.loading = false
          this.$nuxt.$router.push('/admin/products')
        }
      } catch (error) {
        this.loading = false
      }
    },
    clear () {
      this.file = []
      this.data.photos = []
      this.$refs.form.reset()
    }
  }
}
</script>

<style scoped>
.select {
  width: 100%;
  border: black 1px solid;
  border-radius: 30%;
}
</style>
