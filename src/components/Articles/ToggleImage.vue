<script setup lang="ts">
import { computed } from 'vue';
import { useDarkMode } from '@/stores/darkmode';

const props = defineProps({
	src: {
        type: String,
        required: true
    },
	alt: String,
	mode: {
		type: String, // 'toggle' | 'dark' | 'light'
		default: 'toggle'
	}
});

const darkmode = useDarkMode();

const shouldRender = computed(() => {
    if (props.mode === 'dark') return darkmode.isDark;
    if (props.mode === 'light') return !darkmode.isDark;
    return true;
});

const imageSrc = computed(() => {
    if (!props.src) return '';
    if (props.mode === 'dark' || props.mode === 'light') {
        return props.src;
    }
    // Default 'toggle' behavior:
    let base = props.src;
    let ext = '.png'; // Default
    
    const extMatch = props.src.match(/\.[^/.]+$/);
    if (extMatch) {
        ext = extMatch[0];
        base = props.src.replace(/\.[^/.]+$/, "");
    }
    
    // Check if the original src already includes _light or _dark
    if (base.endsWith('_light') || base.endsWith('_dark')) {
        base = base.replace(/_(light|dark)$/, "");
    }
    
    return darkmode.isDark ? `${base}_dark${ext}` : `${base}_light${ext}`;
});
</script>

<template>
    <img v-if="shouldRender" :src="imageSrc" :alt="alt" class="toggle-image toggleable" />
</template>

<style scoped>
.toggle-image {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1rem auto;
}
</style>
