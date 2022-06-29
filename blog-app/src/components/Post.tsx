import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { configAxios } from '../axiosConfig';
import { IPostElement } from '../routes/Posts/Posts';
import {
	Button,
	PostCard,
	PostContentPreview,
	PostTitle,
	PostWriter,
	Tag,
} from '../Styles/style';
import { BASE_URL } from '../axiosConfig';
import { getCookie, MY_BLOG_COOKIE_NAME } from '../util/cookie';
import toastConfig from '../util/toast';
import { toast } from 'react-toastify';

const TagSection = styled.div`
	position: absolute;
	bottom: 10px;
	right: 0;
`;

const NewBadge = styled.p`
	color: red;
	position: absolute;
	top: -12px;
`;

const ButtonBox = styled.div`
	position: absolute;
	right: 5px;
	top: 0;
	@media screen and (max-width: 768px) {
		top: 95px;
	}
`;

function Post({ post, index }: { post: IPostElement; index: number }) {
	const nav = useNavigate();

	const [isUpdated, setIsUpdated] = useState(false);

	const [isWindowSmall, setIsWindowSmall] = useState(() => {
		return window.innerWidth > 768;
	});

	const searchPostsByTag = (e: React.MouseEvent<HTMLParagraphElement>) => {
		e.stopPropagation();
		const tagText = e.currentTarget.textContent?.split('# ')[1];
		nav(`/posts/hashtag/${tagText}/get?offset=0&limit=5`);
	};

	const handleLikesClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie) {
			await configAxios.put(`${BASE_URL}/member/handleLikesCount`, {
				id: cookie[0],
				postNo: String(post?.boardNo),
				isLiked: String(post?.liked ? true : false),
			});
			if (post) {
				!post?.liked ? post.numberOfLikes++ : post.numberOfLikes--;
				post.liked = !post.liked;
			}
			setIsUpdated(!isUpdated);
		} else {
			toast.warn('This requires login!', {
				...toastConfig,
				toastId: 'likeWarnToast',
			});
		}
	};

	const checkIfPostNew = (): boolean =>
		Date.now() - Number(new Date(post.regDate)) < 34000000;

	const checkToShowTags = () => {
		if (window.innerWidth > 768) {
			setIsWindowSmall(true);
		} else {
			setIsWindowSmall(false);
		}
	};

	useEffect(() => {
		window.addEventListener('resize', checkToShowTags);
		return () => {
			window.removeEventListener('resize', checkToShowTags);
		};
	}, []);

	const postVariant = {
		initial: {
			x: -20,
			opacity: 0,
		},
		animate: {
			x: 0,
			opacity: 1,
			transition: {
				duration: 1 + 0.1 * index,
			},
		},
		exit: {
			x: 20,
			opacity: 0,
		},
	};

	return (
		<>
			<PostCard
				variants={postVariant}
				initial="initial"
				animate="animate"
				exit="exit"
				key={post.boardNo}
			>
				<NewBadge>{checkIfPostNew() && <p>new</p>}</NewBadge>
				<PostTitle>
					{post.title.length > 17
						? post.title.slice(0, 17) + '...'
						: post.title}
				</PostTitle>
				<PostContentPreview>
					{post.content.length > 60
						? post.content.slice(0, 60) + '...'
						: post.content}
				</PostContentPreview>
				<ButtonBox>
					<Button clicked={post?.liked} onClick={handleLikesClick}>
						👍 {post.numberOfLikes}
					</Button>
				</ButtonBox>
				<PostWriter>
					{post.regDate + ' - writer: ' + post.writer}
				</PostWriter>
				{isWindowSmall && (
					<TagSection>
						{post?.hashtags.map(tag => (
							<Tag key={tag} onClick={searchPostsByTag}>
								{'# ' + tag}
							</Tag>
						))}
					</TagSection>
				)}
			</PostCard>
		</>
	);
}

export default React.memo(Post);
