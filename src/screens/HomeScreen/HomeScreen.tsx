import React, { useRef, useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	FlatList,
	ViewabilityConfig,
	ViewToken,
	ActivityIndicator,
	Text,
} from 'react-native';
import FeedPost from '../../components/FeedPost';
// import posts from '../../assets/data/posts.json';
import { API, graphqlOperation } from 'aws-amplify';
import { gql, useQuery } from '@apollo/client'; //gql have annotate graphQL query, useQuery help to run query

export const listPosts = gql`
	query ListPosts(
		$filter: ModelPostFilterInput
		$limit: Int
		$nextToken: String
	) {
		listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
			items {
				id
				description
				image
				images
				video
				nofComments
				nofLikes
				userID
				createdAt
				updatedAt
				_version
				_deleted
				_lastChangedAt
				User {
					id
					name
					username
					image
				}
				Comments {
					items {
						id
						comment
						User {
							id
							name
							username
						}
					}
				}
			}
			nextToken
			startedAt
		}
	}
`;

const HomeScreen = () => {
	const [activePostId, setActivePostId] = useState<string | null>(null);
	const { data, loading, error } = useQuery(listPosts);
	console.log('data:>>', data);
	console.log('loading:>>', loading);
	console.log('error:>>', error);
	const [posts, setPosts] = useState([]);

	// const fetchPosts = async () => {
	// 	const response = await API.graphql(graphqlOperation(listPosts));
	// 	setPosts(response.data.listPosts.items);
	// 	console.log('response:>>', response);
	// };

	// useEffect(() => {
	// 	fetchPosts();
	// }, []);

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
		return <Text>{error.message}</Text>;
	}

	return (
		<View>
			<FlatList
				data={posts}
				renderItem={({ item }) => (
					<FeedPost post={item} isVisible={activePostId === item.id} />
				)}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) => `post-${index}`}
				viewabilityConfig={viewabilityConfig}
				onViewableItemsChanged={onViewableItemsChanged.current}
			/>
		</View>
	);
};

export default HomeScreen;
