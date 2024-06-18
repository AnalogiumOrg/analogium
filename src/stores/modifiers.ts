import { useEvent } from "@/lib/events";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

interface Modifier {
	internalCode: string;
	alwaysExclusive: boolean;
}

export const useModifiers = defineStore('modifiers', () => {

	const modifiers = ref(new Map<string, Modifier>())
	const activeModifiers = ref(new Set<string>());

	function addModifier(modifier: Modifier) {
		modifiers.value.set(modifier.internalCode, modifier);
	}

	function applyModifier(internalCode: string, exclusive = true) {
		const modifier = modifiers.value.get(internalCode);
		if (!modifier) {
			console.error(`Modifier with internal code ${internalCode} not found`);
			return;
		}
		if (activeModifiers.value.has(internalCode)) {
			console.warn(`Modifier ${internalCode} already active`);
			return;
		}

		if (exclusive || modifier.alwaysExclusive) {
			clearModifiers();
		}

		activeModifiers.value.add(internalCode);
		useEvent('modifier-applied');
	}

	function unapplyModifier(internalCode: string) {
		const modifier = modifiers.value.get(internalCode);
		if (modifier) {
			activeModifiers.value.delete(internalCode);
		}
	}

	function clearModifiers() {
		activeModifiers.value.forEach((internalCode) => unapplyModifier(internalCode));
	}

	const getModifiers = computed(() => Array.from(activeModifiers.value.values()));

	return {
		addModifier,
		applyModifier,
		unapplyModifier,
		clearModifiers,
		getModifiers,
	};
})
