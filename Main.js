import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Appbar, Divider, Menu, useTheme } from "react-native-paper";
import Cards from "./Cards";
import Jisho from "./Jisho";
import Search from "./Search";

const headerIcon = require("./assets/jisho-logo.png");
const jisho = new Jisho();

function AppbarImage({isLoading}) {
	const theme = useTheme();
	const styles = StyleSheet.create({
		view: {flex: 0, flexDirection: "row"},
		image: {
			height: 35,
			width: 76,
			marginRight: 6,
		},
	});
	return (
		<Appbar.Content
			titleStyle={{flex: 0}}
			title={
				<View style={styles.view}>
					<Image resizeMode="contain" style={styles.image} source={headerIcon}></Image>
					<ActivityIndicator hidesWhenStopped={true} size="small" animating={isLoading} color={theme.colors.accent} />
				</View>
			}
		></Appbar.Content>
	);
}

function AppbarMenu() {
	const style = {
		flex: 0,
	};
	const {navigate} = useNavigation();
	const [open, setOpen] = useState(false);
	const show = () => setOpen(true);
	const hide = () => setOpen(false);
	return (
		<Menu
			visible={open}
			onDismiss={hide}
			anchor={
				<Appbar.Action style={style} icon="dots-vertical" onPress={show}>
					Show menu
				</Appbar.Action>
			}
		>
			<Menu.Item
				onPress={() => {
					hide();
					navigate("Settings");
				}}
				title="Settings"
			/>
			<Divider></Divider>
			
			<Menu.Item onPress={() => {}} title="About" />
		</Menu>
	);
}
//<Menu.Item onPress={() => {}} title="Feedback" />
function SearchResultsEmpty({query}) {
	const style = StyleSheet.create({
		view: {flex: 1},
		text: {fontSize: 32, textAlign: "center"},
	});
	return (
		<View style={style.view}>
			<Text style={style.text}>{`Could not find anything mathing '${query}'`}</Text>
		</View>
	);
}

export function Main() {
	const style = StyleSheet.create({
		bodyContainer: {
			flex: 1,
			flexDirection: "column",
		},
	});

	const [state, setState] = useState({
		cards: undefined,
		isFetching: false,
		query: "",
	});
	// const [cards, setCards] = useState();
	// const [isFetching, setIsFetching] = useState(false);
	// const [query, setQuery] = useState("");

	const inputAndFind = async (query, noCache = false) => {
		// Accents.loadMap()
		//setQuery(query);
		// setIsFetching(true);
		setState((prevState) => {
			return {
				...prevState,
				query,
				isFetching: true,
			};
		});

		const fetched = await jisho.word(query, noCache);
		// ToastAndroid.show("Fetched: " + (fetched ? fetched.length : "-1"), ToastAndroid.SHORT);
		// setCards(fetched);
		// setIsFetching(false);
		setState((prevState) => {
			return {
				...prevState,
				cards: fetched,
				isFetching: false,
			};
		});
	};

	// useEffect(() => {
	// 	loadMap(() => console.log("loaded map"));
	// }, []);

	return (
		<>
			<Appbar.Header>
				<AppbarImage isLoading={state.isFetching}></AppbarImage>
				<AppbarMenu></AppbarMenu>
			</Appbar.Header>
			<View style={style.bodyContainer}>
				<Search onSearch={inputAndFind} onSearchNoCache={(querY) => inputAndFind(querY, true)}></Search>
				{!state.isFetching && state.query.length !== 0 ? (
					<>{state.cards?.length ? <Cards cards={state.cards}></Cards> : <SearchResultsEmpty query={state.query}></SearchResultsEmpty>}</>
				) : null}
			</View>
		</>
	);
}
