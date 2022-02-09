<template>
    <v-card
        class="mx-auto mt-2 scale"
        light
        outlined
        nuxt
        :to="`/products/${product._id}`"
        hover
        tile
    >
        <v-btn v-if="soldOut" x-large class="sold-out white--text display-1" outlined>
            Sold Out
        </v-btn>
        <v-img
        height="300"
        :src="product.thumbnails ? product.thumbnails[0] : product.photos[0]"
        class="align-end"
        :style="soldOut ? 'opacity: 0.6' : ''"
        >
            <v-card-title style="background-color: rgba(0, 0, 0, 0.345);" class="py-1 white--text">
                {{product.name}}
            </v-card-title>
        </v-img>
        <v-card-text>
            <!-- <v-row>
                <v-rating
                :value="Number(product.averageRating) || 0"
                half-increments
                dense
                color="amber"
                size="14"
                readonly
                ></v-rating>
                <div class="ml-4">{{product.averageRating | number}} ({{product.reviews.length | number}})</div>
            </v-row> -->
            <div class="my-2 subtitle-1">
                {{product.price | number}} تومان• {{product.category.name}} 
                <!--, {{product.owner.name}} -->
            </div>
            <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" v-if="product.description">{{product.description}}</div>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        props: {
            product: {
                type: Object,
                default: () => {}
            },
        },
        computed: {
            soldOut() {
                return this.product.stockQuantity == 0
            }
        },
    }
</script>

<style lang="scss">

</style>