import Vue from 'vue'
import BUploader from '@/components/Uploader.vue'
import BTextField from "@/components/BTextField"
import DatePicker from "vue-persian-datetime-picker";
const components = { BUploader, BTextField, DatePicker }

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
})