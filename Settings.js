import {useNavigation} from "@react-navigation/native";
import React, {useState} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {Appbar, Paragraph, Switch} from "react-native-paper";
import Config from "./Config";

function Setting({name, params}) {
	const style = StyleSheet.create({
		view: {
			flex: 0,
			flexDirection: "row",
			justifyContent: "space-between",
			paddingLeft: 24,
			paddingRight: 36,
			alignItems: "center",
		},
		text: {fontSize: 18},

		swtich: {},
		number: {
			width: 64,
			textAlign: "center",
			fontSize: 18,
			backgroundColor: "white",
			backgroundColor: "#eee",
			borderRadius: 4,
			marginVertical: 20,
			height: 40,
		},
	});
	const [label, type, value] = params;
	const [stateValue, setStateValue] = useState(value);
	const updateValue = (newValue) => {
		setStateValue(newValue);
		Config[name][2] = newValue;
	};

	const renderSwitch = () => {
		return <Switch style={style.switch} onValueChange={updateValue} value={stateValue} />;
	};
	const renderNumberField = () => {
		return (
			<TextInput
				style={style.number}
				onChangeText={(text) => {
					const val = text.replace(/[^0-9]/g, "").substring(0, 2);
					return updateValue(val ? val : "");
				}}
				value={stateValue}
			/>
		);
	};
	const renderEmptyLeftSide = () => {
		return null;
	};

	let toRender = renderEmptyLeftSide;
	switch (type) {
		case "number":
			toRender = renderNumberField;
			break;
		case "boolean":
			toRender = renderSwitch;
			break;
		default:
			break;
	}
	return (
		<View style={style.view}>
			<Paragraph style={style.text}>{label}</Paragraph>
			{toRender()}
		</View>
	);
}

export default function Settings() {
	const style = StyleSheet.create({
		settingList: {
			backgroundColor: "white",
			flex: 1,
			flexDirection: "column",
		},
	});
	const {goBack} = useNavigation();
	return (
		<>
			<Appbar.Header>
				<Appbar.Action icon="arrow-left" onPress={goBack}></Appbar.Action>
				<Appbar.Content title="Settings"></Appbar.Content>
			</Appbar.Header>
			<View style={style.settingList}>
				{Object.entries(Config).map(([key, val], i) => (
					<Setting key={i} name={key} params={val} />
				))}
			</View>
		</>
	);
}
