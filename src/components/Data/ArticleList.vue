<script setup lang="ts">
import axios from "axios";
import { onMounted, ref, type Ref } from "vue";

const posts: Ref<{
	title: string;
	shortDesc: string;
	route: string;
}[]> = ref([]);

onMounted(async () => {
	const res = await axios.get("/database/articles");
	posts.value = res.data;
});
</script>

<template>
	<ul class="article-list">
		<li v-for="post in posts" :key="post.title" class="article-item">
			<a :href="post.route">
				<span :title="post.shortDesc">{{ post.title }}</span>
			</a>
		</li>
	</ul>
</template>

<style scoped>
.article-list {
	align-items: center;
	justify-content: center;
	margin: 0;
	padding: 0;
}
.article-item {
	list-style: none;
	margin: 0;
	padding: 0;
}
</style>