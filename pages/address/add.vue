<template>
    <v-container fluid>
        <v-form ref="form">
            <v-card outlined max-width="400" class="mx-auto" :loading=loading loader-height="2">
                <v-card-title class="justify-center title">
                    اضافه کردن آدرس جدید
                </v-card-title>
                <v-card-text>
                    <v-text-field
                    @keydown.enter.prevent='submit()'
                    dense label="نام"
                    outlined
                    v-model="firstName"
                    :rules="rule"
                    />
                    <v-text-field
                    @keydown.enter.prevent='submit()'
                    dense label="نام خانوادگی"
                    outlined
                    v-model="lastName"
                    :rules="rule"
                    />
                    <v-select
                    dense
                    label="استان"
                    outlined
                    v-model="province"
                    :items=provinces
                    item-text="name"
                    item-value="id"
                    return-object
                    :rules="rule"
                    />
                    <v-select
                    dense
                    outlined
                    v-model="city"
                    label="شهر"
                    :items=filteredCities
                    item-text="name"
                    item-value="id"
                    return-object
                    :rules="rule"
                    />
                    <v-textarea
                    auto-grow
                    rows="2"
                    dense
                    label="آدرس محل ارسال"
                    outlined
                    v-model="streetAddress"
                    :rules="rule"
                    />
                    <!-- <v-text-field dense label="پلاک - واحد - زنگ" outlined v-model="streetAddress2" :rules="rule" /> -->
                    <v-text-field
                    @keydown.enter.prevent='submit()'
                    dir="ltr"
                    dense
                    label="کد پستی"
                    outlined
                    :rules="zipCodeRules"
                    type="number"
                    v-model="zipCode"
                    />
                    <v-text-field
                    @keydown.enter.prevent='submit()'
                    suffix="98+"
                    dir="ltr"
                    dense
                    label="تلفن"
                    type="number"
                    outlined
                    v-model="phoneNumber"
                    :rules="phoneRules"
                    />
                    <v-divider class="mb-4"></v-divider>
                    <v-expansion-panels flat popout hover tile>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                آیا ما اطلاعات بیشتری برای یافتن این آدرس نیاز داریم؟
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-textarea v-model="deliverInstructions" dense outlined label="افزودن توضیحات ارسال" />
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
                <v-card-actions class="justify-space-around">
                    <v-btn :loading="loading" @click="submit" dark class="primary px-7 mb-2">
                        ثبت آدرس
                    </v-btn>
                    <v-btn @click="clear">
                        پاک کردن فرم
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>

<script>
import cities from "@/assets/locations/cities"
import provinces from "@/assets/locations/provinces"
    export default {
        data() {
            return {
                city: {},
                firstName: "",
                lastName: "",
                zipCode: "",
                province: {},
                phoneNumber: "",
                deliverInstructions: "",
                streetAddress: "",
                // streetAddress2: "",
                cities,
                provinces,
                rule: [
                    (v) => !!v || "این فیلد نمیتواند خالی باشد"
                ],
                zipCodeRules: [
                    v => v > 0 || "",
                    v => !v || v.toString().length == 10 || ""
                ],
                phoneRules: [
                    v => !!v || '',
                    v => !v || v.toString().startsWith("0") ? (v && v.toString().length === 11): (v && v.toString().length === 10) || 'شماره تلفن همراه صحیح نیست'
                ],
                loading: false
            }
        },
        computed: {
            filteredCities() {
                return this.cities.filter(city => city.province_id == this.province.id)
            }
        },
        methods: {
            async submit() {
                try {
                    if(this.$refs.form.validate()) {
                        let data = {
                            city : this.city.name,
                            firstName : this.firstName,
                            lastName : this.lastName,
                            zipCode : this.zipCode,
                            province : this.province.name,
                            phoneNumber : this.phoneNumber,
                            deliverInstructions : this.deliverInstructions,
                            streetAddress : this.streetAddress
                        }
                        this.loading = true
                        let response = await this.$axios.$post("/api/addresses", data)
                        if(!this.$auth.user.address) {
                            await this.$auth.fetchUser() ;
                        }
                        this.$toast.success(response.message)
                        this.loading = false
                        const redirect = localStorage.getItem('redirect')
                        if(redirect) localStorage.removeItem('redirect')
                        this.$nuxt.$router.push(redirect || '/address')
                    }
                } catch (error) {
                    this.loading = false
                    console.log(error.response ? error.response.data.message : error);
                }
                
            },
            clear() {
                this.$refs.form.reset() ;
            },
        },
    }
</script>

<style scoped>
</style>