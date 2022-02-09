<template>
  <div>
    <v-row class="my-0">
      <v-col cols="12" sm="6">
        <v-card flat>
          <v-card-title
            class="justify-center"
            :class="$vuetify.breakpoint.xsOnly && 'subtitle-2'"
          >
            اضافه کردن دسته‌بندی محصول
          </v-card-title>
          <v-card-text class="mt-5 px-md-10">
            <v-form ref="form">
              <v-row class="my-0 align-center">
                <v-col md="6" cols="12">
                  <b-text-field
                    label="نوع"
                    :rules="notEmpty"
                    v-model="data.name"
                    @keydown.enter.prevent="CREATE"
                  ></b-text-field>
                </v-col>
                <v-col md="6" cols="12">
                  <b-text-field
                    dir="ltr"
                    label="نام متغیر در سرور"
                    :rules="notEmpty"
                    v-model="data.value"
                    @keydown.enter.prevent="CREATE"
                  ></b-text-field>
                </v-col>
                <v-col cols="12">
                  <client-only>
                    <upload v-model="file" :num="1" mini />
                  </client-only>
                  <b-uploader ref="uploader"></b-uploader>
                </v-col>
              </v-row>
              <v-row class="my-0 justify-space-around">
                <v-btn :loading="loading" class="primary px-8" @click="CREATE">
                  ثبت
                </v-btn>
                <v-btn @click="clear">
                  پاک کردن
                </v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card flat>
          <v-list>
            <v-subheader>
              انواع دسته‌بندی‌های ثبت شده
            </v-subheader>
            <v-list-item
              v-for="category in categories"
              :key="category._id"
              dense
            >
              <v-list-item-avatar tile>
                <img :src="category.photos[0]" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ category.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  @click="
                    selected = category;
                    editDialog = true;
                  "
                  small
                  icon
                >
                  <v-icon small>
                    mdi-pencil
                  </v-icon>
                </v-btn>
                <v-btn
                  icon
                  @click="
                    deleteDialog = true;
                    selected = category;
                  "
                  color="red"
                  small
                >
                  <v-icon small>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <delete-dialog
      @delete="DELETE"
      :loading="loading"
      v-model="deleteDialog"
      :item="selected"
    ></delete-dialog>
    <edit-dialog
      v-model="editDialog"
      :item="selected"
      @update="UPDATE"
    ></edit-dialog>
  </div>
</template>

<script>
import Upload from "@/components/Upload.vue";
import DeleteDialog from "@/components/admin/categories/Delete.vue";
import EditDialog from "@/components/admin/categories/Edit.vue";
export default {
  components: {
    Upload,
    DeleteDialog,
    EditDialog
  },
  async asyncData({ $axios }) {
    try {
      let { result } = await $axios.$get("/api/categories");
      return {
        categories: result
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      data: {
        name: "",
        value: "",
        photos: []
      },
      notEmpty: [v => !!v || ""],
      loading: false,
      file: [],
      deleteDialog: false,
      selected: {},
      editDialog: false
    };
  },
  methods: {
    async CREATE() {
      try {
        if (this.$refs.form.validate()) {
          this.loading = true;
          let data = { ...this.data };
          if (this.file[0]) {
            const response = await this.$refs.uploader.upload(
              this.file[0].newFile,
              "admin"
            );
            data.photos[0] = response.info.url;
          }
          let result = await this.$axios.$post("/api/categories", data);
          this.loading = false;
          if (result.success) {
            this.categories.push(data);
            this.$toast.success(result.message);
          }
        }
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    async UPDATE(data) {
      try {
        this.loading = true;
        let result = await this.$axios.$put(
          `/api/categories/${data._id}`,
          data
        );
        this.loading = false;
        if (result.success) {
          this.categories.forEach(cat => {
            if (cat._id == data._id) cat = data;
          });
          this.editDialog = false;
          this.$toast.success(result.message);
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async DELETE(id) {
      try {
        this.loading = true;
        const response = await this.$axios.$delete(`/api/categories/${id}`);
        this.$toast.success(response.message);
        this.deleteDialog = false;
        this.categories.splice(
          this.categories.find(cat => cat._id == id),
          1
        );
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    clear() {
      this.data = {
        name: "",
        photos: []
      };
      this.file = [];
      this.$refs.form.resetValidation();
    }
  }
};
</script>

<style scoped>
.select {
  width: 100%;
  border: black 1px solid;
  border-radius: 30%;
}
</style>
