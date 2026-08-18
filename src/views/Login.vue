<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
    await authStore.fetchProviders()
})

const login = (url: string) => {
    window.location.href = url
}
</script>

<template>
    <div class="login-container">
        <div class="login-box">
            <h2>ACCESS COMPLEX</h2>
            <p class="sub">Identify yourself to gain access.</p>
            <hr />
            <div class="providers">
                <button
                    v-for="provider in authStore.providers"
                    :key="provider.id"
                    @click="login(provider.login_url)"
                    class="provider-btn"
                >
                    [ LOGIN VIA {{ provider.name.toUpperCase() }} ]
                </button>
                <div v-if="authStore.providers.length === 0" class="no-providers">
                    — no providers configured —
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    padding: 3rem 1rem;
}

.login-box {
    border: 1px solid var(--border);
    padding: 2.5rem;
    width: 100%;
    max-width: 480px;
    text-align: center;
}

h2 {
    font-family: 'OldStyle', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin: 0 0 0.5rem;
    color: var(--font_color);
}

.sub {
    font-size: 0.9rem;
    color: var(--link);
    margin: 0 0 1.25rem;
}

hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0 0 2rem;
}

.providers {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.provider-btn {
    font-family: 'OldStyle', sans-serif;
    font-size: 0.95rem;
    letter-spacing: 2px;
    padding: 0.65rem 1rem;
    background-color: var(--color);
    color: var(--font_color);
    border: 1px solid var(--border);
    cursor: pointer;
    text-transform: uppercase;
    transition: border-color 0.15s, color 0.15s;
}

.provider-btn:hover {
    border-color: var(--font_color);
    color: var(--link);
}

.no-providers {
    color: var(--link);
    font-style: italic;
    font-size: 0.9rem;
}
</style>
