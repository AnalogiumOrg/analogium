<script lang="ts">
import axios from "axios";
import { onMounted, type Ref, ref } from "vue";
const buffer: string[] = [];
const maxBufferLength = 255;
let lastTimestamp = 0;
/* Key listener */
window.addEventListener('keydown', async function (e) {
	const time = new Date().getTime();
	if (time - lastTimestamp > 1000) {
		console.debug("last buffer: ", buffer.join(""));
		console.debug("hash for last buffer: ", await getHash(buffer.join("")));
		buffer.splice(0, buffer.length);
	}
	if (buffer.length > maxBufferLength) {
		buffer.splice(0, buffer.length - maxBufferLength);
	}
	lastTimestamp = time;
	buffer.push(e.key);
	console.debug("buffer: ", buffer.join(""));
	matchHashes();
});

const combinationHashes: Ref<string[]> = ref([]);

async function getHash(input: string) {
	const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
	const hashText = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
	return hashText;
}
async function matchHashes() {
	const combined = buffer.join("");
	const hash = await getHash(combined);
	if (!combinationHashes.value.includes(hash)) {
		return;
	}
	console.log("Matched hash: ", hash);
	const res = await axios.post("/presentation/keycombinations", {
		keystrokes: combined,
	}).catch((err) => {
		console.error(err);
		return { data: "" };
	});
	console.log(res.data);
}
async function getCombinations() {
	const res = await axios.get("/presentation/keycombinations").catch((err) => {
		console.error(err);
		return { data: [] };
	});
	combinationHashes.value.splice(0, combinationHashes.value.length);
	combinationHashes.value.push(...res.data);
	console.debug("combinationHashes: ", combinationHashes);
}
onMounted(async () => {
	await getCombinations();
});
</script>

<template>
	<div><!-- KeyCombinator --></div>
</template>, ref, type Ref