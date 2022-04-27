import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Post from "../../components/Post";
import { Container, PostCard, PostContentPreview, PostTitle, PostWriter, PostLikes, Button } from "../../Styles/style";
import BASE_URL from "../../URLS";

export interface IPostElement {
    boardNo: number;
    writer: String; 
    title: string;
    content: string;
    numberOfLikes: number;
    hashtag: string[];
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

const DEFAULT_OFFSET = 0;

const DEFAULT_LIMIT = 5;

function Posts() {

    const needSession = () => axios.get(`${BASE_URL}/member/needSession`);

    const [posts, setPosts] = useState<IPost>();

    const [isLoading, setIsLoading] = useState(true);

    const [indexArr, setIndexArr] = useState<number[]>();

    const nav = useNavigate();

    const location = useLocation();

    const paramsSearcher = new URLSearchParams(location.search);

    const limit = paramsSearcher.get('limit') || DEFAULT_LIMIT;

    const offset = paramsSearcher.get('offset') || DEFAULT_OFFSET;

    const fetchPosts = () => {
        axios.get(`${BASE_URL}/posts/get?offset=${offset}&limit=${limit}`)
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
        nav(`/posts/get?offset=0&limit=${limit}`);
    };

    const setOffset = (e: React.MouseEvent<HTMLButtonElement>) => {
        nav(`/posts/get?offset=${+e.currentTarget.innerText - 1}&limit=${limit}`);
    };

    useEffect(() => {
        fetchPosts();
    }, [limit, offset]);

    useEffect(() => {
        makeIndex();
    }, [posts]);

    return (
        <>
            <p onClick={needSession}>posts</p>
            {
                isLoading ? <p>Loading... Please wait.</p> :
                <>
                    {
                        posts ? 
                        <Container>
                            <div style={{ 
                                textAlign: 'right',
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
                            {Object.keys(posts.boards).map(postNo => {
                                return (
                                    <div 
                                    key={postNo}
                                    onClick={() => nav(`/posts/detail/${+postNo}`)}
                                    >
                                        <Post
                                        post={posts.boards[postNo]}
                                        />
                                    </div>
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