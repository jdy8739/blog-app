import React, { useEffect, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { configAxios } from '../../axiosConfig';
import Post from '../../components/Post';
import { Container, Highlight, Button, Blank } from '../../Styles/style';
import { BASE_URL } from '../../axiosConfig';
import { MY_BLOG_COOKIE_NAME, removeCookie } from '../../util/cookie';
import { useDispatch } from 'react-redux';
import { changeUserId } from '../../store/userIdStore';

export interface IReply {
	replyNo?: number;
	boardNo?: number;
	replier: string;
	reply: string;
	regDate: string;
}

export interface IPostElement {
	boardNo: number;
	writer: string;
	title: string;
	content: string;
	numberOfLikes: number;
	hashtags: string[];
	regDate: string;
	replyList: IReply[];
	liked: boolean;
}

interface IBoard {
	[key: string]: IPostElement;
}

interface IPost {
	limit: number;
	offset: number;
	total: number;
	boards: IBoard;
}

const Frame = styled.div`
	border-bottom: 1px solid ${props => props.theme.accentColor};
`;

const PaginationSelect = styled.div`
	text-align: right;
	margin-bottom: 100px;
	@media screen and (max-width: 768px) {
		margin-top: 10px;
		text-align: center;
	}
`;

const DEFAULT_OFFSET = 0;

const DEFAULT_LIMIT = 5;

type TKeyword = 'title' | 'writer' | 'hashtag' | 'favlist' | '';

function Posts() {
	const [posts, setPosts] = useState<IPost>();

	const [isLoading, setIsLoading] = useState(true);

	const [indexArr, setIndexArr] = useState<number[]>();

	const nav = useNavigate();

	const location = useLocation();

	const catchSubjectAndKeywordName = (): [TKeyword, string] => {
		const target = location.pathname.split('/')[2];
		if (
			target === 'title' ||
			target === 'writer' ||
			target === 'hashtag' ||
			target === 'favlist'
		) {
			return [target, location.pathname.split('/')[3]];
		} else return ['', ''];
	};

	const [subject, keyword] = catchSubjectAndKeywordName();

	const paramsSearcher = new URLSearchParams(location.search);

	const limit = paramsSearcher.get('limit') || DEFAULT_LIMIT;

	const offset = paramsSearcher.get('offset') || DEFAULT_OFFSET;

	const dispatch = useDispatch();

	const setUserId = (id: string) => {
		dispatch(changeUserId(id));
	};

	const logout = () => {
		removeCookie(MY_BLOG_COOKIE_NAME, {
			path: '/',
		});
		setUserId('');
		nav('/');
	};

	const fetchPosts = async () => {
		try {
			const getPromise = configAxios.get<IPost>(
				`${BASE_URL}/posts${subject ? '/' + subject : ''}${
					keyword ? '/' + keyword : ''
				}/get?offset=${offset}&limit=${limit}`,
			);
			const getResult = (await getPromise).data;
			if (getResult) {
				setPosts(getResult);
				setIsLoading(false);
			}
		} catch (e) {
			logout();
		}
	};

	const makeIndex = () => {
		let lastPageIdx = 0;
		if (posts) {
			lastPageIdx = Math.ceil(posts.total / posts.limit);
		}
		const tmpIndexArr = [];
		for (let i = 0; i < lastPageIdx; i++) {
			tmpIndexArr.push(i);
		}
		setIndexArr([...tmpIndexArr]);
	};

	const handleOnLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const limit = e.currentTarget.value;
		nav(makeApiString(0, +limit));
	};

	const setOffset = (e: React.MouseEvent<HTMLButtonElement>) => {
		nav(makeApiString(+e.currentTarget.innerText - 1, +limit));
	};

	const makeApiString = (offset: number, limit: number): string => {
		return `/posts${subject ? '/' + subject : ''}${
			keyword ? '/' + keyword : ''
		}/get?offset=${offset}&limit=${limit}`;
	};

	useEffect(() => {
		fetchPosts();
	}, [limit, offset, subject, keyword]);

	useEffect(() => {
		makeIndex();
	}, [posts]);

	const isPostsEmpty = (param: IBoard) =>
		Object.keys(param).length === 0 && param.constructor === Object;

	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>{'MY BLOG POSTS'}</title>
				</Helmet>
			</HelmetProvider>
			{isLoading ? (
				<p>Loading... Please wait.</p>
			) : (
				<>
					{posts && (
						<Container>
							<div style={{ textAlign: 'center' }}>
								{subject && (
									<>
										{'search for ' + subject}
										&ensp;
										<Highlight>
											{window.decodeURI(keyword)}
										</Highlight>
									</>
								)}
							</div>
							<PaginationSelect>
								<span>contents in a page</span>
								&ensp;
								<select
									onChange={handleOnLimitChange}
									value={limit || 5}
								>
									<option>5</option>
									<option>15</option>
									<option>30</option>
								</select>
							</PaginationSelect>
							{isPostsEmpty(posts.boards) && (
								<div style={{ textAlign: 'center' }}>
									<p>Sorry. No data. :(</p>
								</div>
							)}
							{Object.keys(posts.boards).map(postNo => {
								return (
									<Frame
										key={postNo}
										onClick={() =>
											// eslint-disable-next-line prettier/prettier
											nav(
												`/posts/detail/${+posts.boards[
													postNo
												].boardNo}`,
											)
										}
									>
										<Post post={posts.boards[postNo]} />
									</Frame>
								);
							})}
							{indexArr && (
								<Blank>
									{indexArr.map(idx => (
										<Button
											key={idx}
											onClick={setOffset}
											clicked={
												offset ? +offset === idx : false
											}
										>
											{idx + 1}
										</Button>
									))}
								</Blank>
							)}
						</Container>
					)}
				</>
			)}
		</>
	);
}

export default Posts;
