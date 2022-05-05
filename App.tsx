import React from 'react';
import { Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import AuthContextProvider from './src/context/AuthContext';
import Client from './src/apollo/Client';
import { MenuProvider } from 'react-native-popup-menu';
import relativeTime from 'dayjs/plugin/relativeTime';

// in case that have to config Amplify

const urlOpener = async (url: string, redirectUrl: string) => {
	await InAppBrowser.isAvailable();
	const response = await InAppBrowser.openAuth(url, redirectUrl, {
		showTitle: false,
		enableUrlBarHiding: true,
		enableDefaultShare: false,
		ephemeralWebSession: false,
	});

	if (response.type === 'success') {
		Linking.openURL(response.url);
	}
};

const updatedConfig = {
	...awsconfig,
	oauth: {
		...awsconfig.oauth,
		redirectSignIn: 'gangphotos://',
		redirectSignOut: 'gangphotos://',
		urlOpener,
	},
};

Amplify.configure(updatedConfig);

const App = () => {
	return (
		<SafeAreaProvider>
			<MenuProvider>
				<AuthContextProvider>
					<Client>
						<Navigation />
					</Client>
				</AuthContextProvider>
			</MenuProvider>
		</SafeAreaProvider>
	);
};

export default App;
