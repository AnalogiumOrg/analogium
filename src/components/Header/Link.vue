<template>
	<template v-if="props.href.startsWith('http')">
		<a :href="props.href" :class="[props.className, { active: isActive }]" target="_blank" rel="noopener noreferrer">
			<slot />
		</a>
	</template>
	<template v-else>
		<RouterLink :to="props.href" :class="[props.className, { active: isActive }]">
			<slot />
		</RouterLink>
	</template>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';

const props = defineProps<{
	href: string;
	className?: string;
}>();
const pathname = useRoute().path;
const thehref = props.href;
const isActive = thehref === pathname || thehref === pathname.replace(/\/$/, "");
</script>

<style>
a {
	color: var(--link);
	display: inline-block;
	text-decoration: none;
}

a.active {
	font-weight: bolder;
	text-decoration: underline;
}

a:hover {
	color: var(--border);
	font-weight: bold;
	text-decoration: underline;
}
</style>