<template>
    <v-dialog v-model="dialog" max-width="500">
        <v-card class="text-center">
            <v-card-title class="align-center">
                تغییر کارت صدا
                <v-spacer></v-spacer>
                <v-icon color="red" @click="dialog = false">mdi-close</v-icon>
            </v-card-title>
            <v-card-text class="pb-1">
                تغییرات ایجاد شده فعلا برگشت پذیر نیستند.
                <br>
                از فایل صوتی خود اطمینان دارید؟
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn small class="primary px-10 mb-4" @click="$emit('confirm', dialog = false)">
                    <v-icon>mdi-check</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            value: Boolean
        },
        computed: {
            dialog: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>