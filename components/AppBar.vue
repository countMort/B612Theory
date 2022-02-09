<template>
    <v-row class="my-0" align="center">
        <v-btn large icon @click="$nuxt.$router.forward()">
            <v-icon>
            mdi-arrow-right-bold-circle-outline
            </v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn large icon @click="$nuxt.$router.back()">
            <v-icon>
            mdi-arrow-left-bold-circle-outline
            </v-icon>
        </v-btn>
    </v-row>
</template>

<script>
    export default {

    }
</script>

<style lang="scss" scoped>

</style>