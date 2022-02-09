<template>
        <v-snackbar
            v-if="getPopShow"
            v-model="show"
            :color="color"
            top
        >
            {{$store.state.popMsg}}
            <template v-slot:action="{ attrs }">
                <v-btn
                icon
                v-bind="attrs"
                @click="$store.commit('pushEnd')"
                >
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </template>
        </v-snackbar>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                show : true
            }
        },
        computed: {
            color() {
                if(this.$store.state.popType === 'error') {
                    return 'pink accent-2'
                } else if (this.$store.state.popType === 'success') {
                    return 'indigo lighten-2'
                }
            } ,
            ...mapGetters(["getPopShow"])
        } ,
        watch: {
            getPopShow(newValue, oldValue) {
                this.show = newValue
            }
        },
    }
</script>

<style scoped>

</style>