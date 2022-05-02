package com.example.demo.service;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.ReplyDTO;


public interface BoardServiceImpl {

    public BoardWrapperDTO getPosts(Integer offset, Integer limit);

    public BoardDTO getPost(Integer postNo);

    public void savePost(BoardDTO boardDTO);

    public boolean deletePost(Integer postNo, String id);

    public void modifyPost(BoardDTO boardDTO);

    public void saveReply(ReplyDTO replyDTO);
}
