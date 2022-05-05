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
import { postsByDate } from './queries';
import {
	ModelSortDirection,
	PostsByDateQuery,
	PostsByDateQueryVariables,
} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';

const HomeScreen = () => {
	const [activePostId, setActivePostId] = useState<string | null>(null);
	const { data, loading, error, refetch } = useQuery<
		PostsByDateQuery,
		PostsByDateQueryVariables
	>(postsByDate, {
		variables: { type: 'POST', sortDirection: ModelSortDirection.DESC },
	});

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

	const posts = (data?.postsByDate?.items || []).filter(
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
