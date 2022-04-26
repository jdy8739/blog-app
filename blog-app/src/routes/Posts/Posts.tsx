import axios from "axios";
import { useEffect } from "react";
import BASE_URL from "../../URLS";


function Posts() {

    const needSession = () => axios.get(`${BASE_URL}/member/needSession`);

    const fetchPosts = () => {
        
        axios.get(`${BASE_URL}/posts`)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };

    useEffect(() => {
        fetchPosts();
    });

    return (
        <>
            <p onClick={needSession}>posts</p>

        </>
    )
};

export default Posts;