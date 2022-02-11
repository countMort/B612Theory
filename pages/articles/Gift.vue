<template>
  <v-container class="text-center primary--text">
    <span class="font-weight-bold">
      بذر شما کدام یک از بذر های زیر است؟
      <br>
      لطفا روی آن کلیک کنید
    </span>
    <div class="row mt-2 justify-center">
      <v-card
        v-for="(item, i) in items"
        :key="item.title"
        class="mx-2 my-2"
        link
        :to="item.to"
        :loading="loading[i]"
        loader-height="2"
      >
        <v-img
          height="300"
          width="300"
          :src="item.image"
          align="center"
          @load="disableLoading(i)"
        >
          {{ item.title }}
        </v-img>
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      items: [
        {
          title: 'شاهی',
          to: 'Shahi',
          image: 'https://dl.b612theory.ir/admin/shahi.jpg'
        },
        {
          title: 'لاله عباسی',
          to: 'Lale-abbasi',
          image: 'https://dl.b612theory.ir/admin/lale-abbasi.jpg'
        },
        {
          title: 'ریحان',
          to: 'Rayhan',
          image: 'https://dl.b612theory.ir/admin/rayhan.jpg'
        }
      ],
      loading: [true, true, true]
    }
  },
  methods: {
    disableLoading (index) {
      this.$set(this.loading, index, false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
