<template>
  <div style="position: relative; height: 100%; z-index: 2;">
    <client-only>
      <MindAr />
    </client-only>
  </div>
</template>
<script>
import MindAr from '@/components/MindAr.vue'
export default {
  components: {
    MindAr
  },
  layout: 'VoiceCard'
}
</script>
