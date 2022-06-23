import React, { useEffect, useRef, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { configAxios, configModifyAxios } from '../../axiosConfig';
import {
	Button,
	Container,
	TitleInput,
	ContentInput,
	Tag,
	TagInput,
} from '../../Styles/style';
import { BASE_URL } from '../../axiosConfig';
import { getCookie, MY_BLOG_COOKIE_NAME } from '../../util/cookie';
import { IPostElement } from '../Posts/Posts';
import { toast } from 'react-toastify';
import toastConfig from '../../util/toast';
import ModalComponent from '../../components/ModalComponent';

const Header = styled.header`
	text-align: center;
	color: ${props => props.theme.accentColor};
	margin: 48px;
`;

function WritePost() {
	const writeMatch = useMatch('/write');

	const modifyMatch = useMatch('/modify/:postNo');

	const nav = useNavigate();

	const [post, setPost] = useState<IPostElement>();

	const [tagList, setTagList] = useState<string[]>([]);

	const [isModalShown, setIsModalShown] = useState(false);

	const titleRef = useRef<HTMLInputElement>(null);

	const contentRef = useRef<HTMLTextAreaElement>(null);

	const inputTagRef = useRef<HTMLInputElement>(null);

	const handleOnPostSubmit = async () => {
		const title = titleRef?.current?.value || '';
		const content = contentRef?.current?.value || '';
		const writer = getCookie(MY_BLOG_COOKIE_NAME)[0];

		if (writeMatch && !modifyMatch) {
			await configAxios.post(`${BASE_URL}/posts/add_post`, {
				title,
				content,
				hashtags: tagList,
				writer,
			});
			toast.success('New Post has been registered.', toastConfig);
			nav('/posts');
		} else {
			await configAxios.put(`${BASE_URL}/posts/modify_post`, {
				boardNo: post?.boardNo,
				title,
				content,
				hashtags: tagList,
				writer,
				regDate: post?.regDate,
			});
			toast.success('Post has been modified.', toastConfig);
			nav(`/posts/detail/${modifyMatch?.params.postNo}`);
		}
	};

	const quitWriting = () => nav(-1);

	const addHashTag = () => {
		const newTag = inputTagRef.current?.value;
		if (newTag && !checkTagDuplicate(newTag)) {
			setTagList(tagList => [...tagList, newTag]);
			inputTagRef.current.value = '';
		}
	};

	const callAddHashTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.keyCode === 13) addHashTag();
	};

	const checkTagDuplicate = (newTag: string) => {
		let isTagDuplicate = false;
		tagList.forEach(tag => {
			if (tag === newTag) isTagDuplicate = true;
		});
		return isTagDuplicate;
	};

	const removeTag = (idx: number) => {
		setTagList(tagList => {
			const copied = [...tagList];
			copied.splice(idx, 1);
			return copied;
		});
	};

	const getPostAndCheckValidation = async () => {
		try {
			const modifyPromise = await configModifyAxios.get<IPostElement>(
				`${BASE_URL}/posts/get_detail/${modifyMatch?.params.postNo}`,
			);
			setPost(modifyPromise.data);
		} catch (e) {
			nav('/posts');
		}
	};

	useEffect(() => {
		if (!getCookie(MY_BLOG_COOKIE_NAME)) {
			nav(-1);
			return;
		}
		if (modifyMatch) {
			getPostAndCheckValidation();
		}
	}, []);

	useEffect(() => {
		if (titleRef.current) {
			titleRef.current.value = post?.title || '';
		}
		if (contentRef.current) {
			contentRef.current.value = post?.content || '';
		}
		setTagList(() => [...(post?.hashtags || [])]);
	}, [post]);

	return (
		<>
			<HelmetProvider>
				<Helmet>
					<title>MY BLOG WRITE</title>
				</Helmet>
			</HelmetProvider>
			<Container>
				<Header>
					{writeMatch && !modifyMatch
						? "Let's write a post and share your story!"
						: 'Make a modify your post. You may show it more specific. :)'}
				</Header>
				<div>
					<p>TITLE:</p>
					&ensp;
					<TitleInput required ref={titleRef} />
				</div>
				<div style={{ marginTop: '30px' }}>
					<div>CONTENT:</div>
					&ensp;
					<ContentInput required ref={contentRef} />
				</div>
				<div style={{ marginTop: '30px' }}>
					<div>TAGS:</div>
					<TagInput ref={inputTagRef} onKeyDown={callAddHashTag} />
					&nbsp;
					<Button clicked onClick={addHashTag}>
						add
					</Button>
					{tagList && (
						<div>
							{tagList.map((tag, i) => (
								<Tag key={i} onClick={() => removeTag(i)}>
									{`# ${tag}`}
								</Tag>
							))}
						</div>
					)}
				</div>
				<hr />
				<br />
				<div style={{ textAlign: 'right' }}>
					<Button clicked onClick={handleOnPostSubmit}>
						submit
					</Button>
					<Button clicked onClick={() => setIsModalShown(true)}>
						back
					</Button>
				</div>
			</Container>
			<ModalComponent
				isModalShown={isModalShown}
				setIsModalShown={setIsModalShown}
				action={quitWriting}
				sentence={'Are you sure to quit writing this post?'}
			/>
		</>
	);
}

export default WritePost;
