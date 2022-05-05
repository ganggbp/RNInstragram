import { useQuery } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { CommentsByPostQuery, CommentsByPostQueryVariables } from '../../API';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import Comment from '../../components/Comment';
import { CommentsRouteProp } from '../../types/navigation';
import Input from './Input';
import { commentsByPost } from './queries';

const CommentScreen = () => {
	const route = useRoute<CommentsRouteProp>();
	const { postId } = route.params;
	const { data, loading, error } = useQuery<
		CommentsByPostQuery,
		CommentsByPostQueryVariables
	>(commentsByPost, { variables: { postID: postId } });

	const comments = data?.commentsByPost?.items.filter(
		(comment) => !comment?._deleted,
	);

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
				style={{ padding: 10 }}
				ListEmptyComponent={() => (
					<Text>No comments. Be the first comment</Text>
				)}
			/>
			<Input postId={postId} />
		</View>
	);
};

export default CommentScreen;
