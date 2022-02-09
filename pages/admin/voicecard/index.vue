<template>
    <v-container>
        <v-progress-linear
        v-if="loading"
        indeterminate
        height="2"
        ></v-progress-linear>
        <v-form ref="form" class="d-flex justify-space-around align-center">
            <v-avatar tile size="90">
                <v-img :src="type.photos && type.photos[0]"></v-img>
            </v-avatar>
            <v-select
            class="mr-3"
            :items="types"
            v-model="type"
            :rules="[v => !!v._id || '']"
            return-object
            hide-details
            item-text="name"
            outlined
            placeholder="نوع کارت صدا"
            dense
            ></v-select>
            <client-only>
                <b-text-field
                class="mr-3"
                label="تعداد"
                type="number"
                :rules="[v => Number(v) > 0 || '']"
                v-model="quantity"
                ></b-text-field>
            </client-only>
            <v-btn @click="generete" color="primary" class="px-12 mr-3">
                ایجاد
            </v-btn>
        </v-form>
        <v-data-table
        :headers="headers"
        :items="voiceCards"
        item-key="_id"
        >
            <template v-slot:item.type="{ item }">
                <v-avatar :size="60">
                    <voice-card-avatar
                    :product=item
                    :size="60"
                    />
                </v-avatar>
            </template>
            <template v-slot:item.path="{ item }">
                <nuxt-link class="caption" :to="`/remember-remember/${item._id}`">
                    {{item._id}}
                </nuxt-link>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import VoiceCardAvatar from "@/components/voice-card/VoiceCardAvatar.vue"
    export default {
        middleware: 'auth',
        auth: 'admin',
        components: {
            VoiceCardAvatar,
        },
        mounted () {
            this.TYPES();
            this.READ();
        },
        data() {
            return {
                loading: false,
                types: [],
                type: {},
                quantity: 0,
                voiceCards: [],
                headers: [
                    {
                        text: 'نوع',
                        value: 'type',
                        align: 'center'
                    },
                    {
                        text: 'مسیر',
                        value: 'path',
                        align: 'center'
                    }
                ]
            }
        },
        methods: {
            READ() {
                this.$try(async ()=> {
                    const {result} = await this.$axios.$get('/api/voice-card', {params: {saleMethod: 'digi'}})
                    this.voiceCards = result
                })
            },
            TYPES() {
                this.$try(async ()=> {
                    let {result} = await this.$axios.$get('/api/products/60a80142d6a7bbb590a2fc98')
                    this.types = result.product.types
                }, this)
            },
            generete() {
                this.$try(async ()=> {
                    if (this.$refs.form.validate()) {
                        let data = {
                            type: this.type._id,
                            quantity: this.quantity,
                            photo: this.type.photos[0]
                        }
                        let result = await this.$axios.$post('/api/voice-card/plenty', data, {responseType: 'arraybuffer'})
                        let a = document.createElement('a')
                        const blob = new Blob([result], {type: "application/zip"})
                        a.href = URL.createObjectURL(blob)
                        a.download = 'voice-cards'
                        a.click()
                        setTimeout(() => URL.revokeObjectURL(a.href), 1000)
                        this.READ()
                    }
                }, this)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>