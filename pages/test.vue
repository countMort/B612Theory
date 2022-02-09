<template>
    <div>
        <!-- <SocialHead
        title="تست"
        description="ممد"
        image="https://dl.b612theory.ir/admin/shazde1.jpg"
        ></SocialHead> -->
        <audio controls src="https://dl.b612theory.ir/1400/07/06/614077c00f5b81a94a3d51e2-05-11-04-vc card.mp3"></audio>
        <audio
        controls
        preload="auto"
        id="audio"
        >
            <source :src="voiceCard.audio" type="audio/mpeg">
            <source :src="voiceCard.audio" type="audio/ogg">
            <source :src="voiceCard.audio" type="audio/flac">
            <source :src="voiceCard.audio" type="audio/mp4">
            <source :src="voiceCard.audio" type="audio/wav">
            <source :src="voiceCard.audio" type="audio/x-m4a">
        </audio>
        <audio
        controls
        id="audio"
        >
            <source :src="voiceCard.audio" type="audio/mpeg">
            <source :src="voiceCard.audio" type="audio/ogg">
            <source :src="voiceCard.audio" type="audio/flac">
            <source :src="voiceCard.audio" type="audio/mp4">
            <source :src="voiceCard.audio" type="audio/wav">
            <source :src="voiceCard.audio" type="audio/x-m4a">
        </audio>
        <audio
        :src="voiceCard.audio"
        controls
        id="audio"
        >
        </audio>
    </div>
</template>

<script>
import SocialHead from "@/components/SocialHead.vue"
    export default {
        components: {
            SocialHead,
        },
        async asyncData ({$axios}) {
            try {
                let {result} = await $axios.$get('/api/voice-card/61531b73a55e760a03ecf78c', {
                    params: {
                        password: '000000'
                    }
                })
                if (!result.audio) return {
                    voiceCard: result,
                    onInputProcess: true
                }
                else return {
                    onInputProcess: false,
                    voiceCard: result
                }
            } catch (error) {
                console.log(error);
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>