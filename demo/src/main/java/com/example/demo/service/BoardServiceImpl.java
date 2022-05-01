package com.example.demo.service;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;


public interface BoardServiceImpl {

    public BoardWrapperDTO getPosts(Integer offset, Integer limit);

    public BoardDTO getPost(Integer postNo);

    public void savePost(BoardDTO boardDTO);
}
