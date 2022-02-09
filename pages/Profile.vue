<template>
    <v-container fluid class="mt-2 mb-10">
        <v-card v-if="$auth.loggedIn" class="mx-auto" :loading="loading" outlined max-width="400">
            <v-card-title
            class="title justify-center"
            primary-title
            >
                ویرایش اطلاعات
            </v-card-title>
            <v-card-text class="text-center">
                <v-form ref="form">
                    <template v-if="changingPass">
                        <b-text-field
                        label="رمز فعلی"
                        class="mb-2"
                        autofocus
                        :rules="nameRules"
                        v-model="oldPassword"
                        type="password"
                        ></b-text-field>
                        <b-text-field
                        label="رمز"
                        textarea
                        class="mb-2"
                        v-model="password"
                        type="password"
                        :rules="passRules"
                        ></b-text-field>
                        <b-text-field
                        label="تکرار رمز"
                        textarea
                        class="mb-2"
                        v-model="rePassword"
                        type="password"
                        :rules="rePassRules"
                        ></b-text-field>
                    </template>
                    <template v-else>
                        <b-text-field
                        label="نام"
                        v-model="name"
                        :placeholder="$store.state.auth.user.name"
                        class="mb-2"
                        :rules="nameChange ? nameRules : []"
                        ></b-text-field>
                        <b-text-field
                        label="تلفن"
                        type="number"
                        v-model="phone"
                        suffix="98+"
                        class="mb-2"
                        dir="ltr"
                        disabled
                        :placeholder="$store.state.auth.user.phone.toString()"
                        :rules="phoneRules"
                        ></b-text-field>
                    </template>
                    <v-row class="mt-0 justify-space-between mx-0 mb-2">
                        <v-btn disabled @click="changingPass = !changingPass" class="caption" text color="info">
                            تغییر {{changingPass ? 'مشخصات' : 'رمز'}}
                        </v-btn>
                        <v-btn disabled class="caption" text color="info">
                            فراموشی رمز
                        </v-btn>
                    </v-row>
                </v-form>
                <v-btn block :loading="loading" class="primary" @click="submit">
                    ویرایش اطلاعات
                </v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
    export default {
        middleware : 'auth',
        auth : 'user',
        data() {
            return {
                name: this.$auth.user.name,
                phone : this.$auth.user.phone,
                oldPassword: "",
                password : "",
                rePassword: "",
                loading : false,
                nameChange : false,
                passChange : false,
                phoneChange : false,
                changingPass: false,
                passRules : [
                    input => input ? input.length >= 9 || 'رمز حداقل 9 حرف باشد' : '',
                    input => (input || '').length <= 17 ||
                    `بیشترین تعداد کاراکتر های رمز 17 عدد میباشد`
                ],
                phoneRules : [
                    v => !!v || '',
                    v => !v || v.toString().startsWith("0") ? (v && v.toString().length === 11) : (v && v.toString().length === 10) || 'شماره تلفن همراه صحیح نیست'
                ] ,
                rePassRules : [
                    v => v===this.password || 'تکرار رمز صحیح نمی‌باشد'
                ],
                nameRules : [
                    v => !!v || ''
                ],
            }
        },
        methods: {
            async submit() {
                if (this.$refs.form.validate()) {
                    // this.loading = true
                    // let data
                    // if(this.changingPass) {
                    //     data = {
                    //         oldPassword: this.oldPassword,
                    //         password: this.password
                    //     }
                    // } else if (this.phone != this.$auth.user.phone) {
                    //     if(
                    //         this.phone.toString().startsWith("0") ?
                    //         (this.phone && this.phone.toString().length === 11) :
                    //         (this.phone && this.phone.toString().length === 10)
                    //     ) {
                    //         data = {
                    //             phone: this.phone
                    //         }
                    //         if (this.phone.startsWith("0")) data.phone = data.phone.slice(1)
                    //         this.$store.commit("SET_TIMER", 60 * 1000)
                    //         let result = await this.$axios.$post("/api/auth/generate-key", data)
                    //         this.$store.commit("SET_HASH", result.data.hash)
                    //         this.$toast.success(result.message)
                    //         this.panel = 0
                    //     }
                    // }
                    try {
                        let data = {
                            name : this.name,
                            // phone : this.phone,
                            // password : this.password
                        }
                        this.loading = true
                        let response = await this.$axios.$put('/api/auth/user', data)
                        // if(response.success) {
                        //     this.name = "" ;
                        //     this.phone = "" ;
                        //     this.password = "" ;
                        // }
                        this.$toast.success(response.message)
                        this.loading = false
                        await this.$auth.fetchUser() ;
                    } catch (error) {
                        console.log(error);
                        this.loading = false
                    }
                }
            },
        },
    }
</script>

<style scoped>
.select {
    width: 100%;
    border: black 1px solid;
    border-radius: 30%;
}
</style>