import React from 'react';

import { LinkingOptions, NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import CommentScreen from '../screens/CommentScreen/CommentScreen';

import { RootNavigatorParamList } from '../types/navigation';
import AuthStackNavigator from './AuthStackNavigator';
import { useAuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { getUser } from './queries';
import { useQuery } from '@apollo/client';
import { GetUserQuery, GetUserQueryVariables } from '../API';
import EditProfileScreen from '../screens/EditProfileScreen';

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
	const { user, userId } = useAuthContext();
	const { data, loading, error } = useQuery<
		GetUserQuery,
		GetUserQueryVariables
	>(getUser, {
		variables: { id: userId },
	});

	const userData = data?.getUser;

	if (user === undefined || loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator />
			</View>
		);
	}

	let stackScreens = null;
	if (!user) {
		stackScreens = (
			<Stack.Screen
				name="Auth"
				component={AuthStackNavigator}
				options={{ title: 'Setup Profile', headerShown: false }}
			/>
		);
	} else if (!userData?.username) {
		stackScreens = (
			<Stack.Screen
				name="EditProfile"
				component={EditProfileScreen}
				options={{ headerShown: false }}
			/>
		);
	} else {
		stackScreens = (
			<>
				<Stack.Screen
					name="Home"
					component={BottomTabNavigator}
					options={{ headerShown: false }}
				/>
				<Stack.Screen name="Comments" component={CommentScreen} />
			</>
		);
	}

	return (
		<NavigationContainer linking={linking}>
			<Stack.Navigator screenOptions={{ headerShown: true }}>
				{stackScreens}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
