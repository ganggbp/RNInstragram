import React, { useState } from 'react';

import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Comment as CommentType } from '../../API';
import { DEFAULT_USER_IMAGE } from '../../config';
import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import dayjs from 'dayjs';
import UserImage from '../UserImage';

interface ICommentProps {
	comment: CommentType;
	includeDetails?: boolean;
	isNew?: boolean;
}

const Comment = ({
	comment,
	includeDetails = false,
	isNew = false,
}: ICommentProps) => {
	const [isLiked, setIsLiked] = useState(false);

	const toggleLike = () => {
		setIsLiked((prev) => !prev);
	};

	return (
		<View style={styles.comment}>
			{includeDetails && (
				<UserImage imageKey={comment?.User?.image || undefined} width={40} />
			)}

			<View style={styles.middleColumn}>
				<Text style={styles.commentText}>
					<Text style={styles.bold}>{comment.User?.username}</Text>{' '}
					{comment.comment}
				</Text>

				{includeDetails && (
					<View style={styles.footer}>
						{isNew && <Text style={styles.new}>new</Text>}
						<Text style={styles.footerText}>
							{dayjs(comment.createdAt).fromNow()}
						</Text>
						<Text style={styles.footerText}>5 likes</Text>
						<Text style={styles.footerText}>Reply</Text>
					</View>
				)}
			</View>

			<Pressable onPress={toggleLike} hitSlop={5}>
				<AntDesign
					name={isLiked ? 'heart' : 'hearto'}
					size={14}
					style={styles.icon}
					color={isLiked ? colors.accent : colors.black}
				/>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	comment: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		marginHorizontal: 10,
	},
	text: {
		color: colors.black,
		lineHeight: 18,
	},
	bold: {
		fontWeight: fonts.weight.bold,
	},
	commentText: {
		color: colors.black,
		lineHeight: 18,
	},
	avatar: {
		width: 40,
		aspectRatio: 1,
		borderRadius: 25,
		marginRight: 10,
	},
	middleColumn: {
		flex: 1,
	},
	footer: {
		flexDirection: 'row',
		marginBottom: 10,
	},
	footerText: {
		marginRight: 10,
	},
	new: {
		backgroundColor: colors.primary,
		color: colors.white,
		paddingHorizontal: 5,
		marginRight: 5,
		borderRadius: 5,
		overflow: 'hidden',
	},
});

export default Comment;
