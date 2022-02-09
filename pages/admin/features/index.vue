<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="7" order="1" order-md="2" class="d-flex justify-end">
        <v-btn fab small color="primary" nuxt to="./features/0" class="white--text">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12" md="5" order="2" order-md="1">
        <b-text-field
          name="search"
          label="جستجو"
          id="id"
          v-model="search"
        ></b-text-field>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="features"
      class="elevation-1"
      show-select
      item-key="id"
      :loading="loading"
      :search="search"
      loader-height="2"
    >
    </v-data-table>
  </v-container>
</template>

<script>
import Upload from "@/components/Upload.vue";
import DeleteDialog from "@/components/admin/categories/Delete.vue";
import EditDialog from "@/components/admin/categories/Edit.vue";
export default {
  components: {
    Upload,
    DeleteDialog,
    EditDialog,
  },
  data() {
    return {
      features: [],
      headers: [
        {
          title: "نام",
          value: "name",
          sortable: true,
          align: "center",
        },
        {
          title: "قیمت",
          value: "price",
          sortable: true,
          align: "center",
        },
      ],
      search: null,
      loading: false,
    };
  },
  methods: {
    READ() {
      this.$try(async () => {
        const { result } = await this.$axios.$get("/api/features");
        this.features = result;
      }, this);
    },
  },
  mounted() {
    this.READ();
  },
};
</script>

<style lang="scss" scoped>
</style>