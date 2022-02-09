<template>
    <v-container>
        <v-row class="justify-space-around">
            <v-col cols="12" v-for="item in items" :key="item.name">
                <v-btn :to="item.to" block class="align-center d-flex px-2 py-7">
                    {{item.name}}
                    &nbsp;
                    {{item.quantity}}
                    <v-icon class="mr-auto" x-large>
                        {{item.icon}}
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        name: 'بنرها',
                        icon: 'mdi-image-outline',
                        to: 'ui/banners',
                        quantity: 2
                    },
                    {
                        name: 'اسلایدرها',
                        icon: 'mdi-view-carousel-outline',
                        to: 'ui/sliders',
                        quantity: 4
                    },
                ]
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>