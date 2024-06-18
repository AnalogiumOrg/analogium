<script setup lang="ts">
import { useArticles } from "@/stores/articles";
import axios from "axios";
import { computed, onMounted, ref, type Ref } from "vue";

const posts = computed(() => {
	return useArticles().articles;
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