<template>
	<header>
		<Suspense>
			<!-- No Fallback -->
			<Background />
		</Suspense>
		<img v-if="!isAdminLayout" :src="logo" alt="ANALOGIUM" class="logo" />
		<h2></h2>
		<nav v-if="!isAdminLayout">
			<HeaderLink href="/">HOME</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="/data">DATA</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="https://twitter.com/ANALOGIUM414" target="_blank">
				TWITTER / X
			</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="https://www.instagram.com/analogium_/" target="_blank">
				INSTAGRAM
			</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="https://bsky.app/profile/analogium.bsky.social" target="_blank">
				BLUESKY
			</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="https://www.youtube.com/@analogium" target="_blank">
				YOUTUBE
			</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="/staff"> STAFF </HeaderLink>
		</nav>
		<nav v-else class="admin-nav">
			<HeaderLink href="/">HOME</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="/data">DATA</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="/staff">STAFF</HeaderLink> <span class="dot">•</span>
			<HeaderLink href="/admin">CONTROL CENTER</HeaderLink>
		</nav>
		<br />
	</header>
</template>

<script setup lang="ts">
import Background from '@/components/Background.vue';
import HeaderLink from '@/components/Header/Link.vue';
import { useDarkMode } from '@/stores/darkmode';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isAdminLayout = computed(() => route.path.startsWith('/admin'));
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

.dot {
	font-family: 'Duke', sans-serif;
	display: inline-block;
	margin: 0 0.35rem;
	color: var(--link);
}
</style>