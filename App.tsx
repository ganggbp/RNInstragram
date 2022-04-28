import React from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';


const App = () => {
	return (
		<View style={styles.app}>
			<HomeScreen />
		</View>
	);
};

const styles = StyleSheet.create({
	app: {
		flex: 1,
	},
});

export default App;
