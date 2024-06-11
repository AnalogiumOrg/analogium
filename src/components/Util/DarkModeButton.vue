<script setup lang="ts">
import { useDarkMode } from '@/stores/darkmode';
import { computed, onMounted } from 'vue';
const src = computed(() => useDarkMode().isDark ? `/images/web/mode_dark.svg` : `/images/web/mode_light.svg`);

const handleToggleClick = () => {
	useDarkMode().toggleDarkMode();
	updateTheme();
};

const updateTheme = () => {
	const root = document.documentElement;
	const blockquote = document.querySelector("blockquote");
	const theme = useDarkMode().mode;
	root.style.setProperty("--back", `var(--back_${theme})`);
	blockquote?.style.setProperty("--color", `var(--color_${theme})`);
	blockquote?.style.setProperty("--color-rgba", `var(--color-rgba_${theme})`);
	root.style.setProperty("--font_color", `var(--font_color_${theme})`);
	root.style.setProperty("--link", `var(--link_${theme})`);
	root.style.setProperty("--border", `var(--border_${theme})`);
	root.style.setProperty("--chica", `var(--chica_${theme})`);
	root.style.setProperty("--purple", `var(--purple_${theme})`);
	root.style.setProperty("--golden", `var(--golden_${theme})`);
	root.style.setProperty("--blood", `var(--blood_${theme})`);
	root.style.setProperty("--lunarian", `var(--lunarian_${theme})`);
};

onMounted(() => {
	updateTheme();
});
</script>
<template>
	<button class="mode" @click="handleToggleClick">
		<img :src="src" alt="THEMEBUTTON" class="l" />
	</button>
</template>
<style>
.mode {
	background: none;
	border: none;
	cursor: pointer;
	outline: none;
	padding: 0;
	position: fixed;
	right: 1rem;
	top: 1rem;
	z-index: 100;
}

.l {
	height: 3rem;
	width: 3rem;
}
</style>