<template>
    <v-container fluid>
        <v-row class="my-0">
            <v-col cols=12 sm=8>
                <v-card outlined>
                    <v-card-title>
                        مشاهده سفارش
                    </v-card-title>
                    <v-card-text>
                        <v-row class="my-0">
                            <v-col cols=12 sm=6>
                                <div class="font-weight-bold">آدرس ارسال&nbsp;<v-btn nuxt to="/address" text color="primary">تغییر</v-btn></div>
                                <v-divider></v-divider>
                                <template v-if="!$store.state.auth.user.address">
                                    <v-btn @click="redirect" color=red text>لطفا آدرس خود را ثبت کنید.</v-btn>
                                </template>
                                <template v-if="$store.state.auth.user.address">
                                    {{$store.state.auth.user.address.fullName}}
                                    <br>
                                    {{$store.state.auth.user.address.city}}
                                    <br>
                                    {{$store.state.auth.user.address.streetAddress}}
                                    <br>
                                    تلفن:&nbsp;{{$store.state.auth.user.address.phoneNumber}}
                                </template>
                            </v-col>
                            <v-col cols=12 sm=6>
                                <div class="font-weight-bold">روش پرداخت&nbsp;<v-btn  disabled text color="primary">تغییر</v-btn></div>
                                <v-divider></v-divider>
                                <v-radio-group dense v-model="paymentMethod">
                                    <v-radio
                                        class="text-right"
                                        label="حضوری (نقدی-کارت)"
                                        :value="1"
                                        disabled
                                    ></v-radio>
                                    <v-radio
                                        class="text-right"
                                        label="کارت به کارت"
                                        :value="2"
                                    >
                                    </v-radio>
                                </v-radio-group> 
                                <v-divider class="mt-1"></v-divider>
                                <div class="font-weight-bold">آدرس محل پرداخت&nbsp;
                                    <v-btn disabled text color="primary">تغییر</v-btn>
                                </div>
                                سایت
                            </v-col>
                            <v-col v-if="off" cols=12 sm=6 md=4 class="mx-auto">
                                <v-text-field
                                    name="کد تخفیف"
                                    label="کد تخفیف"
                                    outlined
                                    class="mt-2 indigo--text"
                                    dense
                                ></v-text-field>
                                <!-- در صورت وجود کد تخفیف -->
                                <div class="font-weight-bold primary--text">
                                    <v-icon>mdi-currency-usd-off</v-icon>&nbsp;مبلغ کسر شده
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card outlined class="mt-1">
                    <v-row class="my-0">
                        <v-col cols=12 sm=6 class="pt-0 my-0">
                            <v-card-title id="card-title" class="pt-1 pb-0 my-0">
                                تخمین زمان دریافت:&nbsp;
                                <!-- <div id="estimatedDelivery">{{estimatedDelivery}}</div> -->
                                <span class="caption">
                                    تا یک هفته بعد از تایید پرداخت سفارش
                                </span>
                            </v-card-title>
                            <v-divider class="mt-1"></v-divider>
                            <v-card-text>
                                <v-list>
                                    <v-list-item v-for="product in getCart" :key="product.id">
                                        <v-list-item-avatar
                                        :size="60"
                                        tile
                                        >
                                        <video
                                        muted
                                        style="max-width: 100%; max-height: 100%;"
                                        loop
                                        autoplay
                                        v-if="product.diaryBook" :src="product.files[0]"
                                        ></video>
                                        <voice-card-avatar
                                        :size="60"
                                        v-else-if="product.voiceCard"
                                        :product="product"
                                        />
                                        <v-img v-else :src="product.photos && (product.photos[1] || product.photos[0])">
                                        </v-img>
                                        </v-list-item-avatar>
                                        <v-list-item-content>
                                            <v-list-item-title>
                                                <nuxt-link :to="`/products/${product._id}`" class="font-weight-bold links">&nbsp;{{product.name}}</nuxt-link>
                                            </v-list-item-title>
                                            <v-list-item-subtitle>
                                                تعداد سفارش:&nbsp;{{product.quantity}}
                                            </v-list-item-subtitle>
                                        </v-list-item-content>
                                        <!-- <v-textarea shaped outlined dense rows=1 class="ml-6" auto-grow readonly :value="product.body"></v-textarea> -->
                                    </v-list-item>
                                </v-list>
                            </v-card-text>
                        </v-col>
                        <v-col cols=12 sm=6>
                            <label for="delivery">نوع ارسال:</label>
                            <v-divider class="mt-1"></v-divider>
                            <v-radio-group @change="onChooseShipping" class="mt-0 pt-2" id="delivery" dense v-model="deliveryMethod">
                                <v-radio
                                    label="پیشتاز"
                                    value="normal"
                                ></v-radio>
                                <v-radio
                                    label="ویژه"
                                    value="fast"
                                ></v-radio>
                            </v-radio-group> 
                            <v-alert v-show="deliveryMethod == 'fast'" class="subtitle-2 py-1 px-1 mb-0 accent--text text--darken-3">
                                در صورتی که ارسال پست ویژه به آدرس شما ممکن نباشد، مابه التفاوت مبلغ پست ویژه و پیشتاز به شما باز گردانده می‌شود.
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
            <v-col cols=12 sm=4>
                <v-card
                class="mb-2 elevation-change">
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
                            <v-icon>
                                mdi-content-copy
                            </v-icon>
                            <v-spacer></v-spacer>
                            6037697602717826
                        </v-btn>
                        به نام
                        <b>
                            سجاد ایزدی و زهرا لطفی
                        </b>
                        ،
                        بانک صادرات
                        واریز کنید و اطلاعات پرداخت را در بخش اطلاعات سفارش وارد کنید. سفارش شما پس از تایید حداکثر پس از 4 روز کاری تحویل شرکت پست می‌شود.
                    </v-card-text>
                </v-card>
                <v-card outlined>
                    <v-card-actions>
                        <v-btn
                        block
                        @click="submit"
                        color="primary"
                        :loading="loading"
                        >
                        <v-icon>mdi-truck-delivery-outline</v-icon>
                        &nbsp;تایید نهایی و ثبت سفارش
                        </v-btn>
                    </v-card-actions>
                    <v-card-title class="py-1">
                        خلاصه سفارش:
                    </v-card-title>
                    <v-card-text>
                        تعداد محصولات: {{getCartLength}}
                        <br>
                        هزینه ارسال و بسته بندی پستی: {{shippingPrice | number}} تومان
                        <br>
                        قیمت محصولات: {{getCartTotalPrice | number}} تومان
                        <v-chip label>
                            قیمت نهایی: {{getCartTotalPriceWithShipping | number}} تومان
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex"
import VoiceCardAvatar from "@/components/voice-card/VoiceCardAvatar"
    export default {
        components: {
            VoiceCardAvatar,
        },
        middleware : ['auth','cartLength'],
        auth : 'user',
        async asyncData({$axios, store}) {
            try {
                let response = await $axios.$post('/api/shipment', {shipment : "normal"})
                return {
                    shippingPrice : response.shipment.price,
                    estimatedDelivery : response.shipment.estimated,
                    createdTime : response.shipment.createdTime,
                }
            } catch (error) {
                console.log(error);
            }
        },
        data() {
            return {
                paymentMethod: 2,
                deliveryMethod : "normal",
                off : false,
                overlay : false,
                loading : false,
                maxWidth : 0,
            }
        },
        computed: {
            ...mapGetters(["getCart","getCartTotalPrice","getCartLength","getCartTotalPriceWithShipping","getEstimatedDelivery"]),
            deliverTo () {
                if(this.$auth.user.address){
                    return this.$auth.user.address._id
                }
            }
        },
        mounted () {
            let maxWidth = window.innerWidth
            this.maxWidth = maxWidth
            if (this.$auth.$state.user.address) {
                this.$store.commit('setShipping', { price : this.shippingPrice, estimatedDelivery : this.estimatedDelivery, createdTime : this.createdTime,deliverTo : this.$auth.user.address._id})
            }
        },
        methods: {
            async onChooseShipping(shipment) {
                // not working yet
                try {
                    let response = await this.$axios.$post('/api/shipment', {shipment : shipment})
                    this.$store.commit('setShipping', { price : response.shipment.price, estimatedDelivery : response.shipment.estimated,createdTime : response.shipment.createdTime, deliverTo : this.$auth.user.address._id })
                    this.shippingPrice = response.shipment.price,
                    this.estimatedDelivery = response.shipment.estimated
                    this.createdTime = response.shipment.createdTime
                    this.deliverTo = this.$auth.user.address._id
                } catch (error) {
                    console.log(error);
                }
            },
            async submit() {
                try {
                    if (this.$auth.user.address) {
                        this.loading = true;
                        let data = {
                            totalPrice : this.getCartTotalPriceWithShipping,
                            cart : this.getCart,
                            estimatedDelivery : this.getEstimatedDelivery,
                            createdTime : this.createdTime,
                            deliverTo : this.$store.state.auth.user.address._id,
                            deliveryMethod: this.deliveryMethod
                        }
                        data.cart = this.getCart
                        data.cart.forEach(prod => {
                            delete prod.product
                        });
                        let response =  await this.$axios.$post("/api/order", data)
                        if (response.success) {
                            this.loading = false
                            this.$nuxt.$router.push("/orders")
                            this.$store.commit("clearCart")
                        }
                    } else {
                        this.$toast.error('لطفا آدرس خود را ایجاد یا انتخاب کنید')
                        this.redirect()
                    }
                } catch (error) {
                    this.loading = false
                    console.log(error);
                }
            },
            redirect() {
                localStorage.setItem('redirect', '/placeorder')
                this.$nuxt.$router.push('/address')
            },
            onCopy() {
                this.$toast.success("شماره کارت در حافظه دستگاه کپی شد")
            },
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