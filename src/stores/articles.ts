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
	const currentArticleDetail = ref<{ title: string; short_desc: string; route: string; content: string } | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

	const setActiveArticle = (article: string | null) => {
		activeArticle.value = article
	}

	const fetchArticles = async () => {
		const res = await axios.get("/api/database/articles").catch((err) => {
			console.error("Failed to fetch articles", err);
			return {
				data: []
			};
		});
		articles.value = res.data;
	}

	const fetchArticleDetail = async (slug: string) => {
        isLoading.value = true
        error.value = null
        currentArticleDetail.value = null
		try {
			const res = await axios.get(`/api/database/article/${slug}`);
			currentArticleDetail.value = res.data;
		} catch (err) {
			console.error(`Failed to fetch article detail for ${slug}`, err);
            error.value = "Failed to load article";
		} finally {
            isLoading.value = false
        }
	}

	return {
		activeArticle,
		articles,
        currentArticleDetail,
        isLoading,
        error,
		setActiveArticle,
		fetchArticles,
        fetchArticleDetail
	}
})