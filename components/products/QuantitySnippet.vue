<template>
    <v-card class="d-inline-block elevation-0">
        <v-progress-circular
        :color="color"
        class="center-circle rounded-circle"
        rotate="-90"
        :value="stockQuantity && (quantity/stockQuantity)*100"
        size="37">
            {{quantity | number}}
        </v-progress-circular>
        <v-icon size="200" :color="color">
            mdi-light-switch
        </v-icon>
        <div class="pedals">
            <v-btn @click="$emit('increase')" color="transparent" class="elevation-1 upper"><v-icon>mdi-plus</v-icon></v-btn>
            <v-btn @click="$emit('decrease')" color="transparent" class="elevation-1 lower"><v-icon>mdi-minus</v-icon></v-btn>
        </div>
    </v-card>
</template>

<script>
    export default {
        props: {
            item: Object,
            quantity: {
                type: Number,
                default: 0
            },
            stockQuantity: Number,
            color: String
        },
    }
</script>

<style lang="scss" scoped>
.center-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 3;
    background-color: white;
}
.pedals {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    z-index: 2;
    height: 91%;
    width: 59%;
    .upper,.lower {
        height: 50%;
        width: 100%;
    }
    .upper {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        padding-bottom: 25%;
    }
    .lower {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        padding-top: 25%;
    }
}
</style>