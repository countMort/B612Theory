<template>
    <v-dialog max-width="500" v-model="dialog">
        <v-card>
            <v-card-title :class="$vuetify.breakpoint.xsOnly && 'caption'">
                حذف محصول
                &nbsp;
                <span class="red--text">
                    {{item.name}}
                </span>
                <v-spacer></v-spacer>
                <v-icon @click="dialog = false">
                    mdi-close
                </v-icon>
            </v-card-title>
            <v-card-text class="text-center">
                آیا مطمئن هستید که می‌خواهید محصول
                <span class="red--text">
                    {{item.name}}
                </span>
                را پاک کنید؟
            </v-card-text>
            <v-card-actions class="justify-center">
                <v-btn :loading="loading" small class="error" @click="$emit('delete' , item._id || item.id)">
                    <v-icon left>
                        mdi-delete
                    </v-icon>
                    حذف شود
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
            },
            item: {
                type: Object
            },
            loading: {
                type: Boolean
            }
        },
        computed: {
            dialog: {
                get() {
                    return this.value 
                },
                set(val) {
                    this.$emit('input' , val)
                }
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>