<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
	audio: String,
});
let playing = false;
const tapePartsSources = {
	back: "/images/web/vhstape/back.svg",
	front: "/images/web/vhstape/front.svg",
	disk: "/images/web/vhstape/disk.svg",
};
const audioObj = new Audio(props.audio);
const disk_class = ref("tape_disk");
const current_time = ref("0:0");
const duration = ref("0:00");
const title = ref(props.audio?.split("/").pop()?.split(".")[0]);

const toggle = () => {
	playing = !playing;
	if (playing) {
		audioObj.play();
	} else {
		audioObj.pause();
	}
	disk_class.value = playing ? "tape_disk playing" : "tape_disk";
};

const transformTime = (time: number) => {
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time - minutes * 60);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

audioObj.addEventListener("timeupdate", () => {
	current_time.value = transformTime(audioObj.currentTime);
	if (!isNaN(audioObj.duration)) {
		duration.value = transformTime(audioObj.duration);
	}
});

audioObj.addEventListener("loadedmetadata", () => {
	duration.value = transformTime(audioObj.duration);
});

audioObj.addEventListener("ended", () => {
	playing = false;
	disk_class.value = "tape_disk";
});
</script>

<template>
	<center>
		<div class="tape_container">
			<div class="audio_tape" @click="toggle">
				<img :src="tapePartsSources.back" alt="Back of the tape" class="tape_back" />
				<div class="tape_disks">
					<img :src="tapePartsSources.disk" alt="Disk of the tape" :class="disk_class" />
					<div class="tape_separation"></div>
					<img :src="tapePartsSources.disk" alt="Disk of the tape" :class="disk_class" />
				</div>
				<div class="middle_overlay"></div>
				<img :src="tapePartsSources.front" alt="Front of the tape" class="tape_front" />
			</div>
			<div class="tape_details">
				<div class="tape_title">{{ title }}</div>
				<div class="tape_time">{{ current_time }} / {{ duration }}</div>
			</div>
		</div>
	</center>
</template>

<style scoped>
.audio_tape {
	height: 14rem;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
}

.audio_tape .tape_back {
	height: 14rem;
	z-index: 1;
	position: absolute;
}

.audio_tape .tape_front {
	height: 13.5rem;
	z-index: 3;
	position: absolute;
}

.tape_disk {
	height: 7rem;
}

.tape_disks {
	padding-top: 1rem;
	height: 14rem;
	position: absolute;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
}

.tape_separation {
	width: 6rem;
	height: 10rem;
	background-color: rgba(255, 255, 255, 0);
}

.middle_overlay {
	height: 14rem;
	width: 11.5rem;
	z-index: 3;
	background-color: rgb(255, 255, 255);
}

.tape_container {
	align-items: center;
	height: 14rem;
	width: 25rem;
	display: flex;
	flex-direction: column;
	margin: 2rem 0;
}

.tape_details {
	position: absolute;
	height: 14rem;
	width: 12rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 5;
	font-family: monospace;
	color: #000;
}

.tape_title {
	font-size: 1.2rem;
	font-weight: bold;
	z-index: 5;
}

.tape_time {
	font-size: 0.875rem;
}

.playing {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
