<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()

type Tab = 'users' | 'articles' | 'keycombinations'
const activeTab = ref<Tab>('users')

// Users State
interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}
const users = ref<User[]>([])
const isLoadingUsers = ref(false)

// Articles State
interface Article {
    id: number;
    enabled: boolean;
    name: string;
    short_description: string;
    uri: string;
    authored_by: string | null;
    header_image: string | null;
}
const articles = ref<Article[]>([])
const isLoadingArticles = ref(false)
const articleForm = ref<Partial<Article>>({})

// Key Combinations State
interface KeyCombination {
    id: number;
    key_combination: string;
    precomputed_hash: string | null;
    event_name: string;
}
const keycombs = ref<KeyCombination[]>([])
const isLoadingKeyCombs = ref(false)
const keycombForm = ref<Partial<KeyCombination>>({})

onMounted(async () => {
    await authStore.fetchUser()

    if (!authStore.user) {
        router.push('/login')
        return
    }

    if (authStore.user.role !== 'admin') {
        return
    }

    await fetchData()
})

const fetchData = async () => {
    if (activeTab.value === 'users') await fetchUsers()
    else if (activeTab.value === 'articles') await fetchArticles()
    else if (activeTab.value === 'keycombinations') await fetchKeyCombs()
}

const switchTab = async (tab: Tab) => {
    activeTab.value = tab
    await fetchData()
}

// Users Methods
const fetchUsers = async () => {
    isLoadingUsers.value = true
    try {
        const res = await axios.get('/api/admin/users')
        users.value = res.data
    } catch (err) {
        console.error("Failed to fetch users", err)
    } finally {
        isLoadingUsers.value = false
    }
}

const updateRole = async (userId: string, newRole: string) => {
    try {
        await axios.put(`/api/admin/users/${userId}/role`, { role: newRole })
        await fetchUsers()
    } catch (err) {
        console.error("Failed to update role", err)
        alert("Failed to update role")
    }
}

// Articles Methods
const fetchArticles = async () => {
    isLoadingArticles.value = true
    try {
        const res = await axios.get('/api/admin/articles')
        articles.value = res.data
    } catch (err) {
        console.error("Failed to fetch articles", err)
    } finally {
        isLoadingArticles.value = false
    }
}

const saveArticle = async () => {
    try {
        if (articleForm.value.id) {
            await axios.put(`/api/admin/articles/${articleForm.value.id}`, articleForm.value)
        } else {
            if (articleForm.value.enabled === undefined) articleForm.value.enabled = true
            await axios.post('/api/admin/articles', articleForm.value)
        }
        articleForm.value = {}
        await fetchArticles()
    } catch (err) {
        console.error("Failed to save article", err)
        alert("Failed to save article")
    }
}

const deleteArticle = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
        await axios.delete(`/api/admin/articles/${id}`)
        await fetchArticles()
    } catch (err) {
        console.error("Failed to delete article", err)
        alert("Failed to delete article")
    }
}

const editArticle = (article: Article) => {
    articleForm.value = { ...article }
}
const cancelEditArticle = () => {
    articleForm.value = {}
}

// Key Combinations Methods
const fetchKeyCombs = async () => {
    isLoadingKeyCombs.value = true
    try {
        const res = await axios.get('/api/admin/keycombinations')
        keycombs.value = res.data
    } catch (err) {
        console.error("Failed to fetch key combinations", err)
    } finally {
        isLoadingKeyCombs.value = false
    }
}

const saveKeyComb = async () => {
    try {
        await axios.post('/api/admin/keycombinations', keycombForm.value)
        keycombForm.value = {}
        await fetchKeyCombs()
    } catch (err) {
        console.error("Failed to save key combination", err)
        alert("Failed to save key combination")
    }
}

const deleteKeyComb = async (id: number) => {
    if (!confirm("Are you sure you want to delete this key combination?")) return
    try {
        await axios.delete(`/api/admin/keycombinations/${id}`)
        await fetchKeyCombs()
    } catch (err) {
        console.error("Failed to delete key combination", err)
        alert("Failed to delete key combination")
    }
}
</script>

