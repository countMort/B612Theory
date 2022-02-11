import Vue from 'vue'
import DatePicker from 'vue-persian-datetime-picker'
import VueDragResize from 'vue-drag-resize'
import BUploader from '@/components/Uploader.vue'
import BTextField from '@/components/BTextField'

const components = { BUploader, BTextField, DatePicker, VueDragResize }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
