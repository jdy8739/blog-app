import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { configAxios } from "../axiosConfig";
import { IReply } from "../routes/Posts/Posts";
import { Button, TitleInput } from "../Styles/style";
import BASE_URL from "../URLS";
import { getCookie, MY_BLOG_COOKIE_NAME } from "../util/cookie";

const ReplyStyle = styled.div`
    border-bottom: 1px solid ${props => props.theme.accentColor};
    height: 100px;
    position: relative;
    padding-top: 9px;
    box-sizing: border-box;
`;

const ReplyInfo = styled.div`
    position: absolute;
    right: 0;
    text-align: right;
`;

const SmallText = styled.p`
    font-size: 11px;
    margin: 4px;
`;

const ReplyInput = styled(TitleInput)`
`;

type TSetReply = 
    (updatedReplies: IReply[]) => void;

type IReplyComponent = { 
    reply: IReply, 
    setReply: TSetReply, 
    isModified: number,
    setIsModified: (value: number) => void
    index: number
};

function Reply({ 
    reply, 
    setReply,
    isModified, 
    setIsModified,
    index }: IReplyComponent) {

    const replyRef = useRef<HTMLInputElement>(null);

    const deleteReply = () => {
        if(!checkIsLoggedIn()) return;
        const deleteConfirm = 
            window.confirm('Are you going to delete this reply. This cannot be undone.');
        if(deleteConfirm) {
            configAxios.delete(
                `${BASE_URL}/posts/delete_reply/${reply.boardNo}/${reply.replyNo}`)
                .then(res => {
                    const isAccessValid = res.headers['isaccessvalid'];
                    if(isAccessValid) {
                        if(!JSON.parse(isAccessValid)) {
                            alert('You cannot delete this reply, since you did not reply this comment!');
                        };
                    } else {
                        setReply(res.data);
                    };
                })
                .catch(err => console.log(err));
        };
    };

    const checkIsLoggedIn = () => {
        const cookie = getCookie(MY_BLOG_COOKIE_NAME);
        if(!cookie || cookie[0] !== reply?.replier) {
            alert('Access denied.');
            return false;
        } else return true;
    };

    const modifyReply = () => {
        if(!checkIsLoggedIn()) return;
        if(index !== isModified) {
            setIsModified(index);
        } else {
            sendModifiedReply();
        };
    };

    const handleOnReplyModifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendModifiedReply();
    };

    const sendModifiedReply = () => {
        configAxios.put(`${BASE_URL}/posts/modify_reply`, 
        { ...reply, reply: replyRef.current?.value })
            .then(res => {
                const isAccessValid = res.headers['isaccessvalid'];
                if(isAccessValid) {
                    if(!JSON.parse(isAccessValid)) {
                        alert('You cannot modify this reply, since you did not reply this comment!');
                    };
                } else {
                    setReply(res.data);
                    setIsModified(-1);
                };
            })
            .catch(err => console.log(err));
    };
    
    useEffect(() => {
        if(replyRef.current)
            replyRef.current.value = reply.reply;
    }, [isModified]);

    return (
        <ReplyStyle>
            {
                isModified === index ? 
                <form onSubmit={handleOnReplyModifySubmit}>
                    <ReplyInput 
                    required
                    ref={replyRef}
                    />
                </form>
                : <div style={{ width: '100%' }}>{ reply.reply }</div>
            }
            <ReplyInfo>
                {
                    isModified === index ? 
                    <Button 
                    clicked
                    onClick={() => setIsModified(-1)}
                    >c</Button>
                    : <>
                        <SmallText>{ reply.replier }</SmallText>
                        <SmallText>{ reply.regDate }</SmallText>
                        <Button 
                        clicked
                        onClick={deleteReply}
                        >x</Button>
                    </>
                }
                <Button 
                clicked
                onClick={modifyReply}
                >m</Button>
            </ReplyInfo>
        </ReplyStyle>
    )
};

export default React.memo(Reply);