import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import CommentScreen from '../screens/CommentScreen/CommentScreen';

import { RootNavigatorParamList } from './type';

const Stack = createNativeStackNavigator<RootNavigatorParamList>(); // { Navigator, Screen }

const Navigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={{ headerShown: true }}
			>
				<Stack.Screen
					name="Home"
					component={BottomTabNavigator}
					options={{ headerShown: false }}
				/>

				<Stack.Screen name="Comments" component={CommentScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
