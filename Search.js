import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import { TouchableRipple, useTheme } from "react-native-paper";
import TinySegmenter from "tiny-segmenter";

export default function Search({onSearch, onSearchNoCache, inputMode}) {
	const theme = useTheme();
	const style = StyleSheet.create({
		container: {
			borderWidth: 4,
			borderRadius: 5,
			borderColor: "#dadada",
			padding: 5,
			marginTop: 16,
			marginHorizontal: 16,
			flex: 0,
			flexDirection: "row",
			justifyContent: "space-between",
			backgroundColor: theme.colors.primary,
		},
		field: {
			paddingHorizontal: 6,
			fontSize: 20,
			flex: 1,
		},
		buttonContainer: {
			flex: 0,
			flexDirection: "row",
			alignItems: "center",
		},
		clear: {
			color: "#333",
			alignSelf: "center",
			textAlign: "center",
			padding: 4,
			fontSize: 26,
		},
		searchButtonContainer: {
			backgroundColor: "#f0f0f0",
			marginLeft: 4,
			borderRadius: 4,
			padding: 4,
		},
		searchButton: {
			color: "#333",
			alignSelf: "center",
			fontSize: 28,
		},
	});
	const [text, setText] = useState("");
	const clearText = () => {
		setText("");
	};
	const submitQuery = () => {
		onSearch(text);
	};
	const submitQueryNoCache = () => {
		onSearchNoCache(text);
	};
	return (
		<View style={{flex: 0, flexDirection: "column"}}>
			<View style={style.container}>
				<TextInput placeholder="Search!" style={style.field} value={text} onChangeText={(val) => setText(val)} onSubmitEditing={submitQuery}></TextInput>
				<View style={style.buttonContainer}>
					{text ? (
						<TouchableRipple onPress={clearText} rippleColor="darkgray">
							<MaterialCommunityIcons name="close" style={style.clear}></MaterialCommunityIcons>
						</TouchableRipple>
					) : null}
					<TouchableRipple onPress={submitQuery} onLongPress={submitQueryNoCache} rippleColor="darkgray" style={style.searchButtonContainer}>
						<MaterialCommunityIcons name="magnify" style={style.searchButton}></MaterialCommunityIcons>
					</TouchableRipple>
				</View>
			</View>
			<WordChooser input={text} onWordSelect={onSearch} />
		</View>
	);
}

const segmenter = new TinySegmenter();

function WordChooser({input, onWordSelect}) {
	const isParticle = (string) => {
		return ["は", "が", "を", "へ", "か", "の", "な", "も", "で", "に", "と", "や", "から", "まで"].includes(string || "");
	};
	const style = StyleSheet.create({
		view: {
			flex: 0,
			flexDirection: "row",
			flexWrap: "wrap",
			justifyContent: "flex-start",
			paddingHorizontal: 32,
			paddingTop: 12,
			marginBottom: 12,
		},
		wordWrapper: {
			flex: 1,
		},
		word: {
			fontSize: 28,
			color: "#432b21",
			borderBottomWidth: 1,
			borderBottomColor: "#432b21",
		},
		selectedWord: {
			fontSize: 28,
			color: "#432b21",
			borderBottomWidth: 2,
			borderBottomColor: "#432b21",
		},
		particle: {
			color: "red",
			borderBottomColor: "red",
		},
		wordSeparator: {},
	});
	const [selectedWord, setSelectedWord] = useState(-1);
	const [split, setSplit] = useState(segmenter.segment(input));
	const onWordPress = (word, index) => {
		if (__DEV__) ToastAndroid.show("Selected word: " + word, ToastAndroid.SHORT);
		setSelectedWord(index);
		onWordSelect(word);
	};
	useEffect(() => {
		setSplit(segmenter.segment(input));
	}, [input]);

	if (split.length <= 1) {
		return null;
	}
	return (
		<View style={style.view}>
			{split.map((word, i) => {
				return (
					<Text key={i} onPress={() => onWordPress(word, i)}>
						<View style={style.wordWrapper}>
							<Text style={[i === selectedWord ? style.selectedWord : style.word, isParticle(word) ? style.particle : undefined]}>{word}</Text>
						</View>
						<Text style={style.wordSeparator}>{"  "}</Text>
					</Text>
				);
			})}
		</View>
	);
}
