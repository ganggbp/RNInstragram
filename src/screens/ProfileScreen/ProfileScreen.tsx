import React from 'react';
import { Image, FlatList } from 'react-native';

import { useRoute, useNavigation } from '@react-navigation/native';
import {
	UserProfileNavigationProp,
	UserProfileRouteProp,
	MyProfileNavigationProp,
	MyProfileRouteProp,
} from '../../types/navigation';

import user from '../../assets/data/user.json';
import FeedGridView from '../../components/FeedGridView';
import ProfileHeader from './ProfileHeader';

const ProfileScreen = () => {
	const route = useRoute<UserProfileRouteProp | MyProfileRouteProp>();
	const navigation = useNavigation<
		UserProfileNavigationProp | MyProfileNavigationProp
	>();

	const userId = route.params?.userId;
	// console.warn(userId);
	// query the user with userID

	return <FeedGridView data={user.posts} ListHeaderComponent={ProfileHeader} />;
};

export default ProfileScreen;
