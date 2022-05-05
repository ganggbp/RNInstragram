import { View, Text, Image, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CreateNavigationProp, CreateRouteProp } from '../../types/navigation';
import colors from '../../theme/colors';
import Button from '../../components/Button';
import { createPost } from './queries';
import { useMutation } from '@apollo/client';
import {
	CreatePostInput,
	CreatePostMutation,
	CreatePostMutationVariables,
} from '../../API';
import { useAuthContext } from '../../context/AuthContext';
import { Storage } from 'aws-amplify';
import Carousel from '../../components/Carousel';
import VideoPlayer from '../../components/VideoPlayer';

const CreatePostScreen = () => {
	const [description, setDescription] = useState('');
	const { userId } = useAuthContext();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [doCreatePost] = useMutation<
		CreatePostMutation,
		CreatePostMutationVariables
	>(createPost);

	const navigation = useNavigation<CreateNavigationProp>();
	const route = useRoute<CreateRouteProp>();
	const { image, images, video } = route.params;

	let content = null;
	if (image) {
		content = (
			<Image
				source={{
					uri: image,
				}}
				style={styles.image}
			/>
		);
	} else if (images) {
		content = <Carousel images={images} />;
	} else if (video) {
		content = <VideoPlayer uri={video} paused={false} />;
	}

	const submit = async () => {
		if (isSubmitting) {
			return;
		}
		setIsSubmitting(true);
		// let input: CreatePostInput = {
		// 	type: 'POST',
		// 	description,
		// 	image: undefined,
		// 	images: undefined,
		// 	video: undefined,
		// 	nofComments: 0,
		// 	nofLikes: 0,
		// 	userID: userId,
		// };

		// upload the media files to S3 and get the key
		//first we have to upload image from local uri
		// if (image) {
		// 	const imageKey = await uploadMedia(image);
		// 	// input.image = imageKey;
		// } else if (images) {
		// 	const imageKeys = await Promise.all(
		// 		images.map((img) => uploadMedia(img)),
		// 	);
		// 	// input.images = imageKeys.filter((key) => key) as string[];
		// }

		try {
			const response = await doCreatePost({
				variables: {
					input: {
						type: 'POST',
						description,
						image,
						images,
						video,
						nofComments: 0,
						nofLikes: 0,
						userID: userId,
					},
				},
			});
			setIsSubmitting(false);
			console.log(response);
			navigation.popToTop();
			navigation.navigate('HomeStack');
		} catch (e) {
			Alert.alert('Error uploading the post', (e as Error).message);
			setIsSubmitting(false);
		}
	};

	const uploadMedia = async (uri: string) => {
		try {
			// get file from local storage
			const response = await fetch(uri);

			// get the blob of the file from uri
			const blob = await response.blob();

			// upload the file (blob) to S3
			const s3Response = await Storage.put('image.png', blob);
			return s3Response.key;
		} catch (e) {
			Alert.alert('Error uploading the file');
		}
	};

	return (
		<View style={styles.root}>
			<View style={styles.content}>{content}</View>
			<TextInput
				value={description}
				onChangeText={setDescription}
				placeholder="Description..."
				style={styles.input}
				multiline
				// numberOfLines={5}
			/>

			<Button text={isSubmitting ? 'Submit...' : 'Submit'} onPress={submit} />
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		padding: 10,
	},
	content: {
		width: '100%',
		aspectRatio: 1,
	},
	image: {
		width: '100%',
		aspectRatio: 1,
	},
	input: {
		marginVertical: 10,
		alignSelf: 'stretch',
		backgroundColor: colors.white,
		padding: 10,
		borderRadius: 5,
	},
});

export default CreatePostScreen;
