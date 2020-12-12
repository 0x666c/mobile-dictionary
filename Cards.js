import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { getAccent } from "./Accents";
import Config from "./Config";
import { jishoPartsOfSpeech } from "./Jisho";

function Tags({card}) {
	const theme = useTheme();
	const style = StyleSheet.create({
		tags: {
			flex: 0.196,
			flexDirection: "column",
			alignItems: "flex-start",
			justifyContent: "flex-start",
			marginLeft: 8,
			marginVertical: 10,
		},
		tagBubble: {
			flex: 0,
			textAlign: "center",
			width: 52,
			fontSize: 12.5,
			fontWeight: "bold",
			paddingVertical: 1.4,
			paddingHorizontal: 4,
			marginBottom: 5.3,
			borderRadius: 6,
			color: "white",
		},
		primaryTag: {
			backgroundColor: theme.colors.accent,
		},
		secondaryTag: {
			backgroundColor: "#909dc0",
		},
	});
	const getTagType = (tag) => {
		return ["firstPartOfSpeech", "isCommon"].includes(tag) ? "primaryTag" : "secondaryTag";
	};
	const evaluateInfo = (propName, propVal) => {
		if (propVal === undefined || propName === undefined) return null;
		switch (propName) {
			case "firstPartOfSpeech":
				const part = jishoPartsOfSpeech[propVal];
				return part !== undefined ? part : propVal;
			case "wanikani":
				return `WK-${propVal}`;
			case "jlpt":
				return `JLPT${propVal}`;
			case "isCommon":
				return propVal ? "C" : null;
			default:
				return null;
		}
	};
	return (
		<View style={style.tags}>
			{/* {[possibleTags.common]: [true], [possibleTags.jlpt]: [3], [possibleTags.partOfSpeech]: [partsOfSpeech.noun, partsOfSpeech.suruVerb]} */}
			{Object.entries(card.info).map(([infoName, infoData], i) => {
				const tagValue = evaluateInfo(infoName, infoData);
				if (tagValue === null) {
					return null;
				}
				return (
					<Text key={i} style={[style.tagBubble, style[getTagType(infoName)]]}>
						{tagValue}
					</Text>
				);
			})}
		</View>
	);
}

function Definition({definitionInfo}) {
	const style = StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: "column",
			justifyContent: "space-between",
			padding: 8,
			paddingTop: 3,
			paddingLeft: 2.5,

			margin: 5,
			marginLeft: 0,
		},
		wordWrapper: {
			marginBottom: 2,
		},
		noFurigana: {
			marginTop: 8.5,
		},
		furigana: {
			fontSize: 14,
			marginLeft: 6,
			marginBottom: 3,
			marginTop: 2,
			fontFamily: "NotoSansJP",
			lineHeight: 14 + 6,
		},
		lettersWrapper: {
			fontFamily: "NotoSansJPL",
			fontSize: 38,
			lineHeight: 38 + 4,
			flex: 1,
			flexDirection: "row",
			justifyContent: "flex-start",
			flexWrap: "wrap",
		},
		word: {
			flex: 0,
			flexDirection: "row",
			fontSize: 38,
			lineHeight: 38 + (Config.SHOW_ACCENT[2] ? 6 : 2),
		},
		pitchHigh: {
			borderTopColor: "red",
			borderTopWidth: 1,
		},
		pitchLow: {
			borderBottomColor: "red",
			borderBottomWidth: 1,
		},
		pitchLowToHigh: {
			borderBottomColor: "red",
			borderRightColor: "red",
			borderRightWidth: 1,
			borderBottomWidth: 1,
		},
		pitchHighToLow: {
			borderTopColor: "red",
			borderRightColor: "red",
			borderRightWidth: 1,
			borderTopWidth: 1,
		},

		definitionWrapper: {
			flexDirection: "column",
			justifyContent: "flex-start",
			marginBottom: "auto",
			marginTop: 4,
		},
		lineNumber: {
			color: "gray",
		},
		definition: {
			alignSelf: "flex-start",
			flexDirection: "column",
			flex: 0,
			fontSize: 14,
		},
		meaningRestricted: {
			color: "lightgray",
		},
	});
	const {meanings, word, reading} = definitionInfo;
	const accent = getAccent(word, reading);
	const mapAccentToStyle = (accentArray, index) => {
		if (accentArray === undefined || !Config.SHOW_ACCENT[2]) {
			return undefined;
		}
		const nextDiffers = accentArray[index + 1] !== undefined && accentArray[index + 1] !== accentArray[index];
		if (nextDiffers) {
			return accentArray[index] === 1 ? style.pitchHighToLow : style.pitchLowToHigh;
		} else {
			return accentArray[index] === 1 ? style.pitchHigh : style.pitchLow;
		}
    };
    
	return (
		<View style={style.container}>
			<View style={style.wordWrapper}>
				{reading ? <Text style={style.furigana}>{reading}</Text> : null}
				<View style={[style.lettersWrapper, !reading ? style.noFurigana : undefined]}>
					{word.split("").map((letter, i) => {
						return (
							<Text style={[style.word, mapAccentToStyle(accent?.mainPitch, i)]} key={i}>
								{letter}
							</Text>
						);
					})}
				</View>
			</View>
			<View style={style.definitionWrapper}>
				{meanings.map(({translation, restrictions}, i) => {
					return (
						<Text key={i}>
							<Text style={style.lineNumber}>{`${i + 1}. `}</Text>
							<Text style={style.definition}>{`${translation}.`}</Text>
							{restrictions.length ? (
								<Text style={style.meaningRestricted}>
									{` Only applies to `}
									{restrictions.map((r, i) => (
										<Text key={i} style={style.meaningRestricted}>{`${r}${i + 1 === restrictions.length ? "." : ", "}`}</Text>
									))}
								</Text>
							) : null}
						</Text>
					);
				})}
			</View>
			<View>{accent ? <Text>{`Accent: ${accent.mainPitch.join("")}`}</Text> : null}</View>
		</View>
	);
}

function Card({card, last}) {
	const style = StyleSheet.create({
		card: {
			flex: 1,
			borderRadius: 10,
			backgroundColor: "white",
			margin: 8,
			marginTop: 8,
			marginBottom: 0,
			flexDirection: "row",
			justifyContent: "flex-start",
		},
		lastCard: {
			marginBottom: 9,
		},
	});
	return (
		<View style={[style.card, last && style.lastCard]}>
			<Tags card={card}></Tags>
			<Definition definitionInfo={card}></Definition>
		</View>
	);
}

export default function Cards({cards}) {
	const componentMap = cards.map((card, i) => {
		return <Card key={i} card={card} last={cards.length - 1 === i}></Card>;
	});
	return <ScrollView>{componentMap}</ScrollView>;
}
