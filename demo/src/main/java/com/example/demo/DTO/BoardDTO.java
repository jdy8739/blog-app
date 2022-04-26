package com.example.demo.DTO;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class BoardDTO {
    private Long boardNo;
    private String writer;
    private String content;
    private String[] hashtag;
    private int numberOfLikes;

    public BoardDTO() {
        this.numberOfLikes = 0;
    }
}
