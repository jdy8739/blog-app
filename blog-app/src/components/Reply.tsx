import React from "react";
import styled from "styled-components";
import { configAxios } from "../axiosConfig";
import { IReply } from "../routes/Posts/Posts";
import { Button } from "../Styles/style";
import BASE_URL from "../URLS";

const ReplyStyle = styled.div`
    border-bottom: 1px solid ${props => props.theme.accentColor};
    height: 100px;
    position: relative;
    padding-top: 9px;
    box-sizing: border-box;
`;

const ReplyInfo = styled.div`
    position: absolute;
    right: 0;
    text-align: right;
`;

const SmallText = styled.p`
    font-size: 11px;
    margin: 4px;
`;

type ISetReply = (updatedReplies: IReply[]) => void;

function Reply({ reply, setReply }: { reply: IReply, setReply: ISetReply }) {

    const deleteReply = () => {
        configAxios.delete(
            `${BASE_URL}/posts/delete_reply/${reply.boardNo}/${reply.replyNo}`)
            .then(res => {
                const isAccessValid = res.headers['isaccessvalid'];
                if(isAccessValid) {
                    if(!JSON.parse(isAccessValid)) {
                        alert('You cannot delete this reply, since you did not reply this comment!');
                    };
                } else {
                    setReply(res.data);
                };
            })
            .catch(err => console.log(err));
    };

    return (
        <ReplyStyle>
            <div style={{ width: '100%' }}>{ reply.reply }</div>
            <ReplyInfo>
                <SmallText>{ reply.replier }</SmallText>
                <SmallText>{ reply.regDate }</SmallText>
                <Button 
                clicked>m</Button>
                <Button 
                clicked
                onClick={deleteReply}
                >x</Button>
            </ReplyInfo>
        </ReplyStyle>
    )
};

export default React.memo(Reply);