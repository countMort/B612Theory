<template>
    <v-container class="background align-center d-flex">
        <v-card max-width="600" class="mx-auto" :loading="loading" loader-height="2">
            <v-card-title class="justify-center subtitle-1">
                {{
                    panel == -1 ?
                    'لطفا شماره تلفن همراهی که با آن ثبت نام کردید را وارد کنید' :
                    'رمز جدید خود را وارد کنید'
                }}
            </v-card-title>
            <v-card-text class="pb-0">
                <v-form ref="form">
                    <b-text-field
                    class="px-6"
                    type="number"
                    v-model="phone"
                    :rules="phoneRules"
                    placeholder="شماره تلفن همراه"
                    @keydown.enter.stop.prevent="sendSms"
                    prepend-icon="mdi-phone"
                    ></b-text-field>
                    <v-expansion-panels class="mt-4" flat :value="panel">
                        <v-expansion-panel>
                            <v-expansion-panel-content>
                                <v-text-field
                                dense
                                outlined
                                label="کد ییامک شده"
                                :rules="codeRules"
                                type="number"
                                v-model="otp"
                                :counter="6"
                                prepend-icon="mdi-message-reply-text"
                                ></v-text-field>
                                <v-text-field
                                    dense
                                    outlined
                                    v-model="password"
                                    label="رمز جدید خود را انتخاب کنید"
                                    prepend-icon="mdi-lock"
                                    :rules="passRules"
                                    color="black"
                                    :counter="17"
                                    :type="show1 ? 'text' : 'password'"
                                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="show1 = !show1"
                                ></v-text-field>
                                <v-text-field
                                    dense
                                    outlined
                                    v-model="rePassword"
                                    label="رمز خود را مجددا تایپ کنید"
                                    prepend-icon="mdi-lock"
                                    color="black"
                                    :rules="rePassRules"
                                    :type="show2 ? 'text' : 'password'"
                                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="show2 = !show2"
                                    hide-details
                                ></v-text-field>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-form>
            </v-card-text>
            <v-card-actions class="justify-space-around">
                <v-btn @click="panel== -1 ? sendSms() : submit()" class="primary" small :loading="loading">
                    {{panel == -1 ? 'ارسال پیامک' : 'تغییر رمز و ورود'}}
                </v-btn>
                <v-btn small v-if="panel == 0" @click="sendSms" :disabled="$store.getters.getTimer >= 1000" :loading="loading">
                    {{$store.getters.getTimer >= 1000 ? $store.getters.getTimer/1000 : 'ارسال مجدد کد'}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        middleware: 'auth',
        auth: 'guest',
        data() {
            return {
                phone: null,
                loading: false,
                otp: null,
                password: null,
                rePassword: null,
                panel: -1,
                phoneRules: [
                    v => !!v || '',
                    v => !v || v.toString().startsWith("0") ? (v && v.toString().length === 11) : (v && v.toString().length === 10) || 'شماره تلفن همراه صحیح نیست'
                ],
                show1: false,
                show2: false,
                passRules : [
                    input => input ? input.length >= 9 || 'رمز حداقل 9 حرف باشد' : '',
                    input => (input || '').length <= 17 ||
                    `بیشترین تعداد کاراکتر های رمز 17 عدد میباشد`
                ],
                rePassRules : [
                    v => v===this.password || 'تکرار رمز صحیح نمی‌باشد'
                ],
                codeRules: [
                    v => !!v || "لطفا کد تایید پیامکی را وارد کنید",
                    v => !v || v.toString().length < 7 || "کد مربوطه 6 رقمی است"
                ],
            }
        },
        mounted () {
            if(this.$store.getters.getTimer >= 1000) this.panel = 0;
        },
        methods: {
            sendSms() {
                this.$try(async ()=> {
                    if (this.phone.toString().startsWith("0") ? (this.phone && this.phone.toString().length === 11) : (this.phone && this.phone.toString().length === 10)) {
                        let data = {
                            phone: this.phone,
                            forgorPassword: true
                        }
                        if (this.phone.startsWith("0")) data.phone = data.phone.slice(1)
                        let result = await this.$axios.$post("/api/auth/generate-key", data)
                        this.$store.commit("SET_TIMER", 60 * 1000)
                        this.$store.commit("SET_HASH", result.result.hash)
                        this.$toast.success(result.message)
                        this.panel = 0
                    }
                }, this)
            },
            async submit() {
                if (this.$refs.form.validate()) {
                    try {
                        this.loading = true
                        let data = {
                            name : this.name,
                            phone : this.phone,
                            password : this.password,
                            otp: this.otp,
                            hash: this.$store.getters.getHash
                        }
                        if (this.phone.startsWith("0")) data.phone = data.phone.slice(1)
                        let response = await this.$axios.$put('/api/auth/user/reset-password', data)
                        if(response.success) {
                            await this.$auth.loginWith("local", {
                                data: {
                                    phone : this.phone,
                                    password : this.password
                                }
                            })
                        }
                        this.loading = false
                    } catch (error) {
                        this.loading = false
                        console.log(error);
                        if(error.response.status !== 500) {
                            this.$toast.error(error.message || error)
                        }
                    }
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.background{
    background-image: url('@/static/footer-bg.jpg');
    height: 100%;
    background-size: cover;
}
</style>