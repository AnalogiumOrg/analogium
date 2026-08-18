<script setup lang="ts">
import { useStaffStore } from '@/stores/staff';
import { useDarkMode } from '@/stores/darkmode';
import { computed } from 'vue';

const staffStore = useStaffStore();
const darkMode = useDarkMode();

const getImage = (heroImage: string) => {
	const suffix = darkMode.isDark ? '_dark.png' : '_light.png';
	return `/images/staff/${heroImage}${suffix}`;
};
</script>

<template>
	<div class="staff-directory">
		<h1>ANALOGIUM STAFF COMPLEX</h1>
		<div class="staff-grid">
			<router-link 
				v-for="member in staffStore.members" 
				:key="member.slug" 
				:to="`/staff/${member.slug}`" 
				class="staff-card"
			>
				<img :src="getImage(member.heroImage)" :alt="member.title" class="staff-badge" />
				<h3 class="title">{{ member.title }}</h3>
				<p class="desc">{{ member.description }}</p>
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.staff-directory {
	text-align: center;
	padding: 2rem 1rem;
	max-width: 1000px;
	margin: 0 auto;
}

h1 {
	text-transform: uppercase;
	margin-bottom: 2rem;
	letter-spacing: 2px;
	color: var(--color-heading);
}

.staff-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 2rem;
}

.staff-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1.5rem;
	background-color: var(--color-background-soft);
	border: 1px solid var(--color-border);
	border-radius: 8px;
	text-decoration: none;
	transition: transform 0.2s ease, border-color 0.2s ease;
}

.staff-card:hover {
	transform: translateY(-4px);
	border-color: var(--color-text);
}

.staff-badge {
	width: 120px;
	height: 120px;
	object-fit: contain;
	margin-bottom: 1rem;
}

.title {
	margin: 0.5rem 0;
	color: var(--color-heading);
	font-size: 1.25rem;
	text-transform: uppercase;
}

.desc {
	color: var(--color-text);
	font-size: 0.9rem;
}
</style>
