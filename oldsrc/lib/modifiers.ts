interface Modifier {
	internalCode: string;
	apply: () => void;
	unapply: () => void;
}

const modifiers = new Map<string, Modifier>();
const activeModifiers = new Set<string>();

export function addModifier(modifier: Modifier) {
	modifiers.set(modifier.internalCode, modifier);
}

export function applyModifier(internalCode: string, exclusive = true) {
	const modifier = modifiers.get(internalCode);
	if(!modifier) {
		console.error(`Modifier with internal code ${internalCode} not found`);
		return;
	}
	if (activeModifiers.has(internalCode)) {
		console.warn(`Modifier ${internalCode} already active`);
		return;
	}

	if (exclusive) {
		clearModifiers();
	}

	try {
		modifier.apply();
	}
	catch (error) {
		console.error(`Error applying modifier ${internalCode}: ${error}`);
	}
	finally {
		activeModifiers.add(internalCode);
	}
}

export function unapplyModifier(internalCode: string) {
	const modifier = modifiers.get(internalCode);
	if (modifier) {
		modifier.unapply();
		activeModifiers.delete(internalCode);
	}
}

export function clearModifiers() {
	activeModifiers.forEach((internalCode) => unapplyModifier(internalCode));
}