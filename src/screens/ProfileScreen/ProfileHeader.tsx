import React from 'react'
import { View, Text, Image } from 'react-native'
import user from '../../assets/data/user.json';
import Button from '../../components/Button';
import styles from './styles';

const ProfileHeader = () => {
  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        {/* Profile image */}
        <Image source={{ uri: user.image }} style={styles.avatar} />

        {/* Posts, follower, following number */}
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>98</Text>
          <Text >Posts</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>198</Text>
          <Text >Followers</Text>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.numberText}>298</Text>
          <Text >Following</Text>
        </View>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text>{user.bio}</Text>

      {/* Button */}
      <View style={{ flexDirection: 'row' }}>
        <Button text="Edit Profile" onPress={() => { console.warn('on edit profle') }} />
        <Button text="Another Button" onPress={() => { console.warn('on edit profle') }} />
      </View>

      {/* GridView Posts */}

    </View>
  )
}

export default ProfileHeader;