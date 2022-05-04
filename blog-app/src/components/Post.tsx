import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { configAxios } from '../axiosConfig';
import { IPostElement } from "../routes/Posts/Posts";
import { PostCard, PostContentPreview, PostLikes, PostTitle, PostWriter, Tag } from "../Styles/style";
import BASE_URL from '../URLS';
import { getCookie, MY_BLOG_COOKIE_NAME } from '../util/cookie';

const TagSection = styled.div`
    position: absolute;
    top: 0;
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
                    isUpdated(!updated);
                })
                .catch(err => console.log(err));
        } else {
            alert('This requires login!');
        };
    };

    const [updated, isUpdated] = useState(false);

    return (
        <>
            <PostCard
            >
                <PostTitle>{ post.title }</PostTitle>
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
                    >{ "👍 " + post.numberOfLikes}</PostLikes> : null
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