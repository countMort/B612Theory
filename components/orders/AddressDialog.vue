<template>
  <v-dialog v-model="dialog" scrollable max-width="700">
    <v-card>
      <v-list dense>
        <v-list-item
          :class="$vuetify.breakpoint.xsOnly ? 'caption' : 'subtitle-2'"
          v-for="item in list"
          :key="item"
        >
          <v-list-item-content class="py-0 justify-center text-center d-inline" v-html="item" />
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    order: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    list() {
      let ad = this.order.deliverTo;
      if (!ad) return;
      const shipmentType = this.order.shipment.name
      ad =
        Object.values(ad).length > 0
          ? [
              `${ad.province}-${ad.city}-${ad.streetAddress}`,
              `${ad.fullName} - 0${ad.phoneNumber}`,
              `کدپستی: ${ad.zipCode}-کد سفارش: ${this.order.trackingCode}`,
              `پست ${shipmentType == 'پیشتاز' ? shipmentType : `<v-chip color="error">${shipmentType}</v-chip>`}`,
            ]
          : [];
      if (this.order.deliverInstructions)
        ad.push(`توضیحات: ${this.order.deliverInstructions}`);
      return ad;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>