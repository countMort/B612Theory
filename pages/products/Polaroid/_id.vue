<template>
  <v-container style="min-height: 100%" class="d-flex">
    <SocialHead
      :title="`B612 Theory | خرید ${polaroid.name}`"
      :description="polaroid.description"
      :image="polaroid.photos && polaroid.photos[0]"
    />
    <v-form ref="form" class="my-auto mx-auto full-width">
      <v-row class="my-0 justify-center">
        <v-col
          cols="12"
          :sm="photos.length ? 6 : 12"
          class="d-flex justify-center align-center"
        >
          <v-list max-width="400" flat class="py-0">
            <v-list-item>
              <v-list-item-content class="py-0">
                <v-list-item-title>
                  <v-select
                    v-model="type"
                    class="mt-2"
                    outlined
                    dense
                    :items="polaroid.types"
                    item-text="name"
                    return-object
                    hide-details
                    label="نوع عکس"
                  />
                </v-list-item-title>
                <v-list-item-subtitle>
                  <client-only>
                    <PhotoUpload
                      ref="PhotoUpload"
                      v-model="photos"
                      mini
                      :aspect_ratio="type.dimensions"
                      force-aspect
                      :rules="imageRules"
                      multiple
                      @cropping="cropping = $event"
                      @cropped="setPhoto"
                    >
                      <template #label>
                        عکساتو اینجا بذار
                      </template>
                      <template #action>
                        <v-select
                          v-model="type"
                          style="max-width: 200px"
                          class="mt-2"
                          outlined
                          dense
                          :items="polaroid.types"
                          item-text="name"
                          return-object
                          hide-details
                          label="نوع عکس"
                        />
                      </template>
                    </PhotoUpload>
                  </client-only>
                </v-list-item-subtitle>
                <div class="text-center">
                  <v-btn
                    v-if="photos.length"
                    class="mb-2"
                    outlined
                    color="primary"
                    small
                    @click="addFile"
                  >
                    <v-icon>mdi-plus</v-icon>
                    افزودن عکس
                  </v-btn>
                  <v-btn
                    v-if="photos.length > 1"
                    class="mb-2"
                    color="primary"
                    small
                    :loading="loading"
                    @click="sendAll"
                  >
                    تایید و افزودن همه عکس ها
                  </v-btn>
                  <v-btn
                    class="mb-2"
                    :icon="Boolean(photos.length)"
                    :block="!photos.length"
                    color="info"
                    small
                    @click="descDialog = true"
                  >
                    <template v-if="!photos.length">
                      راهنما
                    </template>
                    <v-icon
                      v-if="Boolean(photos.length)"
                    >
                      mdi-help-circle
                    </v-icon>
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col
          v-for="(photo, index) in photos"
          :key="photo.id"
          cols="12"
          md="4"
          sm="6"
        >
          <v-card outlined tile class="pt-4">
            <v-img
              style="border: 1px solid black"
              class="mx-auto"
              max-height="300"
              max-width="250"
              contain
              align="top"
              :src="photo.newUrl"
            >
              <v-btn
                :disabled="loading"
                color="white"
                fab
                x-small
                @click="removePhoto(index)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-img>
            <v-card-title
              v-show="photo.quote"
              class="pt-1 pb-0 px-0 caption justify-center"
              v-text="photo.quote"
            />
            <b-uploader ref="uploader" />
            <v-divider class="mt-3" />
            <div class="mt-3">
              <QuantityButtons
                v-model="photo.quantity"
                :disabled="Boolean(photo.loading)"
                label="تعداد:"
                small
                :rules="quantityRules"
                :stock-quantity="
                  photo.polaroidType ? photo.polaroidType.stockQuantity : 0
                "
                :price="photo.polaroidType ? photo.polaroidType.price : 0"
              />
              <v-textarea
                v-model="photo.quote"
                :disabled="Boolean(photo.loading)"
                class="my-5"
                label="افزودن متن، زیر تصویر(اختیاری)"
                dense
                hide-details
                :rows="2"
                auto-grow
              />
              <span v-show="photo.sent" class="primary--text caption">
                <v-icon small color="primary">mdi-check</v-icon>
                به سبد اضافه شد
              </span>
              <v-btn
                :loading="Boolean(photo.loading)"
                tile
                class="primary"
                block
                @click="sendPolaroid([index])"
              >
                <v-icon class="ml-2">
                  mdi-cloud-upload
                </v-icon>
                افزودن به سبد
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    <DescDialog v-model="descDialog" :item="type" />
    <CheckUser />
  </v-container>
