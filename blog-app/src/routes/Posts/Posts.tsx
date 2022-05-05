import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { configAxios } from "../../axiosConfig";
import Post from "../../components/Post";
import { Container, Highlight, Button } from "../../Styles/style";
import BASE_URL from "../../URLS";
import { getCookie } from "../../util/cookie";

export interface IPostElement {
    boardNo: number;
    writer: String; 
    title: string;
    content: string;
    numberOfLikes: number;
    hashtags: string[];
    regDate: string;
    replyList: IReply[];
    liked: boolean;
};

export interface IReply {
    replyNo?: number;
    boardNo?: number;
    replier: string;
    reply: string;
    regDate: string;
};

interface IBoard {
    [key: string]: IPostElement
};

interface IPost {
    limit: number;
    offset: number;
    total: number;
    boards: IBoard
};

const Frame = styled.div`
    border-bottom: 1px solid ${props => props.theme.accentColor};
`

const DEFAULT_OFFSET = 0;

const DEFAULT_LIMIT = 5;

type TKeyword = 'title' | 'writer' | 'hashtag' | 'favlist' | '';

function Posts() {
    
    const [posts, setPosts] = useState<IPost>();

    const [isLoading, setIsLoading] = useState(true);

    const [indexArr, setIndexArr] = useState<number[]>();

    const nav = useNavigate();

    const location = useLocation();

    let target = location.pathname.split('/')[2];

    let subject: TKeyword = '';

    let keyword = '';

    const catchSubjectAndKeywordName = () => {
        if(
            target === 'title' || 
            target === 'writer' || 
            target === 'hashtag' || 
            target === 'favlist') {
            subject = target;
            keyword = location.pathname.split('/')[3];
        };
    };

    catchSubjectAndKeywordName();

    const paramsSearcher = new URLSearchParams(location.search);

    const limit = 
        paramsSearcher.get('limit') || DEFAULT_LIMIT;

    const offset = 
        paramsSearcher.get('offset') || DEFAULT_OFFSET;

    const fetchPosts = () => {
        configAxios.get<IPost>(
            `${BASE_URL}/posts${subject ? '/' + subject : ''}${
            keyword ? '/' + keyword : ''}/get?offset=${offset}&limit=${limit}`
            )
            .then(res => {
                setPosts(res.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    };

    const makeIndex = () => {
        let lastPageIdx = 0;
        if(posts) {
            lastPageIdx = Math.ceil(posts.total / posts.limit);
        };
        const tmpIndexArr = [];
        for(let i=0; i<lastPageIdx; i++) {
            tmpIndexArr.push(i);
        };
        setIndexArr([...tmpIndexArr]);
    };

    const handleOnLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const limit = e.currentTarget.value;
        nav(`/posts${subject ? '/' + subject : ''}${
            keyword ? '/' + keyword : ''}/get?offset=0&limit=${limit}`);
    };

    const setOffset = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav(`/posts${subject ? '/' + subject : ''}${
            keyword ? '/' + keyword : ''}/get?offset=${+e.currentTarget.innerText - 1}&limit=${limit}`);
    };

    useEffect(() => {
        fetchPosts();
    }, [limit, offset, subject, keyword]);

    useEffect(() => {
        makeIndex();
    }, [posts]);

    const isPostsEmpty = (param: IBoard) => 
        Object.keys(param).length === 0 && param.constructor === Object;

    return (
        <>
            {
                isLoading ? <p>Loading... Please wait.</p> :
                <>
                    {
                        posts ? 
                        <Container>
                            <div style={{ textAlign: 'center' }}>
                                { 
                                    subject ? 
                                    <>
                                        { "search for " + subject } 
                                        &ensp;
                                        <Highlight>{ window.decodeURI(keyword) }</Highlight>
                                    </> : null 
                                }
                            </div>
                            <div style={{ 
                                textAlign: 'right',
                                marginBottom: '100px'
                            }}
                            >
                                <span>contents in a page</span>
                                &ensp;
                                <select 
                                onChange={handleOnLimitChange} 
                                value={limit || 5}
                                >
                                    <option>5</option>
                                    <option>15</option>
                                    <option>30</option>
                                </select>
                            </div>
                            {
                                isPostsEmpty(posts.boards) ?
                                <div style={{ textAlign: 'center' }}>Sorry. No data. :(</div> : null
                            }
                            {Object.keys(posts.boards).map(postNo => {
                                return (
                                    <Frame
                                    key={postNo}
                                    onClick={() => nav(`/posts/detail/${+postNo}`)}
                                    >
                                        <Post
                                        post={posts.boards[postNo]}
                                        />
                                    </Frame>
                                )
                            })}
                            { 
                                indexArr ? 
                                <div style={{
                                    textAlign: 'center',
                                    margin: '50px'
                                }}
                                >{ indexArr.map(idx => 
                                <Button
                                key={idx}
                                onClick={setOffset}
                                clicked={offset ? +offset === idx : false}
                                >{ idx + 1 }</Button>) }</div> : null
                            }
                        </Container> : null 
                    }
                </>
            }
        </>
    )
};

export default Posts;