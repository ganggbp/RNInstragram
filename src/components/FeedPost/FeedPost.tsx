import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { useNavigation } from '@react-navigation/native';
import { FeedNavigationProp } from '../../types/navigation';

import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import Comment from '../Comment';
import DoublePressable from '../DoublePressable';
import Carousel from '../Carousel';
import VideoPlayer from '../VideoPlayer';

import styles from './styles';
import { IPost } from '../../types/models';

interface IFeedPost {
	post: IPost;
	isVisible: boolean;
}

const FeedPost = (props: IFeedPost) => {
	const { post, isVisible = false } = props;

	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const navigation = useNavigation<FeedNavigationProp>();

	const navigateToUser = () => {
		navigation.navigate('UserProfile', {
			userId: post.user.id,
		});
	};

	const navigateToComments = () => {
		navigation.navigate('Comments', { postId: post.id });
	};

	const toggleDescriptionExpanded = () => {
		setIsDescriptionExpanded((prev) => !prev);
	};

	const toggleLike = () => {
		setIsLiked((v) => !v);
	};

	let content = null;
	if (post.image) {
		content = (
			<DoublePressable onDoublePress={toggleLike}>
				<Image
					source={{
						uri: post.image,
					}}
					style={styles.image}
				/>
			</DoublePressable>
		);
	} else if (post.images) {
		content = <Carousel images={post.images} onDoublePress={toggleLike} />;
	} else if (post.video) {
		content = (
			<DoublePressable onDoublePress={toggleLike}>
				<VideoPlayer uri={post.video} paused={!isVisible} />
			</DoublePressable>
		);
	}

	return (
		<View style={styles.post}>
			{/* Header */}
			<View style={styles.header}>
				<Image
					source={{
						uri: post.user.image,
					}}
					style={styles.userAvatar}
				/>
				<Text onPress={navigateToUser} style={styles.userName}>
					{post.user.username}
				</Text>
				<Entypo
					name="dots-three-horizontal"
					size={16}
					style={styles.threeDots}
				/>
			</View>
			{/* Content */}
			{content}

			{/* Footer */}
			<View style={styles.footer}>
				<View style={styles.iconContainer}>
					<Pressable onPress={toggleLike}>
						<AntDesign
							name={isLiked ? 'heart' : 'hearto'}
							size={24}
							style={styles.icon}
							color={isLiked ? colors.accent : colors.black}
						/>
					</Pressable>

					<Ionicons
						name="chatbubble-outline"
						size={24}
						style={styles.icon}
						color={colors.black}
					/>
					<Feather
						name="send"
						size={24}
						style={styles.icon}
						color={colors.black}
					/>
					<Feather
						name="bookmark"
						size={24}
						style={{ marginLeft: 'auto' }}
						color={colors.black}
					/>
				</View>

				{/* Likes */}
				<Text style={styles.text}>
					Liked by <Text style={styles.bold}>toonpyb</Text> and{' '}
					<Text style={styles.bold}>{post.nofLikes} others</Text>
				</Text>

				{/* Post description */}
				<Text style={styles.text} numberOfLines={isDescriptionExpanded ? 0 : 3}>
					<Text style={styles.bold}>{post.user.username}</Text>{' '}
					{post.description}
				</Text>
				<Text onPress={toggleDescriptionExpanded}>
					{isDescriptionExpanded ? 'less' : 'more'}
				</Text>

				{/* Comments */}
				<Text onPress={navigateToComments}>
					View all {post.nofComments} comments
				</Text>
				{post.comments.map((comment) => (
					<Comment key={comment.id} comment={comment} />
				))}

				{/* Posted date */}
				<Text>{post.createdAt}</Text>
			</View>
		</View>
	);
};

export default FeedPost;
