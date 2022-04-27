import React from 'react';
import styled from 'styled-components';
import { IPostElement } from "../routes/Posts/Posts";
import { PostCard, PostContentPreview, PostLikes, PostTitle, PostWriter, Tag } from "../Styles/style";

const TagSection = styled.div`
    position: absolute;
    top: 0;
    right: 0;
`;

function Post({ post }: { post: IPostElement }) {

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
                <PostLikes>👍{ post.numberOfLikes}</PostLikes>
                <PostWriter>{ post.regDate + " - writer: " + post.writer }</PostWriter>
                <TagSection>
                    { post?.hashtag.map(tag => <Tag key={tag}>{ '# ' + tag }</Tag>) }
                </TagSection>
            </PostCard>
        </>
    )
};

export default React.memo(Post);