<template>
  <v-container>
    <v-progress-linear
      v-if="loading"
      indeterminate
      height="2"
    />
    <v-form ref="form" class="d-flex justify-space-around align-center">
      <v-avatar tile size="90">
        <v-img :src="type.photos && type.photos[0]" />
      </v-avatar>
      <v-select
        v-model="type"
        class="mr-3"
        :items="types"
        :rules="[v => !!v._id || '']"
        return-object
        hide-details
        item-text="name"
        outlined
        placeholder="نوع کارت صدا"
        dense
      />
      <client-only>
        <b-text-field
          v-model="quantity"
          class="mr-3"
          label="تعداد"
          type="number"
          :rules="[v => Number(v) > 0 || '']"
        />
      </client-only>
      <v-btn color="primary" class="px-12 mr-3" @click="generete">
        ایجاد
      </v-btn>
    </v-form>
    <v-data-table
      :headers="headers"
      :items="voiceCards"
      item-key="_id"
    >
      <template #item.type="{ item }">
        <v-avatar :size="60">
          <voice-card-avatar
            :product="item"
            :size="60"
          />
        </v-avatar>
      </template>
      <template #item.path="{ item }">
        <nuxt-link class="caption" :to="`/remember-remember/${item._id}`">
          {{ item._id }}
        </nuxt-link>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import VoiceCardAvatar from '@/components/voice-card/VoiceCardAvatar.vue'
export default {
  components: {
    VoiceCardAvatar
  },
  middleware: 'auth',
  auth: 'admin',
  data () {
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
  mounted () {
    this.TYPES()
    this.READ()
  },
  methods: {
    READ () {
      this.$try(async () => {
        const { result } = await this.$axios.$get('/api/voice-card', { params: { saleMethod: 'digi' } })
        this.voiceCards = result
      })
    },
    TYPES () {
      this.$try(async () => {
        const { result } = await this.$axios.$get('/api/products/60a80142d6a7bbb590a2fc98')
        this.types = result.product.types
      }, this)
    },
    generete () {
      this.$try(async () => {
        if (this.$refs.form.validate()) {
          const data = {
            type: this.type._id,
            quantity: this.quantity,
            photo: this.type.photos[0]
          }
          const result = await this.$axios.$post('/api/voice-card/plenty', data, { responseType: 'arraybuffer' })
          const a = document.createElement('a')
          const blob = new Blob([result], { type: 'application/zip' })
          a.href = URL.createObjectURL(blob)
          a.download = 'voice-cards'
          a.click()
          setTimeout(() => URL.revokeObjectURL(a.href), 1000)
          this.READ()
        }
      }, this)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
