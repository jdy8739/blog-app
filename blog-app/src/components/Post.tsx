import React from 'react';
import { IPostElement } from "../routes/Posts/Posts";
import { PostCard, PostContentPreview, PostLikes, PostTitle, PostWriter } from "../Styles/style";

function Post({ post }: { post: IPostElement }) {
    return (
        <>
            <PostCard>
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
            </PostCard>
        </>
    )
};

export default React.memo(Post);