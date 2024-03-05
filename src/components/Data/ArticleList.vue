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
	<ul>
		<li v-for="post in posts" :key="post.title" style="text-decoration: none;">
			<a :href="post.route">
				<span :title="post.shortDesc">{{ post.title }}</span>
			</a>
		</li>
	</ul>
</template>