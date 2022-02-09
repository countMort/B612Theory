<template>
  <v-container>
    <v-progress-linear
      indeterminate
      height="2"
      v-if="loading"
    ></v-progress-linear>
    <v-select
      :items="statusItems"
      dense
      outlined
      v-model="status"
      style="max-width: 300px"
    />
    <v-card
      loader-height="2"
      :loading="loadings[order._id]"
      outlined
      v-for="order in orders"
      :key="order._id"
      class="mb-2"
    >
      <v-card-text class="font-weight-bold text-center">
        <v-row class="my-0 px-1">
          <v-col cols="7" md="2" class="d-flex align-center">
            <v-row
              :class="$vuetify.breakpoint.smAndDown && 'subtitle-2'"
              class="my-0 mx-0 justify-center"
            >
              زمان ثبت سفارش:&nbsp;
              <div>
                {{ order.createdTime | moment("jYYYY/jMM/jDD") | number }}
              </div>
              <br />
              شماره پیگیری:&nbsp;
              {{ order.trackingCode }}
              <v-textarea
                rows="2"
                v-show="order.status == 'posted'"
                :readonly="order._id != editingOrder._id"
                v-model="order.postCode"
                outlined
                hide-details
              ></v-textarea>
            </v-row>
          </v-col>
          <v-col cols="5" md="2" class="d-flex align-center">
            <v-row
              :class="$vuetify.breakpoint.smAndDown && 'subtitle-2'"
              class="my-0 mx-0 justify-center"
            >
              قیمت کل:&nbsp;
              <div>{{ order.totalPrice | number }} تومان</div>
              <v-chip class="mt-2" :color="showStatus(order.status).color">
                {{ showStatus(order.status).text }}
              </v-chip>
              <v-hover v-slot="{ hover }">
                <v-icon
                  :color="!hover && !order.note ? '' : 'error'"
                  @click="(notingOrder = order), (noteDialog = true)"
                >
                  mdi-script
                </v-icon>
              </v-hover>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            sm="4"
            md="3"
            class="d-flex align-center justify-center"
            :class="$vuetify.breakpoint.smAndDown && 'subtitle-2'"
          >
            <v-card
              class="px-5 align-center d-flex"
              style="height: 100%"
              outlined
              @click="showAddress(order)"
            >
              ارسال به:&nbsp;
              {{ order.deliverTo && order.deliverTo.fullName }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="8" md="5">
            <b-text-field
              :readonly="order._id != editingOrder._id"
              class="mb-2"
              label="کد پیگیری پرداخت"
              type="number"
              v-model="order.paymentCode"
            />
            <b-text-field
              :readonly="order._id != editingOrder._id"
              class="mb-2"
              label="چهار شماره آخر کارت"
              type="number"
              v-model="order.paymentCard"
            />
            <b-text-field
              readonly
              class="mb-2"
              label="تاریخ پرداخت"
              :value="
                order.paymentDate
                  ? $moment(order.paymentDate)
                      .locale('fa')
                      .format('jYYYY/jMM/jDD HH:mm')
                  : ''
              "
            />
            <v-select
              :disabled="editingOrder._id != order._id"
              label="وضعیت سفارش"
              :items="statusItems"
              v-model="order.status"
              outlined
              dense
              hide-details
            ></v-select>
            <v-btn
              class="mt-2"
              block
              small
              :color="
                editingOrder._id != order._id
                  ? 'info darken-2'
                  : 'primary darken-1'
              "
              @click="submit(order)"
            >
              {{
                editingOrder._id != order._id
                  ? "ویرایش سفارش"
                  : "تغییر وضعیت سفارش"
              }}
            </v-btn>
            <v-btn
              v-show="editingOrder._id == order._id"
              class="mt-2"
              block
              small
              @click="editingOrder = {}"
            >
              لغو ویرایش
            </v-btn>
            <v-btn
              class="error mt-2"
              block
              small
              @click="(deletingOrder = order), (deleteDialog = true)"
            >
              حذف سفارش
            </v-btn>
          </v-col>
        </v-row>
        <v-list class="py-0" style="width: 100%">
          <v-row class="my-0">
            <v-col
              v-for="product in order.products"
              :key="product._id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-list-item @click="dialogs(product)">
                <v-list-item-avatar size="60" tile class="ml-0">
                  <video
                    muted
                    style="max-width: 100%; max-height: 100%"
                    loop
                    autoplay
                    v-if="
                      product.category && product.category.value == 'diaryBook'
                    "
                    :src="product.files[0]"
                  ></video>
                  <voice-card-avatar
                    :unique-id="product._id"
                    :size="60"
                    v-else-if="
                      product.category && product.category.value == 'voiceCard'
                    "
                    :product="product"
                  >
                  </voice-card-avatar>
                  <v-img
                    v-else
                    :src="
                      product.photos && (product.photos[1] || product.photos[0])
                    "
                  >
                  </v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold links"
                    @click.stop.prevent
                  >
                    <nuxt-link
                      :to="`/remember-remember/${product.voiceCard._id}?password=000000`"
                      v-if="product.voiceCard"
                    >
                      {{ product.product && product.product.name }}
                    </nuxt-link>
                    <template v-else>
                      {{ product.product && product.product.name }}
                    </template>
                  </v-list-item-title>
                  <div class="subtitle-2">
                    {{ product.name }}
                  </div>
                  <v-list-item-subtitle>
                    تعداد:&nbsp;{{ product.quantity }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-list>
      </v-card-text>
    </v-card>
    <AddressDialog
      v-model="addressDialog"
      :order="showingOrder"
    ></AddressDialog>
    <voice-card v-model="voiceCardDialog" :item="selected.voiceCard" />
    <diary-book v-model="diaryBookDialog" :item="selected.diaryBook" />
    <polaroid v-model="polaroidDialog" :item="selected.polaroid" />
    <Delete
      @delete="deleteOrder(deletingOrder)"
      name="سفارش"
      :loading="loading"
      :item="deletingOrder"
      v-model="deleteDialog"
    ></Delete>
    <note v-model="noteDialog" :order="notingOrder" @updated="updateOrder" />
  </v-container>
</template>

<script>
import VoiceCardAvatar from "@/components/voice-card/VoiceCardAvatar.vue";
import VoiceCard from "@/components/admin/products/VoiceCard.vue";
import DiaryBook from "@/components/admin/products/DiaryBook.vue";
import Polaroid from "@/components/admin/products/Polaroid.vue";
import AddressDialog from "@/components/orders/AddressDialog.vue";
import Delete from "@/components/Delete.vue";
import Note from "@/components/orders/NoteDialog.vue";
export default {
  middleware: "auth",
  auth: "admin",
  components: {
    VoiceCardAvatar,
    AddressDialog,
    VoiceCard,
    DiaryBook,
    Polaroid,
    Delete,
    Note,
  },
  data() {
    return {
      orders: [],
      editingOrder: {},
      notingOrder: {},
      noteDialog: false,
      loading: false,
      loadings: {},
      addressDialog: false,
      showingOrder: {},
      selected: {},
      voiceCardDialog: false,
      polaroidDialog: false,
      diaryBookDialog: false,
      deletingOrder: {},
      deleteDialog: false,
      status: this.$route.query.status,
      statusItems: [
        {
          text: "پرداخت نشده",
          value: "empty",
          color: "yellow lighten-2",
        },
        {
          text: "در انتظار بررسی",
          value: "pending",
          color: "yellow darken-1",
        },
        {
          text: "در حال ساخت",
          value: "creating",
          color: "info lighten-2",
        },
        {
          text: "در حال ارسال",
          value: "sending",
          color: "info",
        },
        {
          text: "تحویل پست",
          value: "posted",
          color: "success lighten-2",
        },
        {
          text: "دریافت شده",
          value: "delivered",
          color: "success darken-2",
        },
        {
          text: "رد شده",
          value: "reject",
          color: "red",
        },
        {
          text: "همه",
          value: "",
        },
      ],
    };
  },
  watch: {
    status(newValue) {
      this.$router.push({ query: { status: newValue } });
    },
    $route() {
      this.READ();
    },
  },
  mounted() {
    this.READ();
  },
  methods: {
    READ(status) {
      this.$try(async () => {
        const { result } = await this.$axios.$get("/api/admin/orders", {
          params: {
            status: status || this.$route.query.status,
          },
        });
        this.orders = result;
      }, this);
    },
    showAddress(order) {
      this.addressDialog = true;
      this.showingOrder = order;
    },
    showStatus(status) {
      return this.statusItems.find((val) => val.value == status) || {};
    },
    dialogs(product) {
      this.selected = product;
      if (product.voiceCard) this.voiceCardDialog = true;
      if (product.polaroid) this.polaroidDialog = true;
      if (product.diaryBook) this.diaryBookDialog = true;
    },
    async submit(order) {
      try {
        if (this.editingOrder._id != order._id)
          return (this.editingOrder = { ...order });
        if (
          this.editingOrder.status == order.status &&
          this.editingOrder.postCode == order.postCode &&
          this.editingOrder.paymentCode == order.paymentCode &&
          this.editingOrder.paymentCard == order.paymentCard
        ) {
          return (this.editingOrder = {});
        }
        this.loadings[order._id] = true;
        let data = {
          status: order.status,
        };
        this.editingOrder.postCode == order.postCode
          ? ""
          : (data.postCode = order.postCode);
        let result = await this.$axios.$put(`/api/order/${order._id}`, data);
        this.$toast.success(result.message);
        this.loadings[order._id] = false;
        this.editingOrder = {};
        this.READ();
      } catch (error) {
        this.loadings[order._id] = false;
        console.log(error);
      }
    },
    deleteOrder(order) {
      this.$try(async () => {
        await this.$axios.$delete("/api/order/" + order._id);
        this.deleteDialog = false;
        this.READ();
      }, this);
    },
    updateOrder(updatedOrder) {
      let order = this.orders.find((order) => order._id == updatedOrder._id);
      if (order) order.note = updatedOrder.note;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>