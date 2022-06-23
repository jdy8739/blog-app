package com.example.demo.service;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.MemberDTO;
import com.example.demo.DTO.ReplyDTO;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

public interface BoardService {

    public BoardWrapperDTO getPosts(Integer offset, Integer limit, String id);

    public BoardWrapperDTO getPostsByKeyword(
            String subject, String keyword,
            Integer offset, Integer limit, String id);

    public BoardDTO getPost(Integer postNo, String id);

    public void savePost(BoardDTO boardDTO);

    public boolean deletePost(Integer postNo, String id);

    public void modifyPost(BoardDTO boardDTO);

    public List<ReplyDTO> saveReply(ReplyDTO replyDTO);

    public List<ReplyDTO> deleteReply(
            Integer postNo, Integer replyNo, String id) throws HttpClientErrorException;

    public List<ReplyDTO> modifyReply(ReplyDTO replyDTO, String id) throws HttpClientErrorException;
}
