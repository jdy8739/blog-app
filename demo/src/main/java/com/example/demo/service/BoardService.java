package com.example.demo.service;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.ReplyDTO;
import com.example.demo.repository.BoardRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class BoardService implements BoardServiceImpl {

    BoardRepository boardRepository = new BoardRepository();

    public BoardWrapperDTO getPosts(Integer offset, Integer limit) {
        return boardRepository.getPosts(offset, limit);
    }

    public BoardDTO getPost(Integer postNo) {
        return boardRepository.getPost(postNo);
    }

    public BoardWrapperDTO getPostsByKeyword(
            String subject,
            String keyword,
            Integer offset,
            Integer limit) {
        return boardRepository.getPostsByKeyword(subject, keyword, offset, limit);
    }

    public void savePost(BoardDTO boardDTO) {
        boardRepository.save(boardDTO);
    }

    public boolean deletePost(Integer postNo, String id) {
        BoardDTO boardDTO = boardRepository.getPost(postNo);
        if(boardDTO.getWriter().equals(id)) {
            boardRepository.deletePost(postNo);
            return true;
        } else return false;
    }

    public void modifyPost(BoardDTO boardDTO) {
        boardRepository.modifyPost(boardDTO);
    }

    public List<ReplyDTO> saveReply(ReplyDTO replyDTO) {
        return boardRepository.saveReply(replyDTO);
    }

    public List<ReplyDTO> deleteReply(
            Integer postNo, Integer replyNo, String id) throws Exception {
        return boardRepository.deleteReply(postNo, replyNo, id);
    }
}
