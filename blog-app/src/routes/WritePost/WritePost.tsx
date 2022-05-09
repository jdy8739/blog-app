import React, { useEffect, useRef, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { configAxios, configModifyAxios } from "../../axiosConfig";
import { Button, Container, TitleInput, ContentInput, Tag, TagInput } from "../../Styles/style";
import BASE_URL from "../../URLS";
import { getCookie, MY_BLOG_COOKIE_NAME } from "../../util/cookie";
import { IPostElement } from "../Posts/Posts";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Header = styled.header`
    text-align: center;
    color: ${props => props.theme.accentColor};
    margin: 48px;
`;

function WritePost() {

    const writeMatch = useMatch('/write');

    const modifyMatch = useMatch('/modify/:postNo');

    const handleOnPostSubmit = () => {
        const title = titleRef?.current?.value || '';
        const content = contentRef?.current?.value || '';
        const writer = getCookie(MY_BLOG_COOKIE_NAME)[0];

        if(writeMatch && !modifyMatch) {
            configAxios.post(`${BASE_URL}/posts/add_post`, 
            { title, content, hashtags: tagList, writer })
            .then(() => {
                alert('New Post has registered.');
                nav('/posts');
            })
            .catch(err => console.log(err));
        } else {
            configAxios.put(`${BASE_URL}/posts/modify_post`, 
            { 
                boardNo: post?.boardNo,
                title, 
                content, 
                hashtags: tagList, 
                writer, 
                regDate: post?.regDate
            })
            .then(() => {
                alert('Post has modified.');
                nav('/posts/detail/' + modifyMatch?.params.postNo);
            })
            .catch(err => console.log(err));
        }
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

    const [post, setPost] = useState<IPostElement>();

    const getPostAndCheckValidation = () => {
        configModifyAxios.get<IPostElement>(
            `${BASE_URL}/posts/get_detail/${modifyMatch?.params.postNo}`)
            .then(res => setPost(res.data))
            .catch(err => {
                if(err.response.status === 401) {
                    alert('You cannot access this post for modification!');
                    nav(-1);
                };
            });
    };

    useEffect(() => {
        if(!getCookie(MY_BLOG_COOKIE_NAME)) {
            alert('Post writing requires login!');
            nav(-1);
        }
        if(modifyMatch) {
            getPostAndCheckValidation();
        };
    }, []);

    useEffect(() => {
        if(titleRef.current) {
            titleRef.current.value = post?.title || '';
        };
        if(contentRef.current) {
            contentRef.current.value = post?.content || '';
        };
        setTagList(() => {
            return [...post?.hashtags || []];
        });
    }, [post]);

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>{ 'MY BLOG WRITE' }</title>
                </Helmet>
            </HelmetProvider>
            <Container>
                <Header>
                    {
                        writeMatch && !modifyMatch ? 
                        "Let's write a post and share your story!" :
                        "Make a modify your post. You may show it more specific. :)"
                    }
                </Header>
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
                    onClick={handleOnPostSubmit}
                    >submit</Button>
                    <Button 
                    clicked
                    onClick={quitWriting}
                    >back</Button>
                </div>
            </Container>
        </>
    )
};

export default WritePost;