<template>
  <v-container>
    <SocialHead
      :title="`B612 Theory | خرید ${diaryBook.name}`"
      :description="diaryBook.description"
      :image="diaryBook.photos && diaryBook.photos[0]"
    ></SocialHead>
    <v-form ref="form">
      <v-row class="my-0 mx-0 justify-center">
        <v-col cols="12" sm="8" md="6" class="subtitle-2 my-auto">
          <client-only>
            <video-upload
              type="video"
              v-model="video"
              :maxSize="30"
              label="ویدیوت رو اینجا بذار"
              :rules="videoRules"
            ></video-upload>
            <v-btn
              small
              elevation="0"
              block
              color="info"
              @click="descDialog = true"
            >
              راهنما
            </v-btn>
          </client-only>
        </v-col>
        <v-col v-show="video[0]" cols="12" sm="4" md="6">
          <video
            loop
            style="max-height: 100%; max-width: 100%"
            autoplay
            muted
            :src="video[0] ? video[0].url || video[0].path : ''"
          ></video>
        </v-col>
        <v-col cols="12">
          <v-expansion-panels flat accordion hover v-model="panel">
            <v-expansion-panel>
              <v-expansion-panel-header color="grey lighten-2">
                انتخاب‌های بیشتر (اختیاری)
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <client-only>
                  <v-row class="my-0 justify-center">
                    <v-col
                      cols="12"
                      md="6"
                      class="px-0"
                      v-for="(photo, i) in photosSchema"
                      :key="photo.name"
                    >
                      <photo-upload
                        mini
                        v-model="photos[i]"
                        :label="photo.name"
                        :rules="imageRules"
                        :aspect_ratio="photo.aspectRatio"
                        forceAspect
                        :num="i + 2"
                      ></photo-upload>
                      <b-uploader ref="uploaders"></b-uploader>
                    </v-col>
                    <v-col cols="12" md="6" class="px-0 d-flex align-center">
                      <v-textarea
                        label="اسم برای کتاب یا یک یادداشت"
                        rows="2"
                        auto-grow
                        hide-details
                        dense
                        outlined
                        v-model="quote"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </client-only>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <b-uploader ref="uploader"></b-uploader>
          <v-btn
            :disabled="stockQuantity == 0"
            :loading="loading"
            @click="submit"
            block
            class="primary my-2 "
          >
            {{
              stockQuantity == 0
                ? "در حال حاضر این نوع کتاب خاطره موجود نیست"
                : "تایید و آپلود فیلم"
            }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <desc-dialog :item="type" v-model="descDialog"></desc-dialog>
    <check-user></check-user>
  </v-container>
</template>

<script>
import PhotoUpload from "@/components/Upload";
import VideoUpload from "@/components/SmallerUpload";
import SocialHead from "@/components/SocialHead.vue";
import DescDialog from "@/components/products/Info";
import CheckUser from "@/components/CheckUser.vue";
export default {
  components: {
    PhotoUpload,
    VideoUpload,
    DescDialog,
    SocialHead,
    CheckUser
  },
  async asyncData({ $axios, params }) {
    try {
      let { result } = await $axios.$get("/api/products/" + params.id);
      const diaryBook = result.product;
      const type = result.type || diaryBook.types[0];
      return {
        diaryBook,
        type
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      video: [],
      panel: -1,
      photos: [[], [], [], []],
      quote: "",
      photosSchema: [
        { name: "عکس روی جلد", value: "coatFront", aspectRatio: "2.15*1" },
        { name: "عکس پشت جلد", value: "coatBack", aspectRatio: "2.15*1" },
        { name: "عکس روی جعبه", value: "boxFront", aspectRatio: "2.1*1" },
        { name: "عکس پشت جعبه", value: "boxBack", aspectRatio: "2.1*1" }
      ],
      videoRules: [
        v => !!v || "",
        v =>
          !v ||
          [
            "video/webm",
            "video/mp4",
            "video/ogg",
            "video/mov",
            "video/quicktime"
          ].indexOf(v.type) != -1 ||
          "فرمت وارد شده صحیح نیست"
      ],
      imageRules: [
        v =>
          !v ||
          v.length < 1 ||
          [
            "image/png",
            "image/x-png",
            "image/gif",
            "image/jpeg",
            "image/webp",
            "image/wmf",
            "image/aces",
            "image/avci",
            "image/avcs",
            "image/avif",
            "image/bmp",
            "image/cgm",
            "image/emf"
          ].indexOf((v || "").type) !== -1 ||
          "فرمت وارد شده صحیح نیست"
      ],
      loading: false,
      descDialog: false
    };
  },
  methods: {
    async submit() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          let data = {
            quote: this.quote,
            type: this.type._id
          };
          let result = await this.$refs.uploader.upload(this.video[0].file);
          data.video = result.info.url;
          let res;
          let photos = new Object();
          for (let index = 0; index < this.photosSchema.length; index++) {
            if (this.photos[index][0]) {
              res = await this.$refs.uploaders[index].upload(
                this.photos[index][0].newFile
              );
              photos[this.photosSchema[index].value] = res.info.url;
            }
          }
          data.photos = photos;
          let response = await this.$axios.$post("/api/diary-book", data);
          if (!response.diaryBook || !response.diaryBook._id) return;
          this.$toast.success(response.message);
          let product = { ...this.type };
          product.product = { ...this.diaryBook };
          product.files = [data.video];
          product.diaryBook = response.diaryBook._id;
          product.photos = data.photos;
          this.$store.dispatch("addProductToCart", {
            product,
            quantity: 1
          });
          this.$nuxt.$router.push("/cart");
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    }
  },
  computed: {
    stockQuantity() {
      return Math.min(this.diaryBook.stockQuantity, this.type.stockQuantity);
    }
  }
};
</script>

<style scoped></style>
