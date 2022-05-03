import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { IPostElement } from "../routes/Posts/Posts";
import { PostCard, PostContentPreview, PostLikes, PostTitle, PostWriter, Tag } from "../Styles/style";

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
        
    };

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
                <PostLikes
                onClick={handleLikesClick}
                >{ "👍 " + post.numberOfLikes}</PostLikes>
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