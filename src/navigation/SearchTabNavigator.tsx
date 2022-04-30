import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';

import CommentScreen from '../screens/CommentScreen/CommentScreen';
import UserSearchScreen from '../screens/UserSearchScreen';

import colors from '../theme/colors';
import { SearchTabNavigatorParamList } from '../types/navigation';

const Tab = createMaterialTopTabNavigator<SearchTabNavigatorParamList>();

const SearchTabNavigator = () => {
	const insets = useSafeAreaInsets(); //how large on top and bottom

	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: { paddingTop: insets.top },
				tabBarIndicatorStyle: { backgroundColor: colors.primary },
			}}
		>
			<Tab.Screen name="Users" component={UserSearchScreen} />
			<Tab.Screen name="Posts" component={CommentScreen} />
		</Tab.Navigator>
	);
};

export default SearchTabNavigator;
