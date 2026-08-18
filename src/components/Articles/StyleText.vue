<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    font: {
        type: String,
        required: true
    }
});

const fontClass = computed(() => {
    return `font-${props.font.toLowerCase()}`;
});
</script>

<template>
    <span :class="fontClass">
        <slot></slot>
    </span>
</template>

<style scoped>
.font-lunarian { font-family: 'Graffio', 'Lunarian', sans-serif; font-size: 1.2em; }
.font-nixon { font-family: 'Duke', 'Nixon', sans-serif; font-size: 1.1em; letter-spacing: 0.05em; }
.font-serpent { font-family: 'Through The Night', 'Serpent', sans-serif; }
.font-snow { font-family: 'CRAZY KILLER', 'Snow', sans-serif; }
.font-youcant { font-family: 'DIEDIEDIE', 'YouCant', sans-serif; letter-spacing: 0.1em; }
.font-golden { font-family: '1942', 'Golden', sans-serif; color: #ffd700; }
</style>