</template>

<script>
import PhotoUpload from '@/components/Upload.vue'
import SocialHead from '@/components/SocialHead.vue'
import DescDialog from '@/components/products/Info.vue'
import CheckUser from '@/components/CheckUser.vue'
import QuantityButtons from '@/components/products/QuantityButtons.vue'
export default {
  components: {
    PhotoUpload,
    DescDialog,
    SocialHead,
    CheckUser,
    QuantityButtons
  },
  async asyncData ({ $axios, params }) {
    try {
      const { result } = await $axios.$get('/api/products/' + params.id)
      const polaroid = result.product
      const type = result.type || polaroid.types[0]
      return {
        polaroid,
        type
      }
    } catch (error) {
      console.log(error)
    }
  },
  data () {
    return {
      photos: [],
      quote: '',
      quantityRules: [v => v > 0 || ''],
      imageRules: [
        v =>
          !v ||
          v.length < 1 ||
          !v.some(photo => !photo.type.startsWith('image')) ||
          'فرمت وارد شده صحیح نیست'
      ],
      descDialog: false,
      cropping: false,
      loading: false
    }
  },
  methods: {
    // ["image/png", "image/x-png", "image/gif", "image/jpeg","image/webp","image/wmf","image/aces","image/avci","image/avcs","image/avif","image/bmp","image/cgm","image/emf"]
    async sendPolaroid (indexes) {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true
          indexes.forEach((index) => {
            this.photos[index].loading = true
          })
          for (let i = 0; i < indexes.length; i++) {
            const index = indexes[i]
            const photo = this.photos[index]
            const result = await this.$refs.uploader[index].upload(photo.newFile)
            const polaroid = {
              quote: photo.quote,
              type: photo.polaroidType._id,
              photo: result.info.url,
              thumbnail: result.info.thumbnail
            }
            const response = await this.$axios.$post('/api/polaroid', polaroid)
            const product = {
              ...photo.polaroidType,
              product: { ...this.polaroid },
              polaroid: response.polaroid._id,
              photos: [polaroid.photo],
              thumbnails: [polaroid.thumbnail]
            }
            this.$store.dispatch('addProductToCart', {
              product,
              quantity: photo.quantity
            })
            photo.sent = true
            photo.loading = false
            this.$toast.success(response.message)
          }
        }
      } catch (error) {
        console.log(error)
      } finally {
        indexes.forEach((index) => {
          this.photos[index].loading = false
        })
        this.loading = false
      }
    },
    sendAll () {
      const indexes = this.photos.map((photo, index) => index)
      this.sendPolaroid(indexes)
    },
    setPhoto (event) {
      const { index } = event
      const newPhoto = {
        ...this.photos[index],
        polaroidType: this.type,
        quantity: 1,
        qoute: '',
        sent: false,
        loading: false
      }
      this.$set(this.photos, index, newPhoto)
    },
    removePhoto (index) {
      this.$refs.PhotoUpload.remove(index)
    },
    editPhoto (index) {
      this.$refs.PhotoUpload.editSingleFile(this.photos[index])
    },
    givePrice (type, quantity) {
      if (!type || !quantity) {
        return 0
      }
      return type.price * quantity
    },
    addFile () {
      this.$refs.PhotoUpload.openUpload()
    }
  }
}
</script>

<style scoped></style>
