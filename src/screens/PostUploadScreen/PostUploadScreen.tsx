import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { Camera } from 'expo-camera';
import {
	CameraPictureOptions,
	CameraRecordingOptions,
	FlashMode,
} from 'expo-camera/build/Camera.types';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '../../theme/colors';
import { launchImageLibrary } from 'react-native-image-picker';

const flashModes = [
	FlashMode.off,
	FlashMode.on,
	FlashMode.auto,
	FlashMode.torch,
];

const flashModeToIcon = {
	[FlashMode.off]: 'flash-off', //defined like this let you use value of FlashMode.off as a key
	[FlashMode.on]: 'flash-on',
	[FlashMode.auto]: 'flash-auto',
	[FlashMode.torch]: 'highlight',
};

const PostUploadScreen = () => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
	const [flash, setFlash] = useState(FlashMode.off);
	const [isCameraReady, setIsCameraReady] = useState(false);
	const [isRecording, setIsRecording] = useState(false);

	const cameraRef = useRef<Camera>(null);

	useEffect(() => {
		const getPermission = async () => {
			const cameraPermissions = await Camera.requestCameraPermissionsAsync();
			const microphonePermissions =
				await Camera.requestMicrophonePermissionsAsync();
			setHasPermission(
				cameraPermissions.status === 'granted' &&
					microphonePermissions.status === 'granted',
			);
		};

		getPermission();
	}, []);

	const flipCamera = () => {
		setCameraType((currentCameraType) =>
			currentCameraType === Camera.Constants.Type.back
				? Camera.Constants.Type.front
				: Camera.Constants.Type.back,
		);
	};

	const flipFlash = () => {
		const currentIndex = flashModes.indexOf(flash);
		const nextIndex =
			currentIndex === flashModes.length - 1 ? 0 : currentIndex + 1;
		setFlash(flashModes[nextIndex]);
	};

	const takePicture = async () => {
		if (!isCameraReady || !cameraRef.current || isRecording) {
			return;
		}
		const options: CameraPictureOptions = {
			quality: 0.5, //0 - very compresses & low size | 1 - compression for max quality
			base64: false, // include base64 version of image
			skipProcessing: true, // on android, the 'processing' step messes the orientation on some device
		};

		try {
			const result = await cameraRef.current.takePictureAsync(options);
		} catch (err) {
			console.log(err);
		}
	};

	const startRecording = async () => {
		if (!isCameraReady || !cameraRef.current || isRecording) {
			return;
		}

		const options: CameraRecordingOptions = {
			quality: Camera.Constants.VideoQuality['640:480'], // 2160p, 1080p, 720p, 480p, 640x480
			maxDuration: 60, //Maximum video duration in seconds
			maxFileSize: 10 * 1024 * 1024, // Maximum video file size in bytes
			mute: false,
		};

		setIsRecording(true);
		try {
			const result = await cameraRef.current.recordAsync(options);
		} catch (err) {
			console.log(err);
		}

		setIsRecording(false);
	};

	const stopRecording = () => {
		if (isRecording) {
			cameraRef.current?.stopRecording();
			setIsRecording(false);
		}
	};

	const openImageGallery = () => {
		launchImageLibrary(
			{ mediaType: 'photo' },
			({ didCancel, errorCode, errorMessage, assets }) => {
				if (!didCancel && !errorCode && assets && assets.length > 0) {
					console.log(assets);
				}
			},
		);
	};

	if (hasPermission === null) {
		return <Text>Loading...</Text>;
	}

	if (hasPermission === false) {
		return <Text>No access to the camera</Text>;
	}

	return (
		<View style={styles.page}>
			<Camera
				ref={cameraRef}
				style={styles.camera}
				type={cameraType}
				ratio="4:3"
				flashMode={flash}
				onCameraReady={() => setIsCameraReady(true)}
			/>

			<View style={[styles.buttonContainer, { top: 25 }]}>
				<MaterialIcons name="close" size={30} color={colors.white} />
				<Pressable onPress={flipFlash}>
					<MaterialIcons
						name={flashModeToIcon[flash]}
						size={30}
						color={colors.white}
					/>
				</Pressable>
				<MaterialIcons name="settings" size={30} color={colors.white} />
			</View>

			<View style={[styles.buttonContainer, { bottom: 25 }]}>
				<Pressable onPress={openImageGallery}>
					<MaterialIcons name="photo-library" size={30} color={colors.white} />
				</Pressable>

				{isCameraReady && (
					<Pressable
						onPress={takePicture}
						onLongPress={startRecording}
						onPressOut={stopRecording}
						delayLongPress={2000}
					>
						<View
							style={[
								styles.circle,
								{ backgroundColor: isRecording ? colors.accent : colors.white },
							]}
						/>
					</Pressable>
				)}

				<Pressable onPress={flipCamera}>
					<MaterialIcons
						name="flip-camera-ios"
						size={30}
						color={colors.white}
					/>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	page: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: colors.black,
	},
	camera: {
		width: '100%',
		aspectRatio: 3 / 4,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%',

		position: 'absolute',
	},
	circle: {
		width: 75,
		aspectRatio: 1,
		borderRadius: 75,
		backgroundColor: colors.white,
	},
});

export default PostUploadScreen;
