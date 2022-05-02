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

function Reply({ reply }: { reply: IReply }) {

    const deleteReply = () => {
        configAxios.delete(
            `${BASE_URL}/posts/delete_reply/${reply.boardNo}/${reply.replyNo}`)
            .then(() => {
                alert('?')
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