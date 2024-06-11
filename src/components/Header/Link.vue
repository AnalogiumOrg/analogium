<template>
	<template v-if="props.href.startsWith('http')">
		<a :href="props.href" :class="[props.className, { active: isActive }]" target="_blank"
			rel="noopener noreferrer">
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
import { computed, toRef } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
	href: string;
	className?: string;
}>();
const router = useRouter();
const isActive = computed(() => {
	return toRef(router, 'currentRoute').value.path === props.href;
});
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