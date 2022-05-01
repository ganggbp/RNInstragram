import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import AuthContextProvider from './src/context/AuthContext';

// in case that have to config Amplify
const updatedConfig = {
	...awsconfig,
	oauth: {
		...awsconfig.oauth,
		redirectSignIn: 'gangphotos://',
		redirectSignOut: 'gangphotos://',
	},
};

Amplify.configure(updatedConfig);

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
