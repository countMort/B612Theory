<template>
    <v-container>
            <div class="title">
                سفارشات شما
            </div>
            <v-card
            loader-height="2"
            :loading="editingOrder._id == order._id && loading"
            outlined
            v-for="order in orders"
            :key="order._id"
            class="mb-2"
            >
                <v-card-text class="font-weight-bold text-center">
                    <v-row class="px-1">
                        <v-col cols=7 md=2 class="align-center d-flex caption font-weight-bold">
                            <v-row :class="$vuetify.breakpoint.smAndDown && 'subtitle-2'" class="my-0 mx-0 justify-center">
                                زمان ثبت سفارش:&nbsp;
                                <div class="mb-2">
                                    {{ order.createdTime | moment("jYYYY/jMM/jDD") | number}}
                                </div>
                                شماره سفارش:&nbsp;
                                {{ order.trackingCode }}
                                <br>
                                <v-chip class="mt-2" small :color="showStatus(order.status).color">
                                    {{ showStatus(order.status).text }}
                                </v-chip>
                            </v-row>
                        </v-col>
                        <v-col cols=5 md=2 class="d-flex align-center">
                            <v-row :class="$vuetify.breakpoint.smAndDown && 'subtitle-2'" class="my-0 mx-0 justify-center">
                                قیمت کل
                                <v-chip>
                                    {{order.totalPrice | number}} تومان
                                </v-chip>
                            </v-row>
                        </v-col>
                        <v-col cols=12 sm=4 md=3 class="d-flex align-center justify-center" :class="$vuetify.breakpoint.smAndDown && 'subtitle-2'">
                            <v-card class="px-5 align-center d-flex" style="height: 100%;" outlined @click="showAddress(order)">
                                ارسال به:&nbsp;
                                {{order.deliverTo && order.deliverTo.fullName}}
                            </v-card>
                        </v-col>
                        <v-col cols=12 sm=8 md=5>
                            <client-only>
                                <template v-if="order.status == 'verified'">
                                    تخمین زمان دریافت:&nbsp;
                                    <span id="estimatedDelivery">
                                        {{order.estimatedDelivery | moment("jDD/jMM/jYYYY") }}
                                    </span>
                                </template>
                                <template v-else>
                                    <v-form
                                    :ref="order._id"
                                    :disabled="order.status !== 'empty' && editingOrder._id !== order._id">
                                        <b-text-field
                                        class="mb-2"
                                        label="کد پیگیری پرداخت"
                                        type="number"
                                        :rules="notEmpty"
                                        v-model="order.paymentCode"
                                        @keydown.enter.prevent="submit(order)"
                                        @click:append="submit(order)"
                                        />
                                        <v-row class="my-0">
                                            <v-col cols="12" sm="6" class="pb-0">
                                                <b-text-field
                                                class="mb-2"
                                                label="چهار شماره آخر کارت"
                                                type="number"
                                                :rules="cardRules"
                                                v-model="order.paymentCard"
                                                @keydown.enter.prevent="submit(order)"
                                                @click:append="submit(order)"
                                                />
                                            </v-col>
                                            <v-col cols="12" sm="6">
                                                <b-text-field
                                                    :id="`date${order._id}`"
                                                    class="_input _text"
                                                    readonly
                                                    label="زمان واریز"
                                                    :rules="notEmpty"
                                                    :value="
                                                    order.paymentDate
                                                        ? $moment(order.paymentDate).format(
                                                            'jYYYY/jMM/jDD HH:mm'
                                                        )
                                                        : ''
                                                    "
                                                    @click="toggleShow(order)"
                                                />
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                    <v-btn
                                    v-if="['empty', 'pending', 'reject'].indexOf(order.status) > -1"
                                    @click="submit(order)"
                                    block
                                    small
                                    :class="(editingOrder._id == order._id || order.status == 'empty') ? 'primary' : 'info'"
                                    >
                                    {{ (order.status == 'empty' || editingOrder._id == order._id) ?
                                        'ثبت اطلاعات برای بررسی' :
                                        'ویرایش اطلاعات'
                                    }}
                                    </v-btn>
                                    <v-btn small class="mt-2" @click="paymentDialog = true" block color="info darken-3">
                                        روش پرداخت
                                    </v-btn>
                                    <v-btn v-if="['empty', 'pending'].indexOf(order.status) > -1" class="error mt-2" block small @click="deletingOrder = order, deleteDialog = true">
                                        حذف سفارش
                                    </v-btn>
                                </template>
                            </client-only>
                        </v-col>
                    </v-row>
                    <v-list class="py-0" style="width:100%">
                        <v-row class="my-0">
                            <v-col
                            v-for="product in order.products"
                            :key="product._id"
                            cols="12"
                            sm="6"
                            md="4">
                                <v-list-item>
                                    <v-list-item-avatar
                                    size="60"
                                    tile
                                    class="ml-0"
                                    >
                                        <video
                                        muted
                                        style="max-width: 100%; max-height: 100%;"
                                        loop
                                        autoplay
                                        v-if="product.category && product.category.value == 'diaryBook'"
                                        :src="product.files[0]"
                                        ></video>
                                        <voice-card-avatar
                                        :unique-id="product._id"
                                        :size="60"
                                        v-else-if="product.category && product.category.value == 'voiceCard'"
                                        :product="product">
                                        </voice-card-avatar>
                                        <v-img v-else :src="product.photos && (product.photos[1] || product.photos[0])">
                                        </v-img>
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            <nuxt-link
                                            :to="`/products/${product.product && product.product._id}`"
                                            class="font-weight-bold links"
                                            >
                                                {{product.product && product.product.name}}
                                                &nbsp;
                                            </nuxt-link>
                                        </v-list-item-title>
                                        <div class="subtitle-2">
                                            {{product.name}}
                                        </div>
                                        <v-list-item-subtitle>
                                            تعداد:&nbsp;{{product.quantity}}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-col>
                        </v-row>
                    </v-list>
                </v-card-text>
            </v-card>
        <client-only>
            <date-picker
            :element="`date${editingOrder._id}`"
            inputFormat="YYYY/MM/DD HH:mm"
            format="YYYY/MM/DD HH:mm"
            v-model="editingOrder.paymentDate"
            dense
            type="datetime"
            :show="showDate"
            @close="
                showDate = false;
            "
            ></date-picker>
        </client-only>
        <v-overlay v-model="paymentDialog" max-width=500>
            <v-card max-width=500>
                <v-card-title class="py-1">
                    روش پرداخت
                </v-card-title>
                <v-card-text class="subtitle-2 text-center">
                    لطفا پس از ثبت سفارش، هزینه نهایی را به شماره کارت
                    <v-btn
                    v-clipboard:copy = '6037697602717826'
                    v-clipboard:success="onCopy"
                    block
                    outlined
                    >
                        6037697602717826
                        <v-spacer></v-spacer>
                        <v-icon>
                            mdi-content-copy
                        </v-icon>
                    </v-btn>
                    به نام
                    <b>
                        سجاد ایزدی و زهرا لطفی
                    </b>
                    ،
                    بانک صادرات
                    واریز کنید و اطلاعات پرداخت را در بخش اطلاعات سفارش وارد کنید. سفارش شما پس از تایید حداکثر پس از 4 روز کاری تحویل شرکت پست می‌شود.
                    پس از پرداخت و ثبت اطلاعات واریزی پیامک تایید را نهایتا تا یک روز کاری دریافت خواهید کرد
                </v-card-text>
                <v-card-actions>
                    <v-btn class="mb-2" small color="info darken-3" block @click="paymentDialog = false">
                        متوجه شدم
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-overlay>
        <address-dialog
        v-model="addressDialog"
        :order="showingOrder"
        ></address-dialog>
        <Delete @delete="deleteOrder(deletingOrder)" :name='`سفارش ${deletingOrder.trackingCode}`' :loading="loading" :item="deletingOrder" v-model="deleteDialog"></Delete>
    </v-container>
