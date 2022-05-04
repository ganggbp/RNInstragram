import { gql } from '@apollo/client';

// things to use on Profile screen
export const getUser = gql`
	query GetUser($id: ID!) {
		getUser(id: $id) {
			id
			name
			email
			username
			bio
			website
			image
			nofPosts
			nofFollowers
			nofFollowings
			Posts {
				nextToken
				startedAt
				items {
					id
					image
					images
					video
				}
			}
			createdAt
			updatedAt
			_version
			_deleted
			_lastChangedAt
		}
	}
`;
