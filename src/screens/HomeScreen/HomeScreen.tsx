import React, { useRef, useState, useEffect } from 'react';
import {
	View,
	FlatList,
	ViewabilityConfig,
	ViewToken,
	ActivityIndicator,
} from 'react-native';
import FeedPost from '../../components/FeedPost';
import { useQuery } from '@apollo/client'; //gql have annotate graphQL query, useQuery help to run query
import { listPosts } from './queries';
import { ListPostsQuery, ListPostsQueryVariables } from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const HomeScreen = () => {
	const [activePostId, setActivePostId] = useState<string | null>(null);
	const { data, loading, error, refetch } = useQuery<
		ListPostsQuery,
		ListPostsQueryVariables
	>(listPosts);

	const viewabilityConfig: ViewabilityConfig = {
		itemVisiblePercentThreshold: 51,
	};

	// useful ex in tiktok stop playing video when item changed
	const onViewableItemsChanged = useRef(
		({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
			if (viewableItems.length > 0) {
				setActivePostId(viewableItems[0].item.id);
			}
		},
	);

	if (loading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return (
			<ApiErrorMessage title="Error fetching posts" message={error.message} />
		);
	}

	const posts = (data?.listPosts?.items || []).filter(
		(post) => !post?._deleted,
	);

	return (
		<View>
			<FlatList
				data={posts}
				renderItem={({ item }) =>
					item && <FeedPost isVisible={activePostId === item.id} post={item} />
				}
				showsVerticalScrollIndicator={false}
				// keyExtractor={(item, index) => `post-${index}`}
				viewabilityConfig={viewabilityConfig}
				onViewableItemsChanged={onViewableItemsChanged.current}
				onRefresh={() => refetch()}
				refreshing={loading}
			/>
		</View>
	);
};

export default HomeScreen;