</template>

<script>
import VoiceCardAvatar from "@/components/voice-card/VoiceCardAvatar"
import AddressDialog from "@/components/orders/AddressDialog"
import Delete from "@/components/Delete.vue"
export default {
    components: {
        VoiceCardAvatar,
        AddressDialog,
        Delete
    },
    async asyncData({$axios}) {
        try {
            let response = await $axios.$get("/api/orders")
            if(response.success) {
                let orders = response.orders.reverse()
                return {
                    orders,
                }
            }
        } catch (error) {
            console.log(error);
        }
    },
    data() {
        return {
            loading: false,
            editingOrder: {},
            deletingOrder: {},
            deleteDialog: false,
            notEmpty: [
                v => !!v || ""
            ],
            cardRules: [
                v => !!v || "",
                v => !v || v.toString().length == 4 || ""
            ],
            showDate: false,
            paymentDialog: false,
            addressDialog: false,
            showingOrder: {},
            statusItems: [
                {
                    text: 'پرداخت نشده',
                    value: 'empty',
                    color: 'yellow lighten-2'
                },
                {
                    text: 'در انتظار بررسی',
                    value: 'pending',
                    color: 'yellow darken-1'
                },
                {
                    text: 'در حال ساخت',
                    value: 'creating',
                    color: 'info lighten-2'
                },
                {
                    text: 'در حال ارسال',
                    value: 'sending',
                    color: 'info'
                },
                {
                    text: 'تحویل پست',
                    value: 'posted',
                    color: 'success lighten-2'
                },
                {
                    text: 'دریافت شده',
                    value: 'delivered',
                    color: 'success darken-2'
                },
                {
                    text: 'رد شده',
                    value: 'reject',
                    color: 'red'
                },
                {
                    text: 'همه',
                    value: ''
                },
            ]
        }
    },
    methods: {
        submit(order) {
            if (order.status !== 'empty' && this.editingOrder._id != order._id) {
                this.editingOrder = {...order}
                return
            }
            // else if (
            //     this.editingOrder.paymentCode == order.paymentCode &&
            //     this.editingOrder.paymentCard == order.paymentCard &&
            //     this.editingOrder.paymentDate == order.paymentDate
            // ) {
            //     this.editingOrder = {}
            //     return
            // }
            if (this.$refs[order._id][0].validate()) {
                this.sendPayment(order)
            }
        },
        showStatus(status) {
            return this.statusItems.find(val => val.value == status) || {}
        },
        showAddress(order) {
            this.addressDialog = true
            this.showingOrder = order
        },
        sendPayment(order) {
            this.$try(async ()=> {
                let data = {
                    paymentCode: order.paymentCode,
                    paymentCard: order.paymentCard,
                    paymentDate: order.paymentDate
                }
                await this.$axios.$put(`/api/order/${order._id}`, data)
                this.$toast.success('اطلاعات پرداخت با موفقیت ثبت شد')
                order.status = 'pending'
                this.editingOrder = {}
            }, this)
        },
        toggleShow(order) {
            this.editingOrder = order
            this.showDate = true
        },
        onCopy() {
            this.$toast.success("شماره کارت در حافظه دستگاه کپی شد")
        },
        deleteOrder(order) {
            this.$try(async ()=> {
                await this.$axios.$delete('/api/order/' + order._id)
                this.deleteDialog = false
                let response = await this.$axios.$get("/api/orders")
                this.orders = response.orders.reverse()
            }, this)
        }
    },
}
</script>

<style scoped>
.links {
    text-decoration: none;
}
#card-title {
    font-size: 1rem;
}
#estimatedDelivery {
    font-size: 0.95rem;
}
</style>