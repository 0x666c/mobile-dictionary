import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppLoading } from "expo";
import * as Font from "expo-font";
import React from "react";
import { ToastAndroid } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Main } from "./Main";
import Settings from "./Settings";

const Stack = createStackNavigator();

DefaultTheme.animation.scale = 0.5;

export default class App extends React.Component {
	state = {
		fontLoaded: false,
	};

	async loadStuff() {
		await Font.loadAsync({MaterialCommunityIcons: require("./assets/material.ttf")});
		await Font.loadAsync({NotoSansJP: require("./assets/NotoSansJP-Regular.otf")});
		await Font.loadAsync({NotoSansJPL: require("./assets/NotoSansJP-Light.otf")});
	}

	render() {
		if (!this.state.fontLoaded) {
			return (
				<AppLoading
					startAsync={this.loadStuff}
					onFinish={() => this.setState({fontLoaded: true})}
					onError={(err) => {
						console.error(err);
						ToastAndroid.show(JSON.stringify(err).substring(0, 18), ToastAndroid.SHORT);
					}}
				></AppLoading>
			);
		}
		return (
			<>
				<NavigationContainer>
					<PaperProvider theme={theme}>
						<Stack.Navigator
							screenOptions={{
								headerShown: false,
							}}
						>
							<Stack.Screen name="Main" component={Main}></Stack.Screen>
							<Stack.Screen name="Settings" component={Settings}></Stack.Screen>
						</Stack.Navigator>
					</PaperProvider>
				</NavigationContainer>
			</>
		);
	}
}

export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: "white",
		accent: "#8abc83",
	},
};
