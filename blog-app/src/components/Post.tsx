import React, { useState } from 'react';
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

function Post({ post }: { post: IPostElement }) {
	const nav = useNavigate();

	const [isUpdated, setIsUpdated] = useState(false);

	const searchPostsByTag = (e: React.MouseEvent<HTMLParagraphElement>) => {
		e.stopPropagation();
		const tagText = e.currentTarget.textContent?.split('# ')[1];
		nav(`/posts/hashtag/${tagText}/get?offset=0&limit=5`);
	};

	const handleLikesClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie) {
			const likePromise = await configAxios.post(
				`${BASE_URL}/member/${!post?.liked ? 'like' : 'cancel_like'}/${
					cookie[0]
				}/${post.boardNo}`,
			);
			if (likePromise.status == 200) {
				!post?.liked ? post.numberOfLikes++ : post.numberOfLikes--;
				post.liked = !post.liked;
				setIsUpdated(!isUpdated);
			}
		} else {
			alert('This requires login!');
		}
	};

	const checkIfPostNew = (): boolean => {
		if (Date.now() - Number(new Date(post.regDate)) < 600000) return true;
		// 600000 -> 10 분
		else return false;
	};

	return (
		<>
			<PostCard>
				<NewBadge>{checkIfPostNew() ? <p>new</p> : null}</NewBadge>
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
				<div style={{ textAlign: 'left' }}>
					<Button clicked={post?.liked} onClick={handleLikesClick}>
						👍 {post.numberOfLikes}
					</Button>
				</div>
				<PostWriter>
					{post.regDate + ' - writer: ' + post.writer}
				</PostWriter>
				<TagSection>
					{post?.hashtags.map(tag => (
						<Tag key={tag} onClick={searchPostsByTag}>
							{'# ' + tag}
						</Tag>
					))}
				</TagSection>
			</PostCard>
		</>
	);
}

export default React.memo(Post);
