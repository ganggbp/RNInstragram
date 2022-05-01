import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import AuthContextProvider from './src/context/AuthContext';

Amplify.configure(awsconfig);

const App = () => {
	return (
		<SafeAreaProvider>
			<AuthContextProvider>
				<Navigation />
			</AuthContextProvider>
		</SafeAreaProvider>
	);
};

export default App;
