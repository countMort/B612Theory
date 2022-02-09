<template>
  <v-row class="my-0 py-0" v-show="uploading">
    <v-col class="my-0">
      <v-progress-linear
        :color="color"
        :height="height"
        :value="uploadProgress"
        :striped="striped"
        :stream="stream"
        :buffer-value="0"
      ></v-progress-linear>
    </v-col>
    <v-col cols="auto" class="py-0 my-auto text-center">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-on="on"
            v-bind="attrs"
            v-show="uploading"
            small
            icon
            color="red"
            @click="cancel"
          >
            <v-icon :size="20">
              mdi-stop-circle-outline
            </v-icon>
          </v-btn>
        </template>
        <span>
          لغو ارسال
        </span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 10
    },
    color: {
      type: String,
      default: "primary"
    },
    striped: {
      type: Boolean,
      default: true
    },
    stream: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      uploading: false,
      uploadProgress: 0,
      source: null
    };
  },
  methods: {
    upload(file, role, method = "post", route, otherData = {}) {
      const vue = this;
      this.source = this.$axios.CancelToken.source();

      return new Promise((resolve, reject) => {
        vue.uploading = true;
        var formData = new FormData();
        formData.append("file", file);
        for (let key in otherData) {
          formData.append(key, otherData[key]);
        }
        route = route || `/api/upload${role == "admin" ? "/admin" : ""}`;
        const config = {
          progress: true,
          cancelToken: this.source.token,
          onUploadProgress: progressEvent => {
            // console.log(progressEvent);
            const totalLength = progressEvent.lengthComputable
              ? progressEvent.total
              : progressEvent.target.getResponseHeader("content-length") ||
                progressEvent.target.getResponseHeader(
                  "x-decompressed-content-length"
                );
            // console.log("onUploadProgress", totalLength);
            if (totalLength !== null) {
              vue.uploadProgress = Math.round(
                (progressEvent.loaded * 100) / totalLength
              );
              // console.log(vue.uploadProgress);
              // console.log(totalLength);
              // console.log(progressEvent.loaded);
            }
          }
        };
        if (method == "put") {
          this.$axios
            .$put(route, formData, config)
            .then(result => {
              resolve(result);
              vue.uploading = false;
              vue.uploadProgress = 0;
            })
            .catch(error => {
              reject(error);
              vue.uploadProgress = 0;
              vue.uploading = false;
            });
        } else if (method == "post") {
          this.$axios
            .$post(route, formData, config)
            .then(result => {
              resolve(result);
              vue.uploading = false;
              vue.uploadProgress = 0;
            })
            .catch(error => {
              reject(error);
              vue.uploadProgress = 0;
              vue.uploading = false;
            });
        }
      });
    },
    cancel() {
      if (this.source) {
        this.source.cancel("آپلود لغو شد");
      }
    }
  }
};
</script>

<style scoped></style>
