<template>
<v-container class="pr-2" fluid>
    <v-card class="full-width" elevation=20>
        <v-card-title primary-title :class="$vuetify.breakpoint.xsOnly && 'subtitle-2'">
            <v-icon :small="$vuetify.breakpoint.xsOnly" class="ml-1">
                mdi-comment
            </v-icon>
            نظرات کاربران
            <v-spacer>
            </v-spacer>
            <v-btn
            :class="$vuetify.breakpoint.xsOnly && 'subtitle-2'"
            :small="$vuetify.breakpoint.xsOnly"
            text
            outlined
            nuxt
            :to="`/reviews/${productID}`">
            <v-icon :small="$vuetify.breakpoint.xsOnly" left>
                mdi-plus
            </v-icon>
                افزودن نظر
            </v-btn>
        </v-card-title>
        <v-banner v-for="review in reviews" :key="review.id" :value="true">
            <v-avatar
            slot="icon"
            color="deep-purple accent-4"
            size="40"
            >
                <v-icon
                    icon="mdi-comment-account"
                    color="white"
                >
                    mdi-comment-account
                </v-icon>
            </v-avatar>
            <v-chip outlined class="mb-1">
                {{review.user.name}} :
                &nbsp;
                <v-icon size="18" v-if="review.rating>3.5 && review.rating != 5">mdi-thumb-up-outline</v-icon>
                <v-icon size="18" v-if="review.rating === 5">mdi-thumb-up</v-icon>
                <v-icon size="18" v-if="review.rating <3.5">mdi-thumb-down-outline</v-icon>
                &nbsp;
                <div>
                    {{review.headline}}
                </div>
            </v-chip>
            {{review.body}}
            <template v-slot:actions>
                <v-rating
                class="pl-10"
                :value="review.rating"
                color="amber"
                half-increments
                dense
                size="15"
                readonly
                ></v-rating>
            <v-btn v-if="$auth.user && (review.user._id === $auth.user._id || $auth.user.role== 'admin' || $auth.user.role== 'super_admin')" @click="onDeleteReview(review._id)" text color="deep-purple accent-4">حذف نظر</v-btn>
            <!-- <v-btn text color="deep-purple accent-4">Action</v-btn> -->
            </template>
        </v-banner>
    </v-card>
</v-container>
</template>

<script>
    export default {
        props: [
            'productID' ,
            'reviews'
        ] ,
        methods: {
            async onDeleteReview(reviewID) {
                try {
                    let reviewIndex = this.reviews.indexOf({_id : reviewID})
                    let response = await this.$axios.$delete(`/api/reviews/${reviewID}`)
                    if (response.success) {
                        console.log(response.message);
                        this.reviews.splice(reviewIndex , 1)
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
        },
    }
</script>

<style scoped>

</style>