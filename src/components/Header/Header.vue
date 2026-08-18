<template>
	<header>
		<Suspense>
			<!-- No Fallback -->
			<Background />
		</Suspense>
		<img :src="logo" alt="ANALOGIUM" class="logo" />
		<h2></h2>
		<nav>
			<HeaderLink href="/">HOME</HeaderLink> •
			<HeaderLink href="/data">DATA</HeaderLink> •
			<HeaderLink href="https://twitter.com/ANALOGIUM414" target="_blank">
				TWITTER / X
			</HeaderLink> •
			<HeaderLink href="https://www.instagram.com/analogium_/" target="_blank">
				INSTAGRAM
			</HeaderLink> •
			<HeaderLink href="https://bsky.app/profile/analogium.bsky.social" target="_blank">
				BLUESKY
			</HeaderLink> •
			<HeaderLink href="https://www.youtube.com/@analogium" target="_blank">
				YOUTUBE
			</HeaderLink> •
			<HeaderLink href="/staff"> STAFF </HeaderLink>
		</nav>
		<br />
	</header>
</template>

<script setup lang="ts">
import Background from '@/components/Background.vue';
import HeaderLink from '@/components/Header/Link.vue';
import { useDarkMode } from '@/stores/darkmode';
import { computed } from 'vue';
const logo = computed(() => useDarkMode().isDark ? `/images/web/Logo_dark.png` : `/images/web/Logo_light.png`);
</script>

<style>
header {
	margin: 0;
	text-align: center;
	align-items: center;
	justify-content: center;
	display: flex;
	flex-direction: column;
}

h2 {
	margin: 0.5em 0;
}

.logo {
	width: 57.5%;
	height: 57.5%;
}

.text {
	width: 17rem;
	height: 4rem;
}
</style>