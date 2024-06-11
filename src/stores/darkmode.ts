import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage, usePreferredDark } from '@vueuse/core'

export const useDarkMode = defineStore('darkmode', () => {

	const savedDarkMode = useLocalStorage('darkmode', usePreferredDark())
	const darkMode = ref(savedDarkMode.value)

	const toggleDarkMode = () => {
		darkMode.value = !darkMode.value
		savedDarkMode.value = darkMode.value
	}

	return {
		toggleDarkMode,
		mode: computed(() => darkMode.value ? 'dark' : 'light'),
		isDark: computed(() => darkMode.value),
	}
})
