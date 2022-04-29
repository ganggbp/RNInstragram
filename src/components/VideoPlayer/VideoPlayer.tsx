import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Video from 'react-native-video';

interface IVideoPlayer {
	uri: string;
}

const VideoPlayer = ({ uri }: IVideoPlayer) => {
	return (
		<Video
			source={{ uri }}
			style={styles.video}
			resizeMode="cover"
			repeat
			muted={false}
		/>
	);
};

const styles = StyleSheet.create({
	video: {
		width: '100%',
		aspectRatio: 1
	}
});

export default VideoPlayer;
