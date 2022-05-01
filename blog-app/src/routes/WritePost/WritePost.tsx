import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { configAxios } from "../../axiosConfig";
import { Button, Container, TitleInput, ContentInput, Tag, TagInput } from "../../Styles/style";
import BASE_URL from "../../URLS";
import { getCookie } from "../../util/cookie";

const Header = styled.header`
    text-align: center;
    color: ${props => props.theme.accentColor};
    margin: 48px;
`;

const boardAxios = axios.create();

function WritePost() {

    boardAxios.interceptors.request.use(
        config => {
            if(config?.headers) 
                config.headers['Authorization'] = 
                    `Bearer ${getCookie('my_blog_userInfo')[1]}`;
            return config;
        }
    );

    const handleOnPostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const title = titleRef?.current?.value || '';
        const content = contentRef?.current?.value || '';
        const writer = getCookie('my_blog_userInfo')[0];

        boardAxios.post(`${BASE_URL}/posts/add_post`, 
            { title, content, hashtags: tagList, writer })
            
    };

    const nav = useNavigate();

    const quitWriting = () => {
        const confirm = 
            window.confirm('Are you sure to quit writing this post?');
        if(confirm) nav(-1);
    };

    const titleRef = useRef<HTMLInputElement>(null);

    const contentRef = useRef<HTMLTextAreaElement>(null);

    const inputTagRef = useRef<HTMLInputElement>(null);

    const [tagList, setTagList] = useState<String[]>([]);

    const addHashTag = () => {
        const newTag = inputTagRef.current?.value;
        if(newTag && !checkTagDuplicate(newTag)) {
            setTagList(tagList => {
                return [...tagList, newTag];
            });
            inputTagRef.current.value = '';
        };
    };

    const callAddHashTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.keyCode === 13) addHashTag();
    };

    const checkTagDuplicate = (newTag: string) => {
        let isTagDuplicate = false;
        tagList.forEach(tag => {
            if(tag === newTag) isTagDuplicate = true;
        });
        return isTagDuplicate;
    };

    const removeTag = (idx: number) => {
        setTagList(tagList => {
            const copied = [...tagList];
            copied.splice(idx, 1);
            return copied;
        });
    };

    useEffect(() => {
        if(!getCookie('my_blog_userInfo')) {
            alert('Post writing requires login!');
            nav(-1);
        }
    }, []);

    return (
        <Container>
            <Header>Let's write a post and share your story!</Header>
            <form onSubmit={handleOnPostSubmit}>
                <div>
                    <p>TITLE:</p>
                    &ensp;
                    <TitleInput
                    required
                    ref={titleRef}
                    />
                </div>
                <div 
                style={{ marginTop: '30px' }}
                >
                    <div>CONTENT:</div>
                    &ensp;
                    <ContentInput
                    required
                    ref={contentRef}
                    />
                </div>
                <div
                style={{ marginTop: '30px' }}
                >
                    <div>TAGS:</div>
                    <TagInput
                    ref={inputTagRef}
                    onKeyDown={callAddHashTag}
                    />
                    &nbsp;
                    <Button 
                    clicked
                    onClick={addHashTag}
                    >add</Button>
                    {
                        !tagList ? null :
                        <div>
                            { tagList.map((tag, i) => 
                            <Tag 
                            key={i}
                            onClick={() => removeTag(i)}
                            >{ "# " + tag }</Tag>) }
                        </div>
                    }
                </div>
                <hr></hr>
                <br></br>
                <div 
                style={{ textAlign: 'right' }}
                >
                    <Button 
                    clicked
                    >submit</Button>
                    <Button 
                    clicked
                    onClick={quitWriting}
                    >back</Button>
                </div>
            </form>
        </Container>
    )
};

export default WritePost;