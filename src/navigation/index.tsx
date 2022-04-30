import React from 'react';

import { LinkingOptions, NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import CommentScreen from '../screens/CommentScreen/CommentScreen';

import { RootNavigatorParamList } from '../types/navigation';
import AuthStackNavigator from './AuthStackNavigator';

const Stack = createNativeStackNavigator<RootNavigatorParamList>(); // { Navigator, Screen }

const linking: LinkingOptions<RootNavigatorParamList> = {
	prefixes: ['gangphotos://', 'https://gangphotos.com'],
	config: {
		initialRouteName: 'Home',
		screens: {
			Comments: 'comments', //  gangphotos://comments
			// gangphotos://comments/user/123
			Home: {
				screens: {
					HomeStack: {
						initialRouteName: 'Feed',
						screens: {
							UserProfile: 'user/:userId',
						},
					},
				},
			},
		},
	},
};

const Navigation = () => {
	return (
		<NavigationContainer linking={linking}>
			<Stack.Navigator
				initialRouteName="Auth"
				screenOptions={{ headerShown: true }}
			>
				<Stack.Screen
					name="Auth"
					component={AuthStackNavigator}
					options={{ headerShown: false }}
				/>
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
