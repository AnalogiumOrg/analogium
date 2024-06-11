<script setup lang="ts">
import List from '@/components/Articles/List.vue';
</script>
<template>
	<Suspense>
		<template #default>
			<List />
		</template>
		<template #fallback>
			<p>Loading...</p>
		</template>
	</Suspense>
</template>