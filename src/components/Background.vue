<script setup lang="ts">
import KeyListener from "@/components/Util/KeyListener.vue";
import { useDarkMode } from "@/stores/darkmode";
import {
	Assets,
	Application,
	Container,
	Sprite,
	RAD_TO_DEG,
} from "pixi.js";

const app = new Application({
	backgroundAlpha: 0,
	width: window.innerWidth,
	height: window.innerHeight,
	antialias: true,
	resolution: 1,
	resizeTo: window,
});
// @ts-ignore
document.body.append(app.view);

const container = new Container();
app.stage.addChild(container);

const eyeTextures = {
	dark: [
		await Assets.load("/images/web/backeyes/eye1_dark.png"),
		await Assets.load("/images/web/backeyes/eye2_dark.png"),
		await Assets.load("/images/web/backeyes/eye3_dark.png"),
	],
	light: [
		await Assets.load("/images/web/backeyes/eye1_light.png"),
		await Assets.load("/images/web/backeyes/eye2_light.png"),
		await Assets.load("/images/web/backeyes/eye3_light.png"),
	],
};
const irisTextures = {
	dark: [
		await Assets.load("/images/web/backeyes/iris.png"),
		await Assets.load("/images/web/backeyes/iris.png"),
		await Assets.load("/images/web/backeyes/iris.png"),
	],
};
const randEyeTex = () => {
	return Math.ceil((Math.random() + 0.2) * eyeTextures.dark.length);
};
const origEyeRat = eyeTextures.dark.map(
	(t) => t.orig.width / t.orig.height,
);
const origIrisRat = irisTextures.dark.map(
	(t) => t.orig.width / t.orig.height,
);
const distMtrx = [
	[
		randEyeTex(),
		0,
		randEyeTex(),
		0,
		0,
		0,
		0,
		randEyeTex(),
		0,
		randEyeTex(),
	],
	[],
	[0, randEyeTex(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, randEyeTex(), 0],
	[],
	[
		randEyeTex(),
		0,
		0,
		randEyeTex(),
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		randEyeTex(),
		0,
		0,
		randEyeTex(),
	],
	[],
	[0, 0, 0, randEyeTex(), 0, 0, 0, 0, 0, 0, 0, 0, randEyeTex(), 0, 0, 0],
	[randEyeTex(), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, randEyeTex()],
	[],
	[
		randEyeTex(),
		0,
		randEyeTex(),
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		randEyeTex(),
		0,
	],
];
const calcEyePos = (i: number, j: number) => {
	return {
		x: (window.innerWidth / (distMtrx[i].length + 1)) * (j + 1),
		y: (window.innerHeight / (distMtrx.length + 1)) * (i + 1),
	};
};
const calcEyeSize = () => {
	return 40 * Math.log(window.innerWidth / 100);
};
const calcIrisSize = () => {
	return calcEyeSize() * 0.475;
};
const calcOpacity = () => {
	return Math.min(1, Math.max(0.5, calcEyeSize() / 125));
};
const eyeData: {
	index: { i: number; j: number };
	texNum: number;
	position: { x: number; y: number };
	baseSize: { x: number; y: number };
	alpha: number;
	angle: number;
	darkMode: boolean;
	scale: number;
	sprite?: Sprite;
}[] = [];

const IrisBehavior = {
	fixation: {
		name: "fixation",
		timeMultiplier: 0.8,
		weight: 10,
	},
	stare: {
		name: "stare",
		timeMultiplier: 0.5,
		weight: 2,
	},
	follow: {
		name: "follow",
		timeMultiplier: 0.3,
		weight: 3,
	},
} as const;
type IrisBehavior = (typeof IrisBehavior)[keyof typeof IrisBehavior];

type IrisData = {
	index: { i: number; j: number };
	texNum: number;
	initialPosition: { x: number; y: number };
	baseSize: { x: number; y: number };
	alpha: number;
	angle: number;
	darkMode: boolean;
	scale: number;
	maxDistance: number;
	currentOffset: { x: number; y: number };
	startOffset: { x: number; y: number };
	targetOffset: { x: number; y: number };
	saccadeElapsedMs: number;
	saccadeDurationMs: number;
	isFixating: boolean;
	fixationElapsedMs: number;
	maxFixationMs: number;
	currentBehavior: IrisBehavior;
	behaviorElapsedMs: number;
	maxBehaviorMs: number;
	lockBehavior: boolean;
	widthToHeightRatio: number;
	sprite?: Sprite;
};

const irisData: IrisData[] = [];

const generateEntities = () => {
	for (let i = 0; i < distMtrx.length; i++) {
		for (let j = 0; j < distMtrx[i].length; j++) {
			if (distMtrx[i][j] === 0) continue;
			const eyeSize = calcEyeSize();
			const irisSize = calcIrisSize();
			const opacityMod = calcOpacity();
			const eye = {
				index: { i, j },
				texNum: distMtrx[i][j],
				position: calcEyePos(i, j),
				baseSize: {
					x: eyeSize,
					y: eyeSize * origEyeRat[distMtrx[i][j] - 1],
				},
				widthToHeightRatio: origEyeRat[distMtrx[i][j] - 1],
				alpha: opacityMod,
				angle: 0,
				darkMode: true,
				scale: 1,
			};
			const iris: IrisData = {
				index: { i, j },
				texNum: distMtrx[i][j],
				initialPosition: calcEyePos(i, j),
				baseSize: {
					x: irisSize,
					y: irisSize,
				},
				widthToHeightRatio: origIrisRat[distMtrx[i][j] - 1],
				alpha: opacityMod,
				angle: 0,
				darkMode: true,
				scale: 1,
				maxDistance: irisSize * 0.3625,
				currentOffset: { x: 0, y: 0 },
				startOffset: { x: 0, y: 0 },
				targetOffset: { x: 0, y: 0 },
				saccadeElapsedMs: 0,
				saccadeDurationMs: 40,
				isFixating: false,
				fixationElapsedMs: 0,
				maxFixationMs: Math.floor(200 + Math.pow(Math.random(), 2.2) * 7200),
				currentBehavior: IrisBehavior.fixation,
				behaviorElapsedMs: 0,
				maxBehaviorMs: 3000 + Math.random() * 5000,
				lockBehavior: false,
			};
			eyeData.push(eye);
			irisData.push(iris);
		}
	}
};
const setPositions = () => {
	for (let i = 0; i < eyeData.length; i++) {
		eyeData[i].position = calcEyePos(
			eyeData[i].index.i,
			eyeData[i].index.j,
		);
		irisData[i].initialPosition = calcEyePos(
			irisData[i].index.i,
			irisData[i].index.j,
		);
	}
};
const setRotation = () => {
	for (let i = 0; i < eyeData.length; i++) {
		const angleRadians = Math.atan2(
			eyeData[i].position.y - window.innerHeight / 2,
			eyeData[i].position.x - window.innerWidth / 2,
		);
		eyeData[i].angle = angleRadians * RAD_TO_DEG;
		irisData[i].angle = angleRadians * RAD_TO_DEG;
		if (eyeData[i].position.x > window.innerWidth / 2) {
			eyeData[i].scale = -1;
			irisData[i].scale = 1;
		} else {
			eyeData[i].scale = 1;
			eyeData[i].angle += 180;
		}
		eyeData[i].baseSize.x =
			calcEyeSize() * origEyeRat[eyeData[i].texNum - 1];
		eyeData[i].baseSize.y = calcEyeSize();

		irisData[i].baseSize.x =
			calcIrisSize() * origIrisRat[irisData[i].texNum - 1];
		irisData[i].baseSize.y = calcIrisSize();

		eyeData[i].alpha = calcOpacity();
		irisData[i].alpha = calcOpacity();
	}
};
const setThemeMode = (m: "dark" | "light") => {
	for (let i = 0; i < eyeData.length; i++) {
		eyeData[i].darkMode = m === "dark";
		irisData[i].darkMode = m === "dark";
	}
	setPositions();
	setRotation();
	initialDraw();
};
const initialDraw = () => {
	container.removeChildren();
	for (let i = 0; i < eyeData.length; i++) {
		let eye;
		let iris;
		if (eyeData[i].darkMode) {
			eye = new Sprite(eyeTextures.dark[eyeData[i].texNum - 1]);
			iris = new Sprite(irisTextures.dark[eyeData[i].texNum - 1]);
		} else {
			eye = new Sprite(eyeTextures.light[eyeData[i].texNum - 1]);
			iris = new Sprite();
		}
		eye.anchor.set(0.5);
		iris.anchor.set(0.5);
		eye.position.set(eyeData[i].position.x, eyeData[i].position.y);
		iris.position.set(
			irisData[i].initialPosition.x,
			irisData[i].initialPosition.y,
		);
		eye.alpha = eyeData[i].alpha;
		iris.alpha = irisData[i].alpha;
		eye.angle = eyeData[i].angle;
		iris.angle = irisData[i].angle;
		eye.scale.x = eyeData[i].scale;
		iris.scale.x = irisData[i].scale;
		eye.width = eyeData[i].baseSize.x;
		eye.height = eyeData[i].baseSize.y;
		iris.width = irisData[i].baseSize.x;
		iris.height = irisData[i].baseSize.y;
		eyeData[i].sprite = eye;
		irisData[i].sprite = iris;
		container.addChild(eye);
		container.addChild(iris);
	}
};

const weightedRandom = (weights: number[]) => {
	const totalWeight = weights.reduce((a, b) => a + b);
	const randomNum = Math.random() * totalWeight;
	let weightSum = 0;
	for (let i = 0; i < weights.length; i++) {
		weightSum += weights[i];
		if (randomNum <= weightSum) {
			return i;
		}
	}
	return 0;
};
const getNewBehavior = (): IrisBehavior => {
	return Object.values(IrisBehavior)[
		weightedRandom(Object.values(IrisBehavior).map((b) => b.weight))
	];
};

const getRandomTarget = (iris: IrisData): { x: number; y: number } => {
	const angle = Math.random() * Math.PI * 2;
	const distFraction =
		iris.currentBehavior.name === "stare"
			? Math.random() * 0.2
			: 0.6 + Math.random() * 0.4;
	const dist = iris.maxDistance * distFraction;
	return {
		x: Math.cos(angle) * dist,
		y: Math.sin(angle) * dist,
	};
};

const calcFixationMs = (iris: IrisData) => {
	const timeMult = iris.currentBehavior.timeMultiplier ?? 0.8;
	const rand = Math.random();
	const minHoldMs = 200;
	const maxSpanMs = 9000 * timeMult;
	return Math.floor(minHoldMs + Math.pow(rand, 2.2) * maxSpanMs);
};

const startSaccade = (iris: IrisData, target: { x: number; y: number }) => {
	iris.startOffset = { ...iris.currentOffset };
	iris.targetOffset = target;
	iris.saccadeDurationMs = 30 + Math.random() * 30;
	iris.saccadeElapsedMs = 0;
	iris.isFixating = false;
};

const advanceBehavior = (iris: IrisData) => {
	if (!iris.lockBehavior) {
		iris.currentBehavior = getNewBehavior();
	}
	iris.behaviorElapsedMs = 0;
	iris.maxBehaviorMs = 3000 + Math.random() * 5000;
	startSaccade(iris, getRandomTarget(iris));
};

window.addEventListener("resize", () => {
	setPositions();
	setRotation();
	initialDraw();
});
const darkmode = useDarkMode();
window.addEventListener("setdarkmode", () => {
	setThemeMode("dark");
});
window.addEventListener("setlightmode", () => {
	setThemeMode("light");
});
// huh...
window.addEventListener("THEBBTEVENT", () => {
	const behab = () => {
		setTimeout(async () => {
			const bbtAsset = await Assets.load(
				"/images/secret/SheldonHead.png",
			);
			const bbt = new Sprite(bbtAsset);
			for await (const eye of eyeData) {
				if (!eye.sprite) continue;
				if (eye.darkMode) continue;
				eye.sprite.texture = bbt.texture;
			}
		}, 1);
	};
	window.addEventListener("setlightmode", () => {
		behab();
	});
	behab();
});

generateEntities();
setRotation();
initialDraw();

app.ticker.add(() => {
	const deltaMS = app.ticker.deltaMS;
	const mousePos = app.renderer.events.pointer.global;

	for (const iris of irisData) {
		if (!iris.sprite) continue;

		iris.behaviorElapsedMs += deltaMS;
		if (!iris.lockBehavior && iris.behaviorElapsedMs >= iris.maxBehaviorMs) {
			advanceBehavior(iris);
		}

		if (iris.currentBehavior.name === "follow") {
			const dx = mousePos.x - iris.initialPosition.x;
			const dy = mousePos.y - iris.initialPosition.y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			const clampedDist = Math.min(dist, iris.maxDistance);
			const scale = dist > 0.001 ? clampedDist / dist : 0;
			const targetX = dx * scale;
			const targetY = dy * scale;

			const lerpFactor = 1 - Math.exp(-12 * deltaMS / 1000);
			iris.currentOffset.x += (targetX - iris.currentOffset.x) * lerpFactor;
			iris.currentOffset.y += (targetY - iris.currentOffset.y) * lerpFactor;
		} else {
			if (!iris.isFixating) {
				iris.saccadeElapsedMs += deltaMS;
				const t = Math.min(
					iris.saccadeElapsedMs / iris.saccadeDurationMs,
					1,
				);
				const eased = 1 - Math.pow(1 - t, 3);
				iris.currentOffset.x =
					iris.startOffset.x +
					(iris.targetOffset.x - iris.startOffset.x) * eased;
				iris.currentOffset.y =
					iris.startOffset.y +
					(iris.targetOffset.y - iris.startOffset.y) * eased;

				if (t >= 1) {
					iris.currentOffset.x = iris.targetOffset.x;
					iris.currentOffset.y = iris.targetOffset.y;
					iris.isFixating = true;
					iris.fixationElapsedMs = 0;
					iris.maxFixationMs = calcFixationMs(iris);
				}
			} else {
				iris.fixationElapsedMs += deltaMS;
				const jitter = 0.15;
				iris.currentOffset.x += (Math.random() - 0.5) * jitter;
				iris.currentOffset.y += (Math.random() - 0.5) * jitter;

				if (iris.fixationElapsedMs >= iris.maxFixationMs) {
					startSaccade(iris, getRandomTarget(iris));
				}
			}
		}

		const ox = iris.currentOffset.x;
		const oy = iris.currentOffset.y;
		const r = Math.sqrt(ox * ox + oy * oy);
		const clampR = iris.maxDistance;
		const clampedOx = r > clampR ? (ox / r) * clampR : ox;
		const clampedOy = r > clampR ? (oy / r) * clampR : oy;

		iris.sprite.position.set(
			iris.initialPosition.x + clampedOx,
			iris.initialPosition.y + clampedOy,
		);
	}
});
window.dispatchEvent(new Event("forceUpdateTheme"));
</script>

<template>
	<Suspense>
		<KeyListener />
	</Suspense>
</template>