import React from 'react'
import { Image, FlatList } from 'react-native'
import user from '../../assets/data/user.json';
import FeedGridView from '../../components/FeedGridView';
import ProfileHeader from './ProfileHeader';

const ProfileScreen = () => {
  return (
    <FeedGridView
      data={user.posts}
      ListHeaderComponent={ProfileHeader}
    />
  )
}

export default ProfileScreen