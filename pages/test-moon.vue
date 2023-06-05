<template>
  <div style="position: relative; height: 100%; z-index: 2">
    <client-only>
      <MindAr path="the-moon" scale="3 3 3" position="0 -0.25 0" />
    </client-only>
  </div>
</template>
<script>
import MindAr from '@/components/ar-templates/AnimatedGlb.vue'
export default {
  components: {
    MindAr
  },
  layout: 'VoiceCard'
}
</script>
