<template>
    <v-container fluid>
        <v-data-table
        dense
        :headers="headers"
        :items="stats"
        :loading="loading"
        loader-height="2"
        >
            <template v-slot:item.price={item}>
                {{item.price | number}}
            </template>
            <template v-slot:item.name={item}>
                {{item.name + ' - ' + item.type}}
            </template>
        </v-data-table>
        <v-chip color="primary">
            مبلغ کل: {{totalSale | number}} تومان
        </v-chip>
        <v-chip color="warning">
            تعداد کل: {{totalQuantity | number}}
        </v-chip>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                stats: [],
                totalSale: 0,
                totalQuantity: 0,
                loading: false,
                headers: [
                    {
                        text: 'نام',
                        value: 'name',
                        align: 'center'
                    },
                    {
                        text: 'تعداد فروش',
                        value: 'quantity',
                        align: 'center'
                    },
                    {
                        text: 'مبلغ فروش',
                        value: 'price',
                        align: 'center'
                    },
                ]
            }
        },
        mounted () {
            this.READ();
        },
        methods: {
            READ() {
                this.$try(async ()=> {
                    const {result} = await this.$axios.$get('/api/stats')
                    this.stats = result.stats
                    this.totalSale = result.totalPrice
                    this.totalQuantity = result.totalQuantity
                }, this)
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>