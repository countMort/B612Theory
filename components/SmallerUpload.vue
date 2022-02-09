<template>
  <div class="upload-file-drag upload_component">
    <v-row class="text-center justify-center my-0">
      <v-col
        v-if="file[0] || filePath"
        class="py-0 relative px-0 text-right d-flex align-center"
        :class="
          type.indexOf(['video', 'image', 'media']) > -1
            ? 'justify-start'
            : 'justify-center'
        "
        :cols="$vuetify.breakpoint.smAndUp ? 3 : 12"
      >
        <slot name="item">
          <v-img
            v-if="type == 'image'"
            class="pointer my-auto"
            @click="previewImage(file[0] || filePath)"
            :src="file[0] ? file[0].url || file[0].path : filePath"
            contain
            max-height="120"
          />
          <v-icon large v-else-if="type == 'audio'">
            mdi-music-circle-outline
          </v-icon>
          <v-icon large v-else-if="type == 'video'">
            mdi-vhs
          </v-icon>
        </slot>
      </v-col>
      <v-col
        class="justify-center text-center my-auto mx-auto px-0 py-0"
        :cols="$vuetify.breakpoint.smAndUp ? 2 : 12"
      >
        <v-btn
          outlined
          v-if="file[0]"
          @click="file = []"
          x-small
          class="red mb-0 mb-sm-7"
        >
          <v-icon color="white" x-small>mdi-close</v-icon>
        </v-btn>
        <v-btn
          outlined
          v-else-if="filePath"
          @click="$emit('on-delete')"
          x-small
          class="red mb-0 mb-sm-7"
        >
          <v-icon color="white" x-small>mdi-delete</v-icon>
        </v-btn>
      </v-col>
      <v-col
        class="my-auto py-0"
        :cols="
          !file[0] && !filePath ? 12 : $vuetify.breakpoint.smAndUp ? 7 : 12
        "
      >
        <v-row class="my-0" justify="center" v-if="!file[0] && !filePath">
          <v-col class="col-12 py-0" v-if="showIcon">
            <v-icon :size="mini ? 30 : 40" color="grey">
              <template v-if="type == 'image'">
                mdi-image-plus
              </template>
              <template v-else-if="type == 'audio'">
                mdi-music-circle-outline
              </template>
              <template v-else-if="type == 'video'">
                mdi-file-video
              </template>
            </v-icon>
          </v-col>
          <v-col
            class="col-12 text-center py-0 grey--text"
            :class="mini ? 'subtitle-2' : 'title'"
          >
            <slot name="label">
              {{ label }}
            </slot>
          </v-col>
        </v-row>
        <client-only>
          <file-upload
            :drop="true"
            :accept="
              type == 'image'
                ? 'image/*'
                : type == 'audio'
                ? 'audio/*'
                : type == 'video'
                ? 'video/*'
                : type == 'media'
                ? 'video/*,image/*'
                : 'video/*,image/*,audio/*'
            "
            class="full-width"
            v-model="file"
            :ref="`upload${num}`"
            @input-filter="inputFilter"
            :input-id="num.toString()"
            :multiple="false"
          >
            <!-- :error.sync="error" -->
            <v-file-input
              outlined
              dense
              :accept="
                type == 'image'
                  ? 'image/*'
                  : type == 'audio'
                  ? 'audio/*'
                  : type == 'video'
                  ? 'video/*'
                  : type == 'media'
                  ? 'video/*,image/*'
                  : 'video/*,image/*,audio/*'
              "
              :value="file[0]"
              :rules="rules"
              prepend-icon
              :dark="dark"
              class="_text _input mt-1"
              :hide-details="hideDetails"
              clear-icon
            >
              <template v-slot:append>
                <v-icon class="pl-5 pr-3 pb-2">
                  mdi-cloud-upload-outline
                </v-icon>
              </template>
            </v-file-input>
          </file-upload>
        </client-only>
      </v-col>
    </v-row>
  </div>
</template>

<script>
if (process.client) {
  var FileUpload = require("vue-upload-component");
}
export default {
  components: {
    FileUpload
  },
  props: {
    label: String,
    rules: {
      type: Array,
      default: () => []
    },
    filePath: String,
    mini: Boolean,
    num: {
      type: Number,
      default: 1
    },
    value: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: "image"
    },
    maxSize: {
      type: Number,
      default: 10
    },
    dark: Boolean,
    showIcon: {
      type: Boolean,
      default: true
    },
    hideDetails: Boolean
  },
  data() {
    return {
      inputRatio: 0,
      audioMimeTypes: [
        "audio/basic",
        "audio/L24",
        "audio/mid",
        "audio/mpeg",
        "audio/mp4",
        "audio/x-aiff",
        "audio/x-mpegurl",
        "audio/vnd.rn-realaudio",
        "audio/realaudio",
        "audio/ogg",
        "audio/vorbis",
        "audio/vnd.wav",
        "audio/wav",
        "audio/m4a",
        "audio/x-m4a"
      ]
    };
  },
  computed: {
    file: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    previewImage(file) {
      window.open(file.path || file.url || file, "_blank");
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (
          (this.type == "audio" && !newFile.type.includes("audio/")) ||
          (this.type == "video" && !newFile.type.includes("video/")) ||
          (this.type == "image" && !newFile.type.includes("image/"))
        ) {
          this.$toast.error("فرمت وارد شده صحیح نمیباشد");
          return prevent();
        }
      }
      if (
        newFile &&
        !oldFile &&
        newFile.size > Number(this.maxSize) * (1024 * 1024)
      ) {
        this.$toast.error(
          `سایز فایل بیشتر از حد مجاز(${Number(this.maxSize)} مگابایت)`
        );
        return prevent();
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = "";
        // newFile.is_main = 0;
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file);
        }
      }
    },
    checkDimensions(file) {
      var fr = new FileReader();
      fr.onload = function() {
        // file is loaded
        var img = new Image();
        img.onload = function() {
          this.inputRatio = (img.width / img.height).toFixed(2);
        };
        img.src = fr.result; // is the data URL because called with readAsDataURL
      };
      fr.readAsDataURL(file);
    },
    reset() {
      this.file = [];
    }
  }
};
</script>

<style lang="scss">
.upload-file-drag {
  width: 100%;
  padding: 10px;
  position: relative;
}
.upload-file-drag label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.__drop-active {
  border: 3px dashed #ccc;
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
.line-height {
  line-height: 2;
}
.main-pic-text {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: #ffb400;
  color: white;
  padding: 0px 31px;
  font-size: 12px;
}
.upload-file-drag .edit-image img {
  max-width: 100%;
}
.edit-image {
  min-height: 250px;
  max-height: 350px;
}
.v-file-input__text.v-file-input__text--placeholder {
  width: 100%;
  padding-right: 20px;
  justify-content: center;
  text-align: center;
}
.pointer:hover {
  cursor: pointer;
}
.upload_component div .v-input__slot fieldset {
  border: 3px solid;
}
</style>
