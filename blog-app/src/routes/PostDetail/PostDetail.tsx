import React, { useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { configAxios } from '../../axiosConfig';
import Reply from '../../components/Reply';
import { Button, Container, Tag, TitleInput } from '../../Styles/style';
import { BASE_URL } from '../../axiosConfig';
import { getCookie, MY_BLOG_COOKIE_NAME } from '../../util/cookie';
import { IPostElement, IReply } from '../Posts/Posts';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import toastConfig from '../../util/toast';
import ModalComponent from '../../components/ModalComponent';

const Title = styled.h1`
	font-size: 31px;
	border-bottom: 1px solid ${props => props.theme.accentColor};
	word-wrap: break-word;
`;

const Info = styled.h5`
	font-size: 12px;
	text-align: right;
	margin: 12px 0;
`;

const Content = styled.div`
	margin-top: 25px;
`;

const ReplyInput = styled(TitleInput)``;

const NumberOfLikes = styled.div`
	background-color: ${props => props.theme.accentColor};
	width: 30px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	margin: auto;
`;

const Div = styled.div`
	text-align: center;
	margin-top: 28px;
`;

type DateFormatType = Date | string | number;

const formatDate = (date: Date) => {
	let month: DateFormatType = date.getMonth() + 1;
	let day: DateFormatType = date.getDate();
	let hour: DateFormatType = date.getHours();
	let minute: DateFormatType = date.getMinutes();

	month = month >= 10 ? month : '0' + month;
	day = day >= 10 ? day : '0' + day;
	hour = hour >= 10 ? hour : '0' + hour;
	minute = minute >= 10 ? minute : '0' + minute;

	return (
		date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute
	);
};

function PostDetail() {
	const [isModified, setIsModified] = useState(-1);

	const [isUpdated, setIsUpdated] = useState(false);

	const [isModalShown, setIsModalShown] = useState(false);

	const nav = useNavigate();

	const postMatch = useMatch('/posts/detail/:id');

	const userId = useSelector((state: { userIdChanger: { id: string } }) => {
		return state.userIdChanger.id;
	});

	const fetchPost = async () => {
		if (postMatch) {
			const url = `${BASE_URL}/posts/get_detail/${postMatch.params.id}`;
			const cookie = getCookie(MY_BLOG_COOKIE_NAME) || ['', ''];
			const post = await fetch(url, {
				headers: {
					Authorization: `Bearer ${cookie[1]}`,
					'Content-Type': 'application/json',
				},
			});
			if (post.status === 401) {
				nav('/exception');
			} else return post.json();
		}
	};

	const { isLoading, data: post } = useQuery<IPostElement>(
		['post', postMatch?.params.id],
		fetchPost,
		{
			refetchOnWindowFocus: false,
			refetchInterval: false,
		},
	);

	const searchPostsByTag = (e: React.MouseEvent<HTMLParagraphElement>) => {
		e.stopPropagation();
		const tagText = e.currentTarget.textContent?.split('# ')[1];
		nav(`/posts/hashtag/${tagText}/get?offset=0&limit=5`);
	};

	const deletePost = async () => {
		if (post?.boardNo) {
			await configAxios.delete(
				`${BASE_URL}/posts/delete_post/${post?.boardNo}`,
			);
			nav('/posts');
		}
	};

	const replyInputRef = useRef<HTMLInputElement>(null);

	const handleOnReplySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (getCookie(MY_BLOG_COOKIE_NAME)) {
			const newReply: IReply = {
				boardNo: post?.boardNo,
				replier: getCookie(MY_BLOG_COOKIE_NAME)[0],
				reply: replyInputRef?.current?.value || '',
				regDate: formatDate(new Date()),
			};
			const replyPromise = await configAxios.post<IReply[]>(
				`${BASE_URL}/posts/add_reply`,
				newReply,
			);
			if (post) post.replyList = replyPromise.data;
			if (replyInputRef?.current) replyInputRef.current.value = '';
			setIsUpdated(!isUpdated);
		} else {
			toast.warn('To add a reply, you must login.', {
				...toastConfig,
				toastId: 'submitWarnToast',
			});
		}
	};

	const setReply = (updatedReplies: IReply[]) => {
		if (post) {
			post.replyList = updatedReplies;
			setIsUpdated(!isUpdated);
		}
	};

	const handleLikesClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (cookie) {
			await configAxios.post(
				`${BASE_URL}/member/${!post?.liked ? 'like' : 'cancel_like'}/${
					cookie[0]
				}/${post?.boardNo}`,
			);
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

	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>{'MY BLOG' + post?.title}</title>
				</Helmet>
			</HelmetProvider>
			<Container>
				{!isLoading && (
					<>
						<Title>{post?.title}</Title>
						<Info>{'saved at - ' + post?.regDate}</Info>
						<Info>{'writer - ' + post?.writer}</Info>
						&emsp;
						<Content>{post?.content}</Content>
						<div style={{ height: '300px' }}></div>
						<div style={{ textAlign: 'right' }}>
							{post?.hashtags.map(tag => (
								<Tag key={tag} onClick={searchPostsByTag}>
									{'# ' + tag}
								</Tag>
							))}
						</div>
						<div style={{ marginTop: '28px' }}>
							<NumberOfLikes>{post?.numberOfLikes}</NumberOfLikes>
						</div>
						<Div>
							<Button
								clicked={post?.liked}
								onClick={handleLikesClick}
							>
								like 👍
							</Button>
							<Button clicked onClick={() => nav(-1)}>
								back
							</Button>
							{userId === post?.writer && (
								<>
									<Button
										clicked
										onClick={() =>
											nav('/modify/' + post?.boardNo)
										}
									>
										modify
									</Button>
									<Button
										clicked
										onClick={() => setIsModalShown(true)}
									>
										delete
									</Button>
								</>
							)}
						</Div>
						<br></br>
						<div>
							<form onSubmit={handleOnReplySubmit}>
								<span>REPLY:</span>
								<Button clicked>add</Button>
								&ensp;
								<ReplyInput required ref={replyInputRef} />
							</form>
						</div>
						<br></br>
						{post?.replyList?.map((reply, i) => (
							<Reply
								key={i}
								reply={reply}
								setReply={setReply}
								isModified={isModified}
								setIsModified={setIsModified}
								index={i}
							/>
						))}
					</>
				)}
			</Container>
			<ModalComponent
				isModalShown={isModalShown}
				setIsModalShown={setIsModalShown}
				action={deletePost}
				sentence={'Are you sure to delete this post?'}
			/>
		</>
	);
}

export default PostDetail;
