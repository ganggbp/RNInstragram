import React, { useRef, useState } from 'react';
import { View, ScrollView, FlatList, ViewabilityConfig, ViewToken } from 'react-native';
import FeedPost from '../../components/FeedPost';
import posts from '../../assets/data/posts.json';

const HomeScreen = () => {
	const [activePostId, setActivePostId] = useState<string | null>(null)

	const viewabilityConfig: ViewabilityConfig = {
		itemVisiblePercentThreshold: 51
	};

	// useful ex in tiktok stop playing video when item changed
	const onViewableItemsChanged = useRef(
		({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
			if (viewableItems.length > 0) {
				setActivePostId(viewableItems[0].item.id)
			}
		}
	);

	return (
		<View>
			<FlatList
				data={posts}
				renderItem={({ item }) => <FeedPost post={item} isVisible={activePostId === item.id} />}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) => `post-${index}`}
				viewabilityConfig={viewabilityConfig}
				onViewableItemsChanged={onViewableItemsChanged.current}
			/>
		</View>

	);
};

export default HomeScreen;
