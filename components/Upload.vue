<template>
  <div class="upload-file-drag upload_component">
    <v-row class="text-center justify-center my-0">
      <v-col
        v-if="file.length || filePath"
        class="py-0 text-right justify-start d-flex overflow-auto"
      >
        <v-img
          v-if="filePath"
          class="pointer my-auto fucking-width"
          @click="previewImage(filePath)"
          :src="filePath"
          contain
          max-height="120"
          max-width="100%"
        />
        <v-img
          v-else
          v-for="fil in file"
          :key="fil.id"
          class="pointer my-auto fucking-width mx-1"
          @click="previewImage(fil)"
          :src="fil.newUrl || fil.url"
          contain
          max-height="120"
          max-width="100%"
          min-width="30%"
          min-height="40"
        />
      </v-col>
      <v-col
        v-if="file.length || filePath"
        class="justify-center align-center d-flex"
        cols="auto"
      >
        <v-btn
          outlined
          v-if="file.length"
          @click="deleteAll"
          x-small
          class="red my-2 my-sm-auto"
        >
          <v-icon color="white" x-small>mdi-close</v-icon>
        </v-btn>
        <v-btn
          outlined
          v-else-if="filePath"
          @click="$emit('on-delete')"
          x-small
          class="red my-2 my-sm-auto"
        >
          <v-icon color="white" x-small>mdi-close</v-icon>
        </v-btn>
      </v-col>
      <v-col class="my-auto py-0" cols="12">
        <!-- :cols="!file.length && !filePath ? 12 : $vuetify.breakpoint.smAndUp ? 7 : 12" -->
        <v-row class="my-0 pointer" justify="center" v-if="!file.length && !filePath" @click.stop="openUpload">
          <v-col class="col-12 py-0" v-if="showIcon">
            <v-icon :size="mini ? 30 : 40" color="grey">
              mdi-image-plus
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
          <!-- accept="image/png,image/jpeg,image/webp,image/aces,image/avci,image/avcs,image/avif,image/bmp,image/cgm,image/emf,image/wmf" -->
          <FileUpload
            :drop="true"
            extensions="gif,jpg,jpeg,png,webp,wmf,aces,avci,avcs,avif,bmp,cgm,emf"
            accept="image/*"
            class="full-width"
            v-model="file"
            :ref="`upload${num}`"
            :input-id="num.toString()"
            @input-file="inputFile"
            @input-filter="inputFilter"
            :multiple="multiple"
          >
            <v-file-input
              outlined
              dense
              prepend-icon
              :value="file"
              append-icon="mdi-cloud-upload-outline"
              class="_text _input mt-1"
              :multiple="multiple"
              clear-icon=""
              :dark="dark"
            >
              <!-- <template v-slot:append>
                <v-icon class="pl-5 pr-3 pb-2">
                  mdi-cloud-upload-outline
                </v-icon>
              </template> -->
            </v-file-input>
          </FileUpload>
        </client-only>
      </v-col>
    </v-row>
    <!-- Dialog -->
    <v-dialog
      @click:outside="closeEditDialog()"
      v-model="edit"
      min-width="300"
      max-width="600"
      persistent
    >
      <v-card class="ma-0 pa-0">
        <v-card-title class="body-1">
          آپلود تصویر &nbsp;
          <span class="red--text">
            {{ aspect_ratio }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click.prevent="closeEditDialog()">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-5">
          <div class="edit-image" v-if="file.length">
            <img
              ref="editImage"
              :src="editingFile && editingFile.url"
            />
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-space-around">
          <slot name="action"></slot>
          <v-btn
            @click.prevent="editSave()"
            color="primary"
            small
            dark
            class="px-4"
          >
            <v-icon left>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
if (process.client) {
  var Cropper = require("cropperjs");
  var FileUpload = require("vue-upload-component");
}

let queue = null;
export default {
  components: {
    FileUpload
  },
  props: {
    rules: {
      type: Array
    },
    filePath: {
      type: String
    },
    mini: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    num: {
      type: Number,
      default: 1
    },
    aspect_ratio: {
      type: String
    },
    forceAspect: Boolean,
    value: {
      type: Array,
      default: () => []
    },
    dark: Boolean,
    showIcon: {
      type: Boolean,
      default: true
    },
    multiple: Boolean
  },
  data() {
    return {
      loading: false,
      seller_barcode: null,
      index: 0,
      edit: false,
      cropper: false,
      editingFileIndex: 0,
      editingFile: null,
      editingSingleFile: false
    };
  },
  watch: {
    edit(value) {
      this.$emit("cropping", value);
      if (value) {
        this.$nextTick(function() {
          if (!this.$refs.editImage) {
            return;
          }
          let cropper = new Cropper(this.$refs.editImage, {
            viewMode: 0,
            autoCropArea: 1,
            aspectRatio: this.forceAspect ? this.aspectRatio.ratio : "",
            background: false,
            fillColor: "#fff",
            imageSmoothingEnabled: true,
            maxWidth: 3072,
            maxHeight: 3072,
            imageSmoothingQuality: "high"
          });
          this.cropper = cropper;
        });
      } else {
        if (this.cropper) {
          this.cropper.destroy();
          this.cropper = false;
        }
      }
    },
    aspectRatio(nv) {
      if (this.cropper) this.cropper.setAspectRatio(nv.ratio);
    }
  },
  computed: {
    aspectRatio() {
      if (this.aspect_ratio) {
        const dimensions = this.aspect_ratio.split("*");
        dimensions.forEach(item => {
          item = Number(item);
        });
        return {
          ratio: (dimensions[0] / dimensions[1]).toFixed(2),
          isValid: (dimensions[0] / dimensions[1]).toFixed(2) == this.inputRatio
        };
      } else {
        return 0;
      }
    },
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
    openUpload() {
      document.getElementById(this.num.toString()).click()
    },
    deleteAll() {
      this.remove(0)
      if (this.file.length) {
        this.$nextTick(this.deleteAll)
      }
    },
    previewImage(file) {
      window.open(file.newUrl || file.url || file, "_blank");
    },
    /**
     * @param editing tell if we are editing one single photo after we've done inputing and editing at the first time
     */
    closeEditDialog(editing = this.editingSingleFile) {
      if (!editing) this.$refs[`upload${this.num}`].remove(this.editingFile);
      this.edit = false;
      if (!editing) this.file.splice(this.editingFileIndex);
      if (editing) this.editingSingleFile = false
    },
    editSave() {
      const oldFile = this.editingFile;
      const binStr = atob(
        this.cropper
          .getCroppedCanvas({ fillColor: "#fff" })
          .toDataURL(oldFile.type)
          .split(",")[1]
      );
      const arr = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i);
      }
      const newFile = new File([arr], oldFile.name, { type: oldFile.type });
      const newConfig = {
        ...oldFile,
        newFile,
        newType: newFile.type,
        newSize: newFile.size,
        is_new: true
      };
      this.$refs[`upload${this.num}`].update(oldFile.id, newConfig);
      this.$emit("cropped", { file: newConfig, index: this.editingFileIndex });
      if (!this.editingSingleFile && this.editingFileIndex === this.file.length - 1) {
        this.edit = false;
        this.editingFileIndex++;
        return;
      } else if (this.editingSingleFile) {
        this.editingSingleFile = false
        this.edit = false;
        return
      } else {
        this.editingFileIndex++;
        const editingFile = this.file[this.editingFileIndex]
        this.openEditDialog(editingFile);
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (
          !/\.(jpg|jpeg|png|webp|wmf|aces|avci|avcs|avif|bmp|cgm|emf)$/i.test(
            newFile.name
          )
        ) {
          this.$emit("setSnack", {
            text: "فرمت وارد شده صحیح نمیباشد",
            color: "red"
          });
          return prevent();
        }
      }
      if (
        newFile &&
        (!oldFile || newFile.file !== oldFile.file || newFile.is_new || newFile.newFile !== oldFile.newFile)
      ) {
        if (!newFile.url) newFile.url = "";
        if (!newFile.newUrl) newFile.newUrl = "";
        // newFile.is_main = 0;
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          if (newFile.is_new)
            newFile.newUrl = URL.createObjectURL(newFile.newFile);
          else newFile.url = URL.createObjectURL(newFile.file);
        }
      }
    },
    inputFile(newFile, oldFile) {
      // this.uploadFile(newFile, oldFile);
      if (newFile && !oldFile) {
        this.openEditDialog();
      }
    },
    remove(index) {
      this.file.splice(this.file[index], 1);
      this.editingFileIndex--;
      this.$refs[`upload${this.num}`].remove(this.file[index]);
    },
    checkDimensions(file) {
      const fr = new FileReader();
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
    openEditDialog(editingFile) {
      clearTimeout(queue);
      if (this.edit) this.edit = false;
      queue = setTimeout(() => {
        editingFile = editingFile || this.file[this.editingFileIndex]
        this.editingFile = editingFile
        this.edit = true;
      }, 400);
    },
    editSingleFile(file) {
      this.editingSingleFile = true
      this.openEditDialog(file)
    }
  }
};
</script>

<style lang="scss">
.fucking-width {
  .v-responsive__content {
    width: initial !important;
  }
}
.upload-file-drag {
  width: 100%;
  position: relative;
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
.upload_component div .v-input__slot fieldset {
  border: 3px solid black;
}
</style>
