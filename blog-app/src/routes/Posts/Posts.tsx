import axios from "axios";
import BASE_URL from "../../URLS";


function Posts() {

    const needSession = () => {
        axios.post(`${BASE_URL}/member/needSession`)
    };

    return (
        <>
            <p onClick={needSession}>posts</p>
        </>
    )
};

export default Posts;