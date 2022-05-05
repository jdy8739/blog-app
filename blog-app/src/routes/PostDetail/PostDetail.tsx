import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { configAxios } from "../../axiosConfig";
import Reply from "../../components/Reply";
import { Button, Container, Tag, TitleInput } from "../../Styles/style";
import BASE_URL from "../../URLS";
import { getCookie, MY_BLOG_COOKIE_NAME } from "../../util/cookie";
import { IPostElement, IReply } from "../Posts/Posts";

const Title = styled.h1`
    font-size: 31px;
    border-bottom: 1px solid ${props => props.theme.accentColor};
`;

const Info = styled.h5`
    font-size: 12px;
    text-align: right;
    margin: 12px 0;
`;

const Content = styled.div`
    margin-top: 25px;
`;

const ReplyInput = styled(TitleInput)`
`;

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

type DateFormatType = Date | string | number;

const formatDate = (date: Date) => {
    let month: DateFormatType = date.getMonth() + 1;
    let day: DateFormatType = date.getDate();
    let hour: DateFormatType = date.getHours();
    let minute: DateFormatType = date.getMinutes();
    let second: DateFormatType = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute;
};

function PostDetail() {

    const postMatch = useMatch('/posts/detail/:id');

    const fetchPost = async () => {
        if(postMatch) {
            const url = `${BASE_URL}/posts/get_detail/${postMatch.params.id}`;
            const cookie = getCookie(MY_BLOG_COOKIE_NAME) || ['', ''];
            const post = 
                await fetch(url, { 
                    headers: {
                        Authorization: `Bearer ${cookie[1]}`,
                        "Content-Type": "application/json"
                    }
                })
            return await post.json();
        } else return null;
    };

    const { isLoading, data: post } = 
        useQuery<IPostElement>(['post', postMatch?.params.id], fetchPost);

    const nav = useNavigate();

    const searchPostsByTag = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation();
        const tagText = 
            e.currentTarget.textContent?.split('# ')[1];
        nav(`/posts/hashtag/${tagText}/get?offset=0&limit=5`);
    };

    const deletePost = (postNo?: number) => {
        if(postNo == 0 || postNo) {
            const deleteConfirm = 
                window.confirm('Are you sure to delete this post?');
            if(deleteConfirm) {
                configAxios.delete(`${BASE_URL}/posts/delete_post/${postNo}`)
                    .then((res) => {
                        if(res) nav('/posts');
                        else alert('This is an unvalid order.');
                    })
                    .catch(err => console.log(err));
            };
        };
    };

    const isMyPost = () :boolean => {
        const cookie = getCookie(MY_BLOG_COOKIE_NAME);
        if(cookie)
            return cookie[0] === post?.writer;
        return false;
    };

    const replyInputRef = useRef<HTMLInputElement>(null);

    const handleOnReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(getCookie(MY_BLOG_COOKIE_NAME)) {
            const newReply: IReply = {
                boardNo: post?.boardNo,
                replier: getCookie(MY_BLOG_COOKIE_NAME)[0],
                reply: replyInputRef?.current?.value || '',
                regDate: formatDate(new Date())
            };
            configAxios.post<IReply[]>(`${BASE_URL}/posts/add_reply`, newReply)
                .then((res) => {
                    if(post) {
                        //console.log(res.data ? res.data : 'x');
                        post.replyList = res.data;
                    };
                    if(replyInputRef?.current) 
                        replyInputRef.current.value = '';
                    setIsUpdated(!isUpdated);
                })
                .catch(err => console.log(err));
        } else {
            alert('To add a reply, you must login.');
        };
    };

    const [isModified, setIsModified] = useState(-1);

    const setReply = (updatedReplies: IReply[]) => {
        if(post) {
            post.replyList = updatedReplies;
            setIsUpdated(!isUpdated);
        };
    };

    const handleLikesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const cookie = getCookie(MY_BLOG_COOKIE_NAME);
        if(cookie) {
            configAxios.post(`${BASE_URL}/member/like/${cookie[0]}/${post?.boardNo}`)
                .then(() => {
                    if(post) {
                        post.numberOfLikes ++;
                        post.liked = true;
                    };
                    setIsUpdated(!isUpdated);
                })
                .catch(err => console.log(err));
        } else {
            alert('This requires login!');
        };
    };

    const handleLikesCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const cookie = getCookie(MY_BLOG_COOKIE_NAME);
        if(cookie) {
            configAxios.post(`${BASE_URL}/member/cancel_like/${cookie[0]}/${post?.boardNo}`)
                .then(() => {
                    if(post) {
                        post.numberOfLikes --;
                        post.liked = false;
                    };
                    setIsUpdated(!isUpdated);
                })
                .catch(err => console.log(err));
        } else {
            alert('This requires login!');
        };
    };

    const [isUpdated, setIsUpdated] = useState(false);

    return (
        <Container>
            {
                isLoading ? null :
                <>
                    <Title>{ post?.title }</Title>
                    <Info>{ 'saved at - ' + post?.regDate }</Info>
                    <Info>{ 'writer - ' + post?.writer }</Info>
                    &emsp;
                    <Content>{ post?.content }</Content>
                    <div style={{ height: '300px' }}></div>
                    <div style={{ textAlign: 'right' }}>
                        {
                            post?.hashtags.map(tag => 
                                <Tag 
                                key={tag}
                                onClick={searchPostsByTag}
                                >{ '# ' + tag }</Tag>)
                        }
                    </div>
                    <div style={{ marginTop: '28px' }}>
                        <NumberOfLikes>{ post?.numberOfLikes }</NumberOfLikes>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        marginTop: '28px'
                    }}
                    >
                        {
                            !post?.liked ? 
                            <Button
                            onClick={handleLikesClick}
                            >like 👍</Button> : 
                            <Button 
                            clicked
                            onClick={handleLikesCancelClick}
                            >like 👍</Button>
                        }
                        <Button 
                        clicked
                        onClick={() => nav(-1)}
                        >back</Button>
                        {
                            isMyPost() ?
                            <>
                                <Button
                                clicked
                                onClick={() => nav('/modify/' + post?.boardNo)}
                                >modify</Button>
                                <Button
                                clicked
                                onClick={() => deletePost(post?.boardNo)}
                                >delete</Button>
                            </> : null
                        } 
                    </div>
                    <br></br>
                    <br></br>
                    <div>
                        <form onSubmit={handleOnReplySubmit}>
                            <span>REPLY:</span>
                            <Button clicked>add</Button>
                            &ensp;
                            <ReplyInput 
                            required
                            ref={replyInputRef}
                            />
                        </form>
                    </div>
                    <br></br>
                    {
                        post?.replyList?.map((reply, i) => 
                        <Reply 
                        key={i} 
                        reply={reply}
                        setReply={setReply}
                        isModified={isModified}
                        setIsModified={setIsModified}
                        index={i}
                        />)
                    }
                </>
            }
        </Container>
    )
};

export default PostDetail;