<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

const users = ref<User[]>([])
const isLoadingUsers = ref(false)

onMounted(async () => {
    await authStore.fetchUser()

    if (!authStore.user) {
        router.push('/login')
        return
    }

    if (authStore.user.role !== 'admin') {
        return
    }

    await fetchUsers()
})

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
            <hr />

            <h3>USER REGISTRY</h3>
            <div v-if="isLoadingUsers" class="status-msg">— loading users —</div>
            <table v-else class="user-table">
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

h2 {
    font-family: 'OldStyle', sans-serif;
    font-size: 1.4rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin: 0;
    color: var(--font_color);
}

h3 {
    font-family: 'OldStyle', sans-serif;
    font-size: 1rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--link);
    margin: 1.5rem 0 0.5rem;
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
}

.action-btn:hover {
    border-color: var(--font_color);
    color: var(--link);
}

.user-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
}

.user-table th {
    font-style: italic;
    font-size: 1rem;
    text-align: left;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    background-color: var(--color);
    color: var(--font_color);
}

.user-table td {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    background-color: var(--color);
    color: var(--font_color);
    word-break: break-all;
}

select {
    font-family: 'OldStyle', sans-serif;
    font-size: 0.85rem;
    background-color: var(--color);
    color: var(--font_color);
    border: 1px solid var(--border);
    padding: 0.2rem 0.4rem;
    cursor: pointer;
}

.status-msg {
    text-align: center;
    padding: 2rem 0;
    color: var(--link);
    font-style: italic;
    font-size: 0.95rem;
}
</style>
