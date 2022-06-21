import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { configAxios } from '../axiosConfig';
import { IReply } from '../routes/Posts/Posts';
import { Button, TitleInput } from '../Styles/style';
import { BASE_URL } from '../axiosConfig';
import { getCookie, MY_BLOG_COOKIE_NAME } from '../util/cookie';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import toastConfig from '../util/toast';
import ModalComponent from './ModalComponent';

const ReplyStyle = styled.div`
	border-bottom: 1px solid ${props => props.theme.accentColor};
	min-height: 100px;
	position: relative;
	padding-top: 9px;
	box-sizing: border-box;
`;

const ReplyInfo = styled.div`
	text-align: right;
`;

const SmallText = styled.p`
	font-size: 11px;
	margin: 4px;
`;

const ReplyInput = styled(TitleInput)``;

type TSetReply = (updatedReplies: IReply[]) => void;

type IReplyComponent = {
	reply: IReply;
	setReply: TSetReply;
	isModified: number;
	setIsModified: (value: number) => void;
	index: number;
};

function Reply({
	reply,
	setReply,
	isModified,
	setIsModified,
	index,
}: IReplyComponent) {
	const [isModalShown, setIsModalShown] = useState(false);

	const replyRef = useRef<HTMLInputElement>(null);

	const deleteReply = async () => {
		if (!checkIsLoggedIn()) return;
		const deletePromise = await configAxios.delete(
			`${BASE_URL}/posts/delete_reply/${reply.boardNo}/${reply.replyNo}`,
		);
		const isAccessValid = deletePromise.headers['isaccessvalid'];
		if (isAccessValid) {
			if (!JSON.parse(isAccessValid)) {
				toast.warn(
					'You cannot delete this reply, since you did not reply this comment!',
					{
						...toastConfig,
						toastId: 'deleteReplyWarnToast',
					},
				);
			}
		} else {
			setReply(deletePromise.data);
		}
	};

	const checkIsLoggedIn = () => {
		const cookie = getCookie(MY_BLOG_COOKIE_NAME);
		if (!cookie || cookie[0] !== reply?.replier) {
			toast.warn('Access denied.', toastConfig);
			return false;
		} else return true;
	};

	const modifyReply = () => {
		if (!checkIsLoggedIn()) return;
		if (index !== isModified) {
			setIsModified(index);
		} else {
			sendModifiedReply();
		}
	};

	const handleOnReplyModifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		sendModifiedReply();
	};

	const sendModifiedReply = async () => {
		const modifyPromise = await configAxios.put(
			`${BASE_URL}/posts/modify_reply`,
			{
				...reply,
				reply: replyRef.current?.value,
			},
		);
		const isAccessValid = modifyPromise.headers['isaccessvalid'];
		if (isAccessValid) {
			if (!JSON.parse(isAccessValid)) {
				toast.warn(
					'You cannot modify this reply, since you did not reply this comment!',
					{
						...toastConfig,
						toastId: 'modifyReplyWarnToast',
					},
				);
			}
		} else {
			setReply(modifyPromise.data);
			setIsModified(-1);
		}
	};

	useEffect(() => {
		if (replyRef.current) replyRef.current.value = reply.reply;
	}, [isModified]);

	return (
		<ReplyStyle>
			{isModified === index ? (
				<form onSubmit={handleOnReplyModifySubmit}>
					<ReplyInput required ref={replyRef} />
				</form>
			) : (
				<div style={{ width: '100%' }}>{reply.reply}</div>
			)}
			<ReplyInfo>
				{isModified === index ? (
					<Button clicked onClick={() => setIsModified(-1)}>
						c
					</Button>
				) : (
					<>
						<SmallText>{reply.replier}</SmallText>
						<SmallText>{reply.regDate}</SmallText>
						<Button clicked onClick={() => setIsModalShown(true)}>
							x
						</Button>
					</>
				)}
				<Button clicked onClick={modifyReply}>
					m
				</Button>
			</ReplyInfo>
			<ModalComponent
				isModalShown={isModalShown}
				setIsModalShown={setIsModalShown}
				action={deleteReply}
				sentence={
					'Are you going to delete this reply. This cannot be undone.'
				}
			/>
		</ReplyStyle>
	);
}

export default React.memo(Reply);
