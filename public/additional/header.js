let isBBT = false;
const logo = document.querySelector(".logo");
let audio;

const makeBBT = () => {
	logo.src = logo.src.replace(
		"/images/web/Logo_light",
		"/images/secret/TBBTLogo_light",
	);
	setTimeout(() => {
		logo.src = logo.src.replace(
			"/images/web/Logo_light",
			"/images/secret/TBBTLogo_light",
		);
		if (audio) {
			console.log("playing");
			audio.play();
		} else {
			console.log("creating");
			audio = new Audio("/audio/secret/TBBT-Ambient.mp3");
			audio.loop = true;
			audio.play();
		}
	}, 200);
};

const undoBBT = () => {
	logo.src = logo.src.replace(
		"/images/secret/TBBTLogo_light",
		"/images/web/Logo_dark",
	);
	if (audio) {
		console.log("pausing");
		audio.pause();
		audio.currentTime = 0;
	}
};

/* useListen("THEBBTEVENT", (e) => {
	isBBT = true;
	if (logo.src.includes("_light")) {
		makeBBT();
	}
}); */

window.addEventListener("THEBBTEVENT", () => {
	isBBT = true;
	if (logo.src.includes("_light")) {
		makeBBT();
	}
});

window.addEventListener("setlightmode", () => {
	if (isBBT) {
		makeBBT();
	}
});
window.addEventListener("setdarkmode", () => {
	if (isBBT) {
		undoBBT();
	}
});