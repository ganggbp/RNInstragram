import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert } from 'react-native';

import { useForm } from 'react-hook-form';
import {
	Asset,
	launchCamera,
	launchImageLibrary,
} from 'react-native-image-picker';

import {
	DeleteUserMutation,
	DeleteUserMutationVariables,
	GetUserQuery,
	GetUserQueryVariables,
	UpdateUserMutation,
	UpdateUserMutationVariables,
	UsersByUsernameQuery,
	UsersByUsernameQueryVariables,
} from '../../API';
import { deleteUser, getUser, updateUser, usersByUsername } from './queries';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { useAuthContext } from '../../context/AuthContext';
import ApiErrorMessage from '../../components/ApiErrorMessage';
import { DEFAULT_USER_IMAGE } from '../../config';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';

import styles from './styles';
import CustomInput, { IEditableUser } from './CustomInput';

const URL_REGEX =
	/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;

const EditProfileScreen = () => {
	const [selectedPhoto, setSelectedPhoto] = useState<null | Asset>(null);
	const { control, handleSubmit, setValue } = useForm<IEditableUser>();
	const navigation = useNavigation();
	const { userId, user: authUser } = useAuthContext();

	const { data, loading, error } = useQuery<
		GetUserQuery,
		GetUserQueryVariables
	>(getUser, {
		variables: {
			id: userId,
		},
	});

	const user = data?.getUser;

	const [getUserByUsername] = useLazyQuery<
		UsersByUsernameQuery,
		UsersByUsernameQueryVariables
	>(usersByUsername);

	const [doUpdateUser, { loading: updateLoading, error: updateError }] =
		useMutation<UpdateUserMutation, UpdateUserMutationVariables>(updateUser);

	const [doDeleteUser, { loading: deleteLoading, error: deleteError }] =
		useMutation<DeleteUserMutation, DeleteUserMutationVariables>(deleteUser);

	useEffect(() => {
		if (user) {
			setValue('name', user.name);
			setValue('username', user.username);
			setValue('bio', user.bio);
			setValue('website', user.website);
		}
	}, [user, setValue]);

	const onSubmit = async (formData: IEditableUser) => {
		await doUpdateUser({
			variables: {
				input: { id: userId, ...formData, _version: user?._version }, // when update dont forget to update version
			},
		});
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	};

	const confirmDelete = () => {
		Alert.alert('Are you sure?', 'Deleting your profile is permanent', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Yes, delete',
				style: 'destructive',
				onPress: startDeleting,
			},
		]);
	};

	const startDeleting = async () => {
		if (!user) {
			return;
		}
		// delete form DB
		await doDeleteUser({
			variables: { input: { id: userId, _version: user._version } },
		});

		// delete from Cognito
		authUser?.deleteUser((err) => {
			if (err) {
				console.log(err);
			}
			Auth.signOut();
		});
	};

	const onChangePhoto = () => {
		launchImageLibrary(
			{ mediaType: 'photo' },
			({ didCancel, errorCode, assets }) => {
				if (!didCancel && !errorCode && assets && assets.length > 0) {
					setSelectedPhoto(assets[0]);
				}
			},
		);
	};

	const validateUsername = async (username: string) => {
		// query the database based on the usersByUsername

		try {
			const response = await getUserByUsername({ variables: { username } });
			if (response.error) {
				Alert.alert(`Failed to fetch username`);
				return 'Failed to fetch username';
			}
			const users = response.data?.usersByUsername?.items;
			if (users && users?.length > 0 && users?.[0]?.id !== userId) {
				return 'Username is to already toknen';
			}
		} catch (e) {
			Alert.alert(`Failed to fetch username`);
		}

		// if there are any users with this username, then return error
		return true;
	};

	if (loading) {
		return <ActivityIndicator />;
	}

	if (error || updateError || deleteError) {
		return (
			<ApiErrorMessage
				title="Error fetching or updating the user"
				message={error?.message || updateError?.message || deleteError?.message}
			/>
		);
	}

	return (
		<View style={styles.page}>
			<Image
				source={{
					uri: selectedPhoto?.uri || user?.image || DEFAULT_USER_IMAGE,
				}}
				style={styles.avatar}
			/>
			<Text style={styles.textButton} onPress={onChangePhoto}>
				Change Profile photo
			</Text>

			<CustomInput
				name="name"
				control={control}
				rules={{ required: 'Name is required' }}
				label="Name"
			/>
			<CustomInput
				name="username"
				control={control}
				rules={{
					required: 'Username is required',
					minLength: { value: 3, message: 'Username should be more than 3' },
					validate: validateUsername,
				}}
				label="Username"
			/>
			<CustomInput
				name="website"
				control={control}
				rules={{
					pattern: {
						value: URL_REGEX,
						message: 'Invalid url',
					},
				}}
				label="Website"
			/>
			<CustomInput
				name="bio"
				control={control}
				rules={{
					maxLength: {
						value: 200,
						message: 'Username should be less than 200 character',
					},
				}}
				label="Bio"
				multiline
			/>

			<Text onPress={handleSubmit(onSubmit)} style={styles.textButton}>
				{updateLoading ? 'Submitting...' : 'Submit'}
			</Text>

			<Text onPress={confirmDelete} style={styles.textButtonDanger}>
				{deleteLoading ? 'Deleting...' : 'DELETE USER'}
			</Text>
		</View>
	);
};

export default EditProfileScreen;
