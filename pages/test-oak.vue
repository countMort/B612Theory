<template>
  <div style="position: relative; height: 100%; z-index: 2">
    <client-only>
      <MindAr path="white-oak-tree" scale="0.8 0.8 0.8" />
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
