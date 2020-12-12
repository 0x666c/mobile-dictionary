// import { ToastAndroid } from "react-native";

export const getAccent = (kanji, reading) => {
	const accentMap = require("./assets/accent_map_nolines.json");

	if (accentMap === null) {
		return undefined;
	}

	const toFind = kanji !== undefined ? `${kanji}|${reading}` : `${reading}`;
	const accent = accentMap[toFind];
	if (!accent) {
		return undefined;
	}

	const mainPitch = accent.pitch[0];
	const pitch = accent.pitch.slice(1);
	// console.log("Looking up", toFind, "Result", accent, "Main pitch", mainPitch, "Othen pitches", pitch);

	const mapReadingToPitch = (pitch) => {
		let pitches = new Array(kanji.length).fill(0);
		if (pitch === 0) {
			pitches = pitches.fill(1);
			pitches[0] = 0;
		} else if (pitch === 1) {
			pitches = pitches.fill(0);
			pitches[0] = 1;
		} else {
			pitches = pitches.fill(1, 1, pitch);
		}
		return pitches;
	};

	return {
		mainPitch: mapReadingToPitch(mainPitch),
		otherPitches: pitch.map((p) => mapReadingToPitch(p)),
	};
};
