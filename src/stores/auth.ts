import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface Provider {
    id: string;
    name: string;
    login_url: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const providers = ref<Provider[]>([]);
    const isLoading = ref(false);

    const fetchUser = async () => {
        isLoading.value = true;
        try {
            const res = await axios.get("/api/auth/me");
            user.value = res.data;
        } catch (err) {
            user.value = null;
        } finally {
            isLoading.value = false;
        }
    };

    const fetchProviders = async () => {
        try {
            const res = await axios.get("/api/auth/providers");
            providers.value = res.data;
        } catch (err) {
            console.error("Failed to fetch auth providers", err);
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
            user.value = null;
            window.location.href = "/";
        } catch (err) {
            console.error("Failed to logout", err);
        }
    };

    return {
        user,
        providers,
        isLoading,
        fetchUser,
        fetchProviders,
        logout
    };
});
