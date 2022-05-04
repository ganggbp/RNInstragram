import { useMutation, useQuery } from '@apollo/client';
import {
	CreateLikeMutation,
	CreateLikeMutationVariables,
	DeleteLikeMutation,
	DeleteLikeMutationVariables,
	LikesForPostByUserQuery,
	LikesForPostByUserQueryVariables,
	Post,
	UpdatePostMutation,
	UpdatePostMutationVariables,
} from '../../API';
import { useAuthContext } from '../../context/AuthContext';
import {
	createLike,
	updatePost,
	deleteLike,
	likesForPostByUser,
} from './queries';

const useLikeService = (post: Post) => {
	const { userId } = useAuthContext();

	const { data: usersLikeData } = useQuery<
		LikesForPostByUserQuery,
		LikesForPostByUserQueryVariables
	>(likesForPostByUser, {
		variables: { postID: post.id, userID: { eq: userId } },
	});

	const [doUpdatePost] = useMutation<
		UpdatePostMutation,
		UpdatePostMutationVariables
	>(updatePost);

	const [doCreateLike] = useMutation<
		CreateLikeMutation,
		CreateLikeMutationVariables
	>(createLike, {
		variables: { input: { userID: userId, postID: post.id } },
		refetchQueries: ['LikesForPostByUser'], // re-run this query to refetch after mutation is finished.
	});

	const [doDeleteLike] = useMutation<
		DeleteLikeMutation,
		DeleteLikeMutationVariables
	>(deleteLike);

	const userLike = (usersLikeData?.likesForPostByUser?.items || []).filter(
		(like) => !like?._deleted,
	)?.[0];

	const incrementNofLikes = (amount: 1 | -1) => {
		doUpdatePost({
			variables: {
				input: {
					id: post.id,
					_version: post._version,
					nofLikes: post.nofLikes + amount,
				},
			},
		});
	};

	const onAddLike = () => {
		doCreateLike();
		incrementNofLikes(1);
	};

	const onDeleteLike = () => {
		if (!userLike) {
			return;
		}

		doDeleteLike({
			variables: { input: { id: userLike.id, _version: userLike._version } },
		});
		incrementNofLikes(-1);
	};

	const toggleLike = () => {
		if (userLike) {
			onDeleteLike();
		} else {
			onAddLike();
		}
	};

	return {
		toggleLike,
		isLiked: !!userLike, //if useLike = object it's gonna be true but if it's undefined,null will return false
	};
};

export default useLikeService;
