import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { configAxios } from '../axiosConfig';
import { IPostElement } from "../routes/Posts/Posts";
import { Button, PostCard, PostContentPreview, PostLikes, PostTitle, PostWriter, Tag } from "../Styles/style";
import BASE_URL from '../URLS';
import { getCookie, MY_BLOG_COOKIE_NAME } from '../util/cookie';

const TagSection = styled.div`
    position: absolute;
    bottom: 10px;
    right: 0;
`;

function Post({ post }: { post: IPostElement }) {

    const nav = useNavigate();

    const searchPostsByTag = (e: React.MouseEvent<HTMLParagraphElement>) => {
        e.stopPropagation();
        const tagText = 
            e.currentTarget.textContent?.split('# ')[1];
        nav(`/posts/hashtag/${tagText}/get?offset=0&limit=5`);
    };

    const handleLikesClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const cookie = getCookie(MY_BLOG_COOKIE_NAME);
        if(cookie) {
            configAxios.post(`${BASE_URL}/member/like/${cookie[0]}/${post.boardNo}`)
                .then(() => {
                    post.numberOfLikes ++;
                    post.liked = true;
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
            configAxios.post(`${BASE_URL}/member/cancel_like/${cookie[0]}/${post.boardNo}`)
                .then(() => {
                    post.numberOfLikes --;
                    post.liked = false;
                    setIsUpdated(!isUpdated);
                })
                .catch(err => console.log(err));
        } else {
            alert('This requires login!');
        };
    };

    const [isUpdated, setIsUpdated] = useState(false);

    return (
        <>
            <PostCard
            >
                <PostTitle>
                    { 
                        post.title.length > 17 ?
                        post.title.slice(0, 17) + "..." :
                        post.title
                    }
                </PostTitle>
                <PostContentPreview>
                    { 
                        post.content.length > 60 ? 
                        post.content.slice(0, 60) + "..." : 
                        post.content 
                    }
                </PostContentPreview>
                {
                    !post.liked ?
                    <PostLikes
                    onClick={handleLikesClick}
                    >{ "👍 " + post.numberOfLikes}</PostLikes> : 
                    <div style={{ textAlign: 'right' }}>
                        <Button
                        clicked
                        onClick={handleLikesCancelClick}
                        >
                            { "👍 " + post.numberOfLikes }
                        </Button>
                    </div>
                }
                <PostWriter>{ post.regDate + " - writer: " + post.writer }</PostWriter>
                <TagSection>
                    { 
                        post?.hashtags.map(tag => <Tag 
                            key={tag}
                            onClick={searchPostsByTag}
                            >{ '# ' + tag }</Tag>) 
                    }
                </TagSection>
            </PostCard>
        </>
    )
};

export default React.memo(Post);