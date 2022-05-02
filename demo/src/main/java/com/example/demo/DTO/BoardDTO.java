package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class BoardDTO {
    private Long boardNo;
    private String writer;
    private String title;
    private String content;
    private List<String> hashtags;
    private int numberOfLikes;
    private String regDate;
    private List<ReplyDTO> replyList;

    public BoardDTO() {
        this.numberOfLikes = 0;
    }
}
