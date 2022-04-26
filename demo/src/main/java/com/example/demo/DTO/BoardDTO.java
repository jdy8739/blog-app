package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class BoardDTO {
    private Long boardNo;
    private String writer;
    private String title;
    private String content;
    private String[] hashtag;
    private int numberOfLikes;
    private String regDate;

    public BoardDTO() {
        this.numberOfLikes = 0;
    }
}
