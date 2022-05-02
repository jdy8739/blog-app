package com.example.demo.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReplyDTO {
    private Long replyNo;
    private Long boardNo;
    private String replier;
    private String reply;
    private String regDate;
}
