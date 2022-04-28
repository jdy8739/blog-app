import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button, Container, Tag } from "../../Styles/style";
import BASE_URL from "../../URLS";
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

    return (
        <Container>
            <Title>{ post?.title }</Title>
            <Info>{ 'saved at - ' + post?.regDate }</Info>
            <Info>{ 'writer - ' + post?.writer }</Info>
            &emsp;
            <Content>{ post?.content }</Content>
            <div style={{ height: '300px' }}></div>
            <div style={{ textAlign: 'right' }}>
                {
                    post?.hashtags.map(tag => <Tag key={tag}>{ '# ' + tag }</Tag>)
                }
            </div>
            <div style={{
                textAlign: 'center',
                marginTop: '48px'
            }}
            >
                <Button clicked={true}>like</Button>
                <Button 
                clicked={true}
                onClick={() => nav(-1)}
                >back</Button>
            </div>
        </Container>
    )
};

export default PostDetail;