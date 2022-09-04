import Vue from 'vue'
import DatePicker from 'vue-persian-datetime-picker'
import BUploader from '@/components/Uploader.vue'
import BTextField from '@/components/BTextField'

const components = { BUploader, BTextField, DatePicker }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
