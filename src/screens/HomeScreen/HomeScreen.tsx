import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import FeedPost from '../../components/FeedPost';
import posts from '../../assets/data/posts.json';

const HomeScreen = () => {
	return (
		<FlatList
			data={posts}
			renderItem={({ item }) => <FeedPost post={item} />} //data = {item, index}
			showsVerticalScrollIndicator={false}
			keyExtractor={(item, index) => `post-${index}`}
		/>
	);
};

export default HomeScreen;
