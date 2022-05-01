import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { Hub } from 'aws-amplify';
import { HubCallback } from '@aws-amplify/core';

type UserType = CognitoUser | null | undefined;

type AuthContextType = {
	user: UserType;
};

const AuthContext = createContext<AuthContextType>({
	user: undefined,
}); // {Provider, Consumer} ,,, default value

//actual value provide to provider
const AuthContextProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<UserType>(undefined);

	const checkUser = async () => {
		try {
			const authUser = await Auth.currentAuthenticatedUser({
				bypassCache: true,
			}); //get data by request to cognito server

			setUser(authUser);
		} catch (e) {
			setUser(null);
		}
	};

	useEffect(() => {
		checkUser();
	}, []);

	useEffect(() => {
		const listener: HubCallback = (data) => {
			const { event } = data.payload;
			if (event === 'signOut') {
				setUser(null);
			}
			if (event === 'signIn') {
				checkUser();
			}
		};
		Hub.listen('auth', listener); //เพิ่ม listener ให้ track ดู auth events ใน HUB

		return () => Hub.remove('auth', listener);
	}, []);

	return (
		<AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
	);
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
