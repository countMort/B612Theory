<template>
    <v-overlay v-model="dialog">
        <v-card>
            <v-card-title>
                <v-icon right color="red">
                    mdi-alert
                </v-icon>
                توجه
            </v-card-title>
            <v-card-text class="font-weight-bold">
                برای آپلود فایل نیاز به ورود به حساب کاربری‌تان دارید
            </v-card-text>
            <v-card-actions class="justify-space-around">
                <v-btn nuxt to="/Login" outlined>
                    ورود به حساب
                </v-btn>
                <v-btn @click="dialog = false" color="blue white--text" class="elevation-0">
                    متوجه شدم
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-overlay>
</template>

<script>
    export default {
        data() {
            return {
                dialog: false
            }
        },
        mounted () {
            if(!this.$auth.loggedIn) this.dialog = true
        },
    }
</script>