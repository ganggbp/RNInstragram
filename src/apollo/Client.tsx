import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	ApolloLink,
	createHttpLink,
} from '@apollo/client';

import { AuthOptions, createAuthLink, AUTH_TYPE } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import { TypePolicies } from '@apollo/client/cache';

import awsconfig from '../aws-exports';

interface IClient {
	children: React.ReactNode;
}

const url = awsconfig.aws_appsync_graphqlEndpoint;
const region = awsconfig.aws_appsync_region;
const auth: AuthOptions = {
	type: awsconfig.aws_appsync_authenticationType as AUTH_TYPE.API_KEY,
	apiKey: awsconfig.aws_appsync_apiKey,
	// jwtToken: async () => token, // Required when you use Cognito UserPools OR OpenID Connect. token object is obtained previously
	// credentials: async () => credentials, // Required when you use IAM-based auth.
};

const httpLink = createHttpLink({ uri: url });

const link = ApolloLink.from([
	createAuthLink({ url, region, auth }),
	createSubscriptionHandshakeLink({ url, region, auth }, httpLink), //link of what protocol to communicate
]);

//typePolicies function that specified how we should merit object in our cache

const mergeList = (existing = { items: [] }, incoming = { items: [] }) => {
	return {
		...existing,
		...incoming,
		items: [...(existing.items || []), ...incoming.items],
	};
};

const typePolicies: TypePolicies = {
	Query: {
		fields: {
			commentsByPost: {
				keyArgs: ['postID', 'createdAt', 'sortDirection', 'filter'],
				merge: mergeList,
			},
			postsByDate: {
				keyArgs: ['type', 'createdAt', 'sortDirection', 'filter'],
				merge: mergeList,
			},
		},
	},
};

export const client = new ApolloClient({
	link,
	cache: new InMemoryCache({ typePolicies }), //responsible to all the data locally on device memory, storage
});

const Client = ({ children }: IClient) => {
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Client;
