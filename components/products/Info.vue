<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''">
        راهنمای خرید &nbsp;
        <span class="primary--text">
          {{ item.name }}
        </span>
        <v-spacer></v-spacer>
        <v-icon :small="$vuetify.breakpoint.xsOnly" @click="dialog = false">
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text
        class="subtitle-2"
        :class="$vuetify.breakpoint.xsOnly ? 'caption' : ''"
        style="white-space: pre-line;"
      >
        {{ item.description }}
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          :small="$vuetify.breakpoint.xsOnly"
          color="info"
          class="px-10"
          @click="dialog = false"
        >
          بستن
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
