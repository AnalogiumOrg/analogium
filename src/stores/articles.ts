import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

interface Article {
	title: string;
	shortDesc: string;
	route: string;
}

export const useArticles = defineStore('articles', () => {
	const activeArticle = ref<string | null>(null)
	const articles = ref<Article[]>([])
	const setActiveArticle = (article: string) => {
		activeArticle.value = article
	}
	const fetchArticles = async () => {
		const res = await axios.get("/database/articles").catch((err) => {
			//console.error(err);
			console.error("Failed to fetch articles");
			return {
				data: [
					{
						title: "Failed to fetch articles",
						shortDesc: "Failed to fetch articles",
						route: "/data"
					}
				]
			};
		});
		articles.value = res.data;
	}

	return {
		activeArticle,
		articles,
		setActiveArticle
	}
})