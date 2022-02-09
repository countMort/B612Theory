<template>
    <v-dialog
    v-model="dialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
>
    <v-card>
        <v-card-title class="d-flex align-center subtitle-1">
            <v-icon color="red">
                mdi-alert
            </v-icon>
            حذف
            &nbsp;
            <span class="red--text">
                {{name || item.name}}
            </span>
        </v-card-title>
        <v-card-text>
            آیا مطمئن هستید که می‌خواهید
            <b>{{name || item.name}}</b>
            را حذف کنید؟
        </v-card-text>
        <v-card-actions class="justify-center">
            <v-btn :loading="loading" @click="$emit('delete')" class="red--text" outlined>
                <v-icon left color="red">
                    mdi-delete
                </v-icon>
                بله حذف شود
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
    export default {
        props: {
            value: {
                type: Boolean,
                default: false
            },
            item: {
                type: Object,
                default: () => {}
            },
            name: {
                type: String,
            },
            loading: Boolean
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