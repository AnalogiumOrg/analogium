<script setup lang="ts">
import ModeButton from "@/components/Util/DarkModeButton.vue";
const today = new Date();
</script>
<template>
	<footer>
		<ModeButton />
		<!-- &copy; {{ today.getFullYear() }} ANALOGIUM. -->
		&copy; {{ today.getFullYear() }} ANALOGIUM.
	</footer>
</template>
<style>
footer {
	padding: 25px;
	text-align: center;
}
</style>