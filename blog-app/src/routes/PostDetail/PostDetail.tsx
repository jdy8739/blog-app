import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { configAxios } from "../../axiosConfig";
import { Button, Container, Tag } from "../../Styles/style";
import BASE_URL from "../../URLS";
import { getCookie, MY_BLOG_COOKIE_NAME } from "../../util/cookie";
import { IPostElement } from "../Posts/Posts";

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

function PostDetail() {

    const postMatch = useMatch('/posts/detail/:id');

    const fetchPost = async () => {
        if(postMatch) {
            const post = 
                await fetch(`${BASE_URL}/posts/get_detail/${postMatch.params.id}`)
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
                        if(res) nav(-1);
                        else alert('This is an unvalid Order.');
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
                    <div style={{
                        textAlign: 'center',
                        marginTop: '48px'
                    }}
                    >
                        <Button 
                        clicked
                        >like</Button>
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
                </>
            }
        </Container>
    )
};

export default PostDetail;