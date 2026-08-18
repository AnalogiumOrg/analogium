<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    base64: {
        type: String,
        required: true
    }
});

const decodedSvg = computed(() => {
    try {
        return atob(props.base64);
    } catch (e) {
        console.error("Failed to decode diagram base64:", e);
        return '<p class="error">Error decoding diagram</p>';
    }
});
</script>

<template>
    <div class="diagram-block" v-html="decodedSvg"></div>
</template>

<style scoped>
.diagram-block {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    max-width: 100%;
    overflow-x: auto;
    background-color: transparent;
}
.diagram-block :deep(svg) {
    max-width: 100%;
    height: auto;
}
.error {
    color: red;
    font-weight: bold;
}
</style>
