import { View, Text, FlatList } from 'react-native';
import React from 'react';
import users from '../../assets/data/users.json';
import UserListItem from '../../components/UserListItem';

const UserSearchScreen = () => {
	return (
		<FlatList
			data={users}
			renderItem={({ item }) => <UserListItem user={item} />}
		/>
	);
};

export default UserSearchScreen;
