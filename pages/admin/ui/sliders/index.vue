<template>
    <v-container>
        <v-progress-linear indeterminate v-if="loading" height="2"></v-progress-linear>
        <v-btn class="primary white--text" block to="sliders/credit">
            افزودن اسلایدر
        </v-btn>
        <v-row class="my-0">
            <v-col cols="12" v-for="item in items" :key="item.name">
                <div class="d-flex">
                    <div>
                        {{item.name}}
                        -
                        {{item.sort}}
                        <div class="caption">
                            {{item.description}}
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn icon nuxt :to="`sliders/credit/${item._id}`">
                        <v-icon>
                            mdi-pen
                        </v-icon>
                    </v-btn>
                    <v-btn color="error" icon @click="deletingItem = item, deleteDialog = true">
                        <v-icon>
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </div>
                <slider
                :items="item[item.type]"
                />
            </v-col>
        </v-row>
        <delete-component :loading="loading" v-model="deleteDialog" :item="deletingItem" @delete="deleteSlider(deletingItem)"></delete-component>
    </v-container>
</template>

<script>
import Slider from "@/components/Slider.vue"
import DeleteComponent from "@/components/Delete"
    export default {
        components: {
            Slider,
            DeleteComponent
        },
        data() {
            return {
                deletingItem: {},
                deleteDialog: false,
                items: [],
                loading: false
            }
        },
        mounted () {
            this.READ();
        },
        methods: {
            READ() {
                this.$try(async ()=> {
                    const {result} = await this.$axios.$get('/api/sliders')
                    this.items = result
                }, this)
            },
            deleteSlider(item) {
                this.$try(async ()=> {
                    const result = await this.$axios.$delete(`/api/sliders/${item._id}`)
                    this.$toast.success(result.message)
                    this.deletingItem = {}
                    this.deleteDialog = false
                    this.READ()
                }, this)
            }
        },
    }
</script>