import axios from "axios";
import { useEffect, useState } from "react";
import { Container, PostCard, PostContentPreview, PostTitle, PostWriter, PostLikes, Button } from "../../Styles/style";
import BASE_URL from "../../URLS";

interface IPostElement {
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

function Posts() {

    const needSession = () => axios.get(`${BASE_URL}/member/needSession`);

    const [posts, setPosts] = useState<IPost>();

    const [isLoading, setIsLoading] = useState(true);

    const [indexArr, setIndexArr] = useState<number[]>();

    const fetchPosts = () => {
        axios.get(`${BASE_URL}/posts/all`)
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

    useEffect(() => {
        fetchPosts();
    }, []);

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
                            }}>
                                <span>contents in a page</span>
                                &ensp;
                                <select>
                                    <option>5</option>
                                    <option>15</option>
                                    <option>30</option>
                                </select>
                            </div>
                            { Object.keys(posts.boards).map(postNo => {
                                return (
                                    <PostCard key={postNo}>
                                        <PostTitle>{ posts.boards[postNo].title }</PostTitle>
                                        <PostContentPreview>
                                            { 
                                                posts.boards[postNo].content.length > 60 ? 
                                                posts.boards[postNo].content.slice(0, 60) + "..." : 
                                                posts.boards[postNo].content 
                                            }
                                        </PostContentPreview>
                                        <PostLikes>👍{ posts.boards[postNo].numberOfLikes}</PostLikes>
                                        <PostWriter>{ posts.boards[postNo].regDate + " - writer: " + posts.boards[postNo].writer }</PostWriter>
                                    </PostCard>
                                )
                            })}
                            { 
                                indexArr ? 
                                <div style={{
                                    textAlign: 'center',
                                    margin: '50px'
                                }}
                                >{ indexArr.map(idx => <Button key={idx}>{ idx + 1 }</Button>) }</div> : null
                            }
                        </Container> : null 
                    }
                </>
            }
        </>
    )
};

export default Posts;