<template>
    <div class="admin-container">
        <div v-if="authStore.isLoading" class="status-msg">
            — loading —
        </div>
        <div v-else-if="!authStore.user" class="status-msg">
            — redirecting —
        </div>
        <div v-else-if="authStore.user.role !== 'admin'" class="status-msg">
            <h2>ACCESS DENIED</h2>
            <p>You do not have clearance to access this area.</p>
        </div>
        <div v-else>
            <div class="admin-header">
                <h2>CONTROL CENTER</h2>
                <div class="admin-meta">
                    <span class="welcome">{{ authStore.user.name.toUpperCase() }}</span>
                    <button @click="authStore.logout" class="action-btn">[ LOGOUT ]</button>
                </div>
            </div>
            
            <div class="tabs">
                <button :class="['tab-btn', { active: activeTab === 'users' }]" @click="switchTab('users')">[ USERS ]</button>
                <button :class="['tab-btn', { active: activeTab === 'articles' }]" @click="switchTab('articles')">[ ARTICLES ]</button>
                <button :class="['tab-btn', { active: activeTab === 'keycombinations' }]" @click="switchTab('keycombinations')">[ KEY COMBINATIONS ]</button>
            </div>
            <hr />

            <!-- USERS TAB -->
            <div v-if="activeTab === 'users'">
                <h3>USER REGISTRY</h3>
                <div v-if="isLoadingUsers" class="status-msg">— loading users —</div>
                <table v-else class="admin-table">
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>CLEARANCE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in users" :key="user.id">
                            <td>{{ user.name }}</td>
                            <td>{{ user.email }}</td>
                            <td>
                                <select
                                    :value="user.role"
                                    @change="(e) => updateRole(user.id, (e.target as HTMLSelectElement).value)"
                                >
                                    <option value="user">USER</option>
                                    <option value="admin">ADMIN</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- ARTICLES TAB -->
            <div v-if="activeTab === 'articles'">
                <h3>ARTICLES REGISTRY</h3>
                
                <div class="form-container">
                    <h4>{{ articleForm.id ? 'EDIT ARTICLE' : 'NEW ARTICLE' }}</h4>
                    <form @submit.prevent="saveArticle" class="admin-form">
                        <input v-model="articleForm.name" placeholder="Name (e.g. Article Title)" required />
                        <input v-model="articleForm.uri" placeholder="URI (e.g. article.md)" required />
                        <textarea v-model="articleForm.short_description" placeholder="Short Description" required></textarea>
                        <input v-model="articleForm.authored_by" placeholder="Authored By (Optional)" />
                        <input v-model="articleForm.header_image" placeholder="Header Image URL (Optional)" />
                        <label>
                            <input type="checkbox" v-model="articleForm.enabled" />
                            Enabled
                        </label>
                        <div class="form-actions">
                            <button type="submit" class="action-btn">[ SAVE ]</button>
                            <button v-if="articleForm.id" type="button" @click="cancelEditArticle" class="action-btn">[ CANCEL ]</button>
                        </div>
                    </form>
                </div>

                <div v-if="isLoadingArticles" class="status-msg">— loading articles —</div>
                <table v-else class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>URI</th>
                            <th>ENABLED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="article in articles" :key="article.id">
                            <td>{{ article.id }}</td>
                            <td>{{ article.name }}</td>
                            <td>{{ article.uri }}</td>
                            <td>{{ article.enabled ? 'YES' : 'NO' }}</td>
                            <td>
                                <button @click="editArticle(article)" class="action-btn">[ EDIT ]</button>
                                <button @click="deleteArticle(article.id)" class="action-btn">[ DELETE ]</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- KEY COMBINATIONS TAB -->
            <div v-if="activeTab === 'keycombinations'">
                <h3>KEY COMBINATIONS</h3>
                
                <div class="form-container">
                    <h4>NEW KEY COMBINATION</h4>
                    <form @submit.prevent="saveKeyComb" class="admin-form">
                        <input v-model="keycombForm.key_combination" placeholder="Keystrokes (e.g. ctrl+shift+k)" required />
                        <input v-model="keycombForm.event_name" placeholder="Event Name (e.g. unlock_secret)" required />
                        <div class="form-actions">
                            <button type="submit" class="action-btn">[ ADD ]</button>
                        </div>
                    </form>
                </div>

                <div v-if="isLoadingKeyCombs" class="status-msg">— loading key combinations —</div>
                <table v-else class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>KEYSTROKES</th>
                            <th>EVENT NAME</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="kc in keycombs" :key="kc.id">
                            <td>{{ kc.id }}</td>
                            <td>{{ kc.key_combination }}</td>
                            <td>{{ kc.event_name }}</td>
                            <td>
                                <button @click="deleteKeyComb(kc.id)" class="action-btn">[ DELETE ]</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-container {
    padding: 2rem 0;
    max-width: 100%;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.tabs {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.tab-btn {
    font-family: 'OldStyle', sans-serif;
    font-size: 1rem;
    letter-spacing: 2px;
    background: none;
    color: var(--link);
    border: none;
    cursor: pointer;
    padding: 0.5rem 0;
    text-transform: uppercase;
}

.tab-btn:hover {
    color: var(--font_color);
}

.tab-btn.active {
    color: var(--font_color);
    font-weight: bold;
    text-decoration: underline;
}

h2 {
    font-family: 'OldStyle', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin: 0;
    color: var(--font_color);
}

h3, h4 {
    font-family: 'OldStyle', sans-serif;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--link);
}

h3 {
    font-size: 1rem;
    margin: 1.5rem 0 0.5rem;
}

h4 {
    font-size: 0.9rem;
    margin: 0 0 1rem;
}

hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0.75rem 0 1.5rem;
}

.admin-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.welcome {
    font-family: 'OldStyle', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 2px;
    color: var(--link);
}

.action-btn {
    font-family: 'OldStyle', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 2px;
    padding: 0.35rem 0.75rem;
    background-color: var(--color);
    color: var(--font_color);
    border: 1px solid var(--border);
    cursor: pointer;
    text-transform: uppercase;
    transition: border-color 0.15s, color 0.15s;
    margin-right: 0.5rem;
}

.action-btn:hover {
    border-color: var(--font_color);
    color: var(--link);
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    margin-bottom: 2rem;
}

.admin-table th {
    font-style: italic;
    font-size: 1rem;
    text-align: left;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    background-color: var(--color);
    color: var(--font_color);
}

.admin-table td {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    background-color: var(--color);
    color: var(--font_color);
    word-break: break-all;
}

select, input, textarea {
    font-family: 'OldStyle', sans-serif;
    font-size: 0.85rem;
    background-color: var(--color);
    color: var(--font_color);
    border: 1px solid var(--border);
    padding: 0.4rem;
    cursor: text;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
}

select {
    cursor: pointer;
}

.form-container {
    border: 1px solid var(--border);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.admin-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.admin-form label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    cursor: pointer;
}

.admin-form input[type="checkbox"] {
    width: auto;
    cursor: pointer;
}

.form-actions {
    margin-top: 1rem;
    display: flex;
    gap: 0.5rem;
}

.status-msg {
    text-align: center;
    padding: 2rem 0;
    color: var(--link);
    font-style: italic;
    font-size: 0.95rem;
}
</style>
