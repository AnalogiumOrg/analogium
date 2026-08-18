<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useStaffStore } from '@/stores/staff';
import { useDarkMode } from '@/stores/darkmode';
import { computed } from 'vue';

const route = useRoute();
const staffStore = useStaffStore();
const darkMode = useDarkMode();

const member = computed(() => {
	const slug = route.params.slug as string;
	return staffStore.getMemberBySlug(slug);
});

const heroImageSrc = computed(() => {
	if (!member.value) return '';
	const suffix = darkMode.isDark ? '_dark.png' : '_light.png';
	return `/images/staff/${member.value.heroImage}${suffix}`;
});
</script>

<template>
	<div class="staff-member-container" v-if="member">
		<article>
			<img :src="heroImageSrc" :alt="member.title" class="staff-badge-large" />
			<h1 class="title">{{ member.title }}</h1>
			<hr />
			<div class="body-content" v-html="member.contentHtml"></div>
		</article>
		<h4 class="author-tag">Written by - {{ member.author }}</h4>
		<div class="back-link">
			<router-link to="/staff">← Back to Staff Directory</router-link>
		</div>
	</div>
	<div v-else class="not-found">
		<h2>Staff Member Not Found</h2>
		<router-link to="/staff">Back to Staff Directory</router-link>
	</div>
</template>

<style scoped>
.staff-member-container {
	max-width: 800px;
	margin: 2rem auto;
	padding: 0 1rem;
}

article {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.staff-badge-large {
	width: 180px;
	height: 180px;
	object-fit: contain;
	margin-bottom: 1.5rem;
}

.title {
	font-size: 2rem;
	margin: 0;
	text-align: center;
	text-transform: uppercase;
	color: var(--color-heading);
}

hr {
	width: 100%;
	border: 0;
	border-top: 1px solid var(--color-border);
	margin: 1.5rem 0;
}

.body-content {
	line-height: 1.8;
	font-size: 1.05rem;
	color: var(--color-text);
	width: 100%;
}

.body-content :deep(p) {
	margin-bottom: 1.25rem;
}

.author-tag {
	text-align: right;
	margin-top: 2rem;
	font-style: italic;
	color: var(--color-text);
}

.back-link {
	margin-top: 2rem;
	text-align: center;
}

.back-link a {
	color: var(--color-text);
	text-decoration: underline;
}

.not-found {
	text-align: center;
	padding: 4rem 1rem;
}
</style>
