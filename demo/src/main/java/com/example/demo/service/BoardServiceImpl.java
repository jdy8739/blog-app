package com.example.demo.service;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.ReplyDTO;

import java.util.List;


public interface BoardServiceImpl {

    public BoardWrapperDTO getPosts(Integer offset, Integer limit);

    public BoardDTO getPost(Integer postNo);

    public void savePost(BoardDTO boardDTO);

    public boolean deletePost(Integer postNo, String id);

    public void modifyPost(BoardDTO boardDTO);

    public List<ReplyDTO> saveReply(ReplyDTO replyDTO);

    public List<ReplyDTO> deleteReply(
            Integer postNo, Integer replyNo, String id) throws Exception;

    public List<ReplyDTO> modifyReply(ReplyDTO replyDTO, String id) throws Exception;
}
