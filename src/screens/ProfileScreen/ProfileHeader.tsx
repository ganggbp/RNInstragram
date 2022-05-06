import React, { useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { ProfileNavigatorParamList } from '../../types/navigation';
import { Auth, Storage } from 'aws-amplify';

import Button from '../../components/Button';
import styles from './styles';
import { User } from '../../API';
import { DEFAULT_USER_IMAGE } from '../../config';
import { useAuthContext } from '../../context/AuthContext';
import UserImage from '../../components/UserImage';

interface IProfileHeader {
	user: User;
}

const ProfileHeader = ({ user }: IProfileHeader) => {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const navigation = useNavigation<ProfileNavigatorParamList>();
	const { userId } = useAuthContext();

	navigation.setOptions({ title: user?.username || 'Profile' });

	useEffect(() => {
		if (user.image) {
			Storage.get(user.image).then(setImageUri);
		}
	}, [user]);

	return (
		<View style={styles.root}>
			<View style={styles.headerRow}>
				{/* Profile image */}
				<UserImage imageKey={user.image || undefined} width={100} />

				{/* Posts, follower, following number */}
				<View style={styles.numberContainer}>
					<Text style={styles.numberText}>{user.nofPosts}</Text>
					<Text>Posts</Text>
				</View>
				<View style={styles.numberContainer}>
					<Text style={styles.numberText}>{user.nofFollowers}</Text>
					<Text>Followers</Text>
				</View>
				<View style={styles.numberContainer}>
					<Text style={styles.numberText}>{user.nofFollowings}</Text>
					<Text>Following</Text>
				</View>
			</View>

			<Text style={styles.name}>{user.name}</Text>
			<Text>{user.bio}</Text>

			{/* Button */}
			{userId === user.id && (
				<View style={{ flexDirection: 'row' }}>
					<Button
						text="Edit Profile"
						onPress={() => {
							navigation.navigate('Edit Profile');
						}}
						inline
					/>
					<Button text="SignOut" onPress={() => Auth.signOut()} inline />
				</View>
			)}
		</View>
	);
};

export default ProfileHeader;
