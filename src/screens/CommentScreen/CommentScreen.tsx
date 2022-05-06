import { useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import {
	CommentsByPostQuery,
	CommentsByPostQueryVariables,
	ModelSortDirection,
} from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import Comment from '../../components/Comment';
import { CommentsRouteProp } from '../../types/navigation';
import Input from './Input';
import { commentsByPost } from './queries';

const CommentScreen = () => {
	const route = useRoute<CommentsRouteProp>();
	const { postId } = route.params;

	const { data, loading, error, fetchMore } = useQuery<
		CommentsByPostQuery,
		CommentsByPostQueryVariables
	>(commentsByPost, {
		variables: {
			postID: postId,
			sortDirection: ModelSortDirection.DESC,
			limit: 20,
		},
	});
	const [isFetchingMore, setIsFetchingMore] = useState(false);

	const comments = data?.commentsByPost?.items.filter(
		(comment) => !comment?._deleted,
	);

	const nextToken = data?.commentsByPost?.nextToken;

	const loadMore = async () => {
		if (!nextToken || isFetchingMore) {
			return;
		}
		setIsFetchingMore(true);
		await fetchMore({ variables: { nextToken } });
		setIsFetchingMore(false);
	};

	if (loading) {
		return <ActivityIndicator />;
	}

	if (error) {
		return (
			<ApiErrorMessage
				title="Error fetching comments"
				message={error.message}
			/>
		);
	}

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				data={comments}
				renderItem={({ item, index }) => (
					<Comment comment={item} includeDetails />
				)}
				contentContainerStyle={{ padding: 10 }}
				inverted
				ListEmptyComponent={() => (
					<Text>No comments. Be the first comment</Text>
				)}
				onEndReached={loadMore}
			/>
			<Input postId={postId} />
		</View>
	);
};

export default CommentScreen;
