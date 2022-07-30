<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card light>
      <v-card-title>
        {{ !isEdit ? "افزودن" : "ویرایش" }}
        نوع
        <span v-if="isEdit" class="primary--text mr-2">{{ item.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="data.name"
            hide-details
            class="my-2"
            label="نام محصول"
            dense
            outlined
            :rules="notEmpty"
          />
          <client-only>
            <upload
              v-model="file"
              label="عکس محصول"
              :file-path="data.photos[0]"
              :num="2"
              @on-delete="data.photos = []"
            />
            <b-uploader ref="upload" />
          </client-only>
          <v-row class="my-0">
            <v-col cols="7">
              <v-text-field
                v-model="data.price"
                hide-details
                class="my-2"
                label="قیمت"
                type="number"
                dense
                outlined
              />
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="data.stockQuantity"
                hide-details
                class="my-2"
                label="موجودی"
                type="number"
                dense
                outlined
              />
            </v-col>
            <v-col cols="6">
              <v-checkbox
                v-model="data.custom"
                hide-details
                class="my-0"
                label="سفارشی"
                dense
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="data.dimensions"
                hide-details
                class="my-0"
                label="ابعاد(در صورت نیاز)"
                dense
                outlined
                dir="ltr"
              />
            </v-col>
          </v-row>
          <v-textarea
            v-model="data.description"
            rows="2"
            hide-details
            class="my-2"
            label="توضیحات"
            dense
            outlined
          />
          <v-row class="justify-center my-0">
            <v-btn
              color="primary"
              :loading="uploading"
              @click="submit"
            >
              آپلود تصویر و ثبت
            </v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Upload from '@/components/Upload'
export default {
  components: {
    Upload
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    loading: Boolean
  },
  data () {
    return {
      data: {
        custom: false,
        name: '',
        price: 0,
        stockQuantity: 0,
        photos: [],
        thumbnails: [],
        description: ''
      },
      file: [],
      uploading: false,
      notEmpty: [v => !!v || 'نمی‌تواند خالی باشد']
    }
  },
  computed: {
    dialog: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    dialog (newValue) {
      if (newValue) {
        Object.assign(this.$data, this.$options.data())
        if (this.isEdit) {
          this.data = { ...this.item }
        } else {
          this.$nextTick(() => {
            this.data.photos = []
            this.$refs.form.reset()
          })
        }
      }
    }
  },
  methods: {
    async submit () {
      try {
        if (this.$refs.form.validate()) {
          this.uploading = true
          const data = { ...this.data }
          if (this.file[0]) {
            const res = await this.$refs.upload.upload(
              this.file[0].file,
              'admin'
            )
            data.photos[0] = res.info.url
            data.thumbnails = [res.info.thumbnail]
          }
          this.uploading = false
          if (this.isEdit) {
            this.$emit('edit-type', data)
          } else {
            this.$emit('add-type', data)
          }
          this.dialog = false
        }
      } catch (error) {
        console.log(error)
        this.uploading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
