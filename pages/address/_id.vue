<template>
    <v-container fluid>
        <v-form ref="form">
            <v-card outlined :loading=loading class="mx-auto" max-width="400">
                <v-card-title class="justify-center">
                        به روز رسانی آدرس
                </v-card-title>
                <v-card-text>
                    <v-text-field
                    dense
                    label="نام کامل"
                    outlined
                    :rules="rule"
                    v-model="address.firstName"
                    @keydown.enter.prevent='submit()'
                    />
                    <v-text-field
                    dense
                    label="نام کامل"
                    outlined
                    :rules="rule"
                    v-model="address.lastName"
                    @keydown.enter.prevent='submit()'
                    />
                    <v-select
                    dense
                    label="استان"
                    outlined
                    item-text="name"
                    item-value="id"
                    return-object
                    :rules="rule"
                    v-model="address.province"
                    :items=provinces
                    @keydown.enter.prevent='submit()'
                    />
                    <v-select
                    dense
                    outlined
                    item-text="name"
                    item-value="id"
                    return-object
                    :rules="rule"
                    v-model="address.city"
                    label="شهر"
                    :items=filteredCities
                    @keydown.enter.prevent='submit()'
                    />
                    <v-text-field
                    dense
                    label="آدرس محل ارسال"
                    outlined
                    :rules="rule"
                    v-model="address.streetAddress"
                    @keydown.enter.prevent='submit()'
                    />
                    <!-- <v-text-field dense label="پلاک - واحد - زنگ" outlined v-model="address.streetAddress2" /> -->
                    <v-text-field
                    dense
                    label="کد پستی"
                    outlined
                    type="number"
                    :rules="zipCodeRules"
                    v-model="address.zipCode"
                    @keydown.enter.prevent='submit()'
                    dir="ltr"
                    />
                    <v-text-field
                    dense
                    label="تلفن"
                    type="number"
                    outlined
                    v-model="address.phoneNumber"
                    @keydown.enter.prevent='submit()'
                    />
                    <v-divider class="mb-4"></v-divider>
                    <v-expansion-panels flat popout hover tile>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                آیا ما اطلاعات بیشتری برای یافتن این آدرس نیاز داریم؟
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-textarea v-model="address.deliverInstructions" dense outlined label="افزودن توضیحات ارسال" />
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
                <v-card-actions class="justify-space-around">
                    <v-btn :loading="loading" @click="submit" dark class="primary px-7 mb-2">
                        به روز رسانی آدرس
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
        async asyncData({$axios, params}) {
            try {
                let response = await $axios.$get(`/api/addresses/${params.id}`)
                response.address.province = provinces.find(province => province.name = response.address.province)
                response.address.city = cities.find(city => city.name = response.address.city)
                return {
                    address : response.address
                }
            } catch (error) {
                console.log(error.response.data.message);
            }
        },
        data() {
            return {
                cities,
                provinces,
                loading : false,
                zipCodeRules: [
                    v => v > 0 || "",
                    v => !v || v.toString().length == 10 || ""
                ],
                rule: [
                    (v) => !!v || "این فیلد نمیتواند خالی باشد"
                ],
            }
        },
        computed: {
            filteredCities() {
                return this.address.province ? this.cities.filter(city => city.province_id == this.address.province.id) : {}
            }
        },
        methods: {
            async submit() {
                try {
                    if(this.$refs.form.validate()) {
                        this.loading = true
                        let data = this.address
                        data.province = data.province.name
                        data.city = data.city.name
                        let response = await this.$axios.$put(`/api/addresses/${this.$route.params.id}`, data)
                        if(this.$auth.user.address && this.$auth.user.address_id == this.address._id) {
                            await this.$auth.fetchUser()
                        }
                        if(response.success) {
                            this.$toast.success(response.message)
                            this.loading = false
                            this.$nuxt.$router.push('/address')
                        }
                    }
                } catch (error) {
                    this.loading = false
                    console.log(error.response.data.message);
                }
            },
            clear() {
                this.$refs.form.reset() ;
            }
        },
    }
</script>

<style scoped>
</style>