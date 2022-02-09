<template>
    <v-dialog v-model="dialog" max-width="400">
        <v-card :loader-height="2" :loading="loading">
            <v-card-title>
                افزودن یادداشت
                <v-spacer></v-spacer>
                <v-icon color="error" @click="dialog = false">
                    mdi-close
                </v-icon>
            </v-card-title>
            <v-card-text class="py-0">
                <v-textarea outlined auto-grow rows="2" hide-details v-model="note"></v-textarea>
            </v-card-text>
            <v-card-actions class="justify-center py-3">
                <v-btn small :loading="loading" @click="submit" class="primary subtitle-2">
                    ذخیره
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: {
            value: Boolean,
            order: Object
        },
        data() {
            return {
                note: '',
                loading: false
            }
        },
        watch: {
            dialog(newValue, oldValue) {
                if (!newValue) return
                this.note = this.order.note
            }
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
        methods: {
            submit() {
                this.$try(async ()=> {
                    let {result} = await this.$axios.$put(`/api/order/${this.order._id}`, {note: this.note})
                    this.$emit('updated', result)
                    this.dialog = false
                }, this)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>