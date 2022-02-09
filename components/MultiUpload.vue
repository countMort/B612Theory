<template>
    <div class="upload-file-drag">
        <slot name="label">
            {{label}}
        </slot>
        <v-row v-for="file in files" :key="file" class="text-center justify-center my-0">
            <v-col
            v-if="file[0] || filePath"
            class="pt-0 relative px-0 text-right justify-start d-flex"
            :cols="$vuetify.breakpoint.smAndUp ? 3 : 12"
            >
                <v-img
                class="pointer my-auto"
                @click="previewImage(file[0] || filePath)"
                :src="file[0] ? (file[0].url || file[0].path) : filePath"
                contain
                max-height="120"
                />
                <!-- <v-btn @click="previewImage(file)" small icon color="grey">
                    <v-icon size="17">mdi-image-search-outline</v-icon>
                </v-btn> -->
            </v-col>
            <v-col
            v-if="file[0] || filePath"
            class="justify-center text-center my-auto mx-auto px-0 py-0"
            :cols="$vuetify.breakpoint.smAndUp ? 2 : 12">
                <!-- <v-tooltip top v-if="file[0] && aspectRatio && !aspectRatio.isValid">
                    <template v-slot:activator="{on , attrs}">
                        <v-icon v-on="on" v-bind="attrs" color="primary">
                            mdi-alert-outline
                        </v-icon>
                    </template>
                    <span>
                        ابعاد فایل وارد شده با ابعاد قالب یکسان نیست. این ممکن است باعث به‌هم‌ریختگی سایت شما شود.
                    </span>
                </v-tooltip> -->
                <v-btn
                outlined
                v-if="file[0]"
                @click="file = []"
                x-small
                icon
                color="red">
                    <v-icon x-small>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                outlined
                v-else-if="filePath"
                @click="$emit('on-delete')"
                x-small
                icon
                color="red">
                    <v-icon x-small>mdi-delete</v-icon>
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="my-0">
            <v-col class="my-auto py-0">
                <v-row class="my-0" justify="center" v-if="!file[0] && !filePath">
                    <v-col class="col-12 py-0">
                        <v-icon :size="mini ? 30 : 40" color="grey">mdi-image-plus</v-icon>
                    </v-col>
                    <v-col class="col-12 text-center py-0 grey--text" :class="mini ? 'subtitle-2' : 'title'">
                        فایل خود را بکشید و اینجا رها کنید
                    </v-col>
                    <v-col class="col-12 text-center py-0 grey--text" :class="mini ? 'subtitle-2' : 'title'">
                        یا
                    </v-col>
                </v-row>
                <file-upload
                :drop="true"
                extensions="gif,jpg,jpeg,png,webp"
                accept="image/png, image/jpeg, image/webp"
                class="full-width"
                v-model="file"
                :ref="`upload${num}`"
                :input-id="num.toString()"
                @input-file="inputFile"
                @input-filter="inputFilter"
                :multiple='false'
                >
                    <v-file-input
                        outlined
                        dense
                        :rules="rules"
                        prepend-icon
                        hide-details
                        :value="file[0]"
                        append-icon="mdi-cloud-upload-outline"
                        class="_text _input mt-1"
                        clear-icon=""
                        placeholder="از دستگاه خود انتخاب کنید"
                    >
                    </v-file-input>
                </file-upload>
            </v-col>
        </v-row>
        <!-- Dialog -->
        <v-dialog @click:outside="closeEditDialog()" v-model="edit" width="600" persistent>
        <v-card class="ma-0 pa-0">
            <v-card-title class="body-1">
            آپلود تصویر
            &nbsp;
            <span class="red--text">
                {{aspect_ratio}}
            </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click.prevent="closeEditDialog()">
                <v-icon size="18">mdi-close</v-icon>
            </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-5">
            <div class="edit-image" v-if="file.length">
                <img ref="editImage" :src="file[file.length - 1].url" />
            </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="justify-center">
            <v-btn
                @click.prevent="editSave"
                color="primary"
                rounded
                small
                dark
                class="px-7"
            >
                <v-icon left>mdi-check</v-icon>تایید
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import "cropperjs/dist/cropper.css";
    import Cropper from "cropperjs";
    import FileUpload from "vue-upload-component";

    export default {
    props: {
        rules: {
            type: Array
        } ,
        filePath: {
            type: String
        } ,
        mini: {
            type: Boolean ,
            default: false
        } ,
        label: {
            type: String
        } ,
        num: {
            type: Number ,
            default: 1
        } ,
        aspect_ratio: {
            type: String ,
        } ,
        forceAspect: Boolean,
        value: Array,
    },
    components: {
        FileUpload,
    },
    data() {
        return {
        loading: false,
        seller_barcode: null,
        index: 0,
        filesToRemove: [],
        edit: false,
        cropper: false,
        };
    },
    watch: {
        edit(value) {
            if (value) {
                this.$nextTick(function () {
                if (!this.$refs.editImage) {
                    return;
                }
                let cropper = new Cropper(this.$refs.editImage, {
                    viewMode: 0,
                    autoCropArea: this.forceAspect ? this.aspectRatio.ratio : '',
                    aspectRatio: this.forceAspect ? this.aspectRatio.ratio : '',
                    background: false,
                    fillColor: 'white',
                    imageSmoothingEnabled: true,
                    maxWidth: 3072,
                    maxHeight: 3072,
                    imageSmoothingQuality: 'high'
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
    },
    computed: {
        aspectRatio() {
            if(this.aspect_ratio) {
                let dimensions = this.aspect_ratio.split('*')
                dimensions.forEach((item) => {
                    item = Number(item)
                })
                return {
                    ratio: (dimensions[0]/dimensions[1]).toFixed(2),
                    isValid: (dimensions[0]/dimensions[1]).toFixed(2) == this.inputRatio
                }
            } else {
                return 0
            }
        },
        file: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
    methods: {
        previewImage(file) {
            window.open(file.path || file.url || file, "_blank");
        },
        closeEditDialog() {
            this.$refs[`upload${this.num}`].remove(this.file[this.file.length - 1]);
            this.edit = false;
        },
        editSave() {
            let oldFile = this.file[this.file.length - 1];
            let binStr = atob(
                this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(",")[1]
            );
            let arr = new Uint8Array(binStr.length);
            for (let i = 0; i < binStr.length; i++) {
                arr[i] = binStr.charCodeAt(i);
            }
            let file = new File([arr], oldFile.name, { type: oldFile.type });
            this.$refs[`upload${this.num}`].update(oldFile.id, {
                file,
                type: file.type,
                size: file.size,
                is_new: true,
            });
            this.edit = false;
        },
        inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
            if (!/\.(jpg|jpeg|png)$/i.test(newFile.name)) {
            this.$emit("setSnack", {
                text: "فرمت وارد شده صحیح نمیباشد",
                color: "red",
            });
            return prevent();
            }
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
        inputFile(newFile, oldFile) {
        // this.uploadFile(newFile, oldFile);
        if (newFile && !oldFile) {
            this.$nextTick(function () {
            this.edit = true;
            });
        }
        },
        doUpload() {
        // var findIsMain = this.files.find((o) => o.is_main == 1);
        for (let i = 0; i < this.file.length; i++) {
            const file = this.file[i];
            // if (!findIsMain) {
            // setTimeout(() => {
            //     this.files[0].is_main = 1;
            // }, 100);
            // }
            setTimeout(() => {
            this.$refs[`upload${this.num}`].update(file, {
                active: true,
            });
            // this.$refs.upload.active = true;
            });
            // if (this.files.length == i) {
            //   this.removeGallery();
            // }
        }
        },
        remove(file, i) {
        if (file.path) {
            this.filesToRemove.push(file);
            this.file.splice(file, 1);
            return;
        }

        this.$refs[`upload${this.num}`].remove(file);
        },
        checkDimensions(file) {
            var fr = new FileReader;
            fr.onload = function() { // file is loaded
                var img = new Image;
                img.onload = function() {
                    this.inputRatio = (img.width/img.height).toFixed(2)
                };
                img.src = fr.result; // is the data URL because called with readAsDataURL
            };
            fr.readAsDataURL(file);
        } ,
    },
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
</style>
