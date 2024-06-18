<script setup lang="ts">
import List from '@/components/Articles/List.vue';
import ArticleView from '@/components/Articles/ArticleView.vue';
import { computed, toRef } from 'vue';
import { useRoute } from 'vue-router';

const showArticles = computed(() => {
	return toRef(useRoute(), 'path').value.endsWith('data');
});
</script>
<template>
	<template v-if="showArticles">
		<Suspense>
			<template #default>
				<List />
			</template>
			<template #fallback>
				<p>Loading Articles...</p>
			</template>
		</Suspense>
	</template>
	<template v-else>
		<Suspense>
			<template #default>
				<ArticleView />
			</template>
			<template #fallback>
				<p>Loading Article...</p>
			</template>
		</Suspense>
	</template>
</template>