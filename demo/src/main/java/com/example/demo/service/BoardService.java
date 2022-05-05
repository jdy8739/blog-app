package com.example.demo.service;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.DTO.MemberDTO;
import com.example.demo.DTO.ReplyDTO;
import com.example.demo.repository.BoardRepository;
import com.example.demo.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

@Slf4j
@Service
public class BoardService implements BoardServiceImpl {

    @Autowired
    BoardRepository boardRepository;

    @Autowired
    MemberRepository memberRepository;

    public BoardWrapperDTO getPosts(Integer offset, Integer limit, String id) {
        BoardWrapperDTO boardWrapperDTO = boardRepository.getPosts(offset, limit);
        return filterLikeTrueOrFalse(id, boardWrapperDTO);
    }

    public BoardDTO getPost(Integer postNo, String id) {
        BoardDTO boardDTO = boardRepository.getPost(postNo);
        boardDTO.setLiked(false);
        if(id != null) {
            List<Integer> likesList = memberRepository.getLikedList(id);
            int targetNum = boardDTO.getBoardNo().intValue();
            for (int i = 0; i < likesList.size(); i++) {
                if (targetNum == likesList.get(i)) {
                    boardDTO.setLiked(true);
                    break;
                }
            }
        }
        return boardDTO;
    }

    public BoardWrapperDTO getPostsByKeyword(
            String subject,
            String keyword,
            Integer offset,
            Integer limit,
            String id) {
        BoardWrapperDTO boardWrapperDTO =
                boardRepository.getPostsByKeyword(subject, keyword, offset, limit);
        return filterLikeTrueOrFalse(id, boardWrapperDTO);
    }

    private BoardWrapperDTO filterLikeTrueOrFalse(
            String id,
            BoardWrapperDTO boardWrapperDTO) {
        if (id != null) {
            List<Integer> likesList = memberRepository.getLikedList(id);
            LinkedHashMap<Integer, BoardDTO> boardMap =
                    (LinkedHashMap) boardWrapperDTO.getBoards();
            for (Iterator<BoardDTO> map = boardMap.values().iterator(); map.hasNext(); ) {
                BoardDTO boardDTO = map.next();
                int targetNum = boardDTO.getBoardNo().intValue();
                for (int i = 0; i < likesList.size(); i++) {
                    if (targetNum == likesList.get(i)) {
                        boardDTO.setLiked(true);
                        break;
                    }
                }
            }
        }
        return boardWrapperDTO;
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

    public List<ReplyDTO> modifyReply(ReplyDTO replyDTO, String id) throws Exception {
        return boardRepository.modifyReply(replyDTO, id);
    }
}
