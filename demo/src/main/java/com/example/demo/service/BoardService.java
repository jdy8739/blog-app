package com.example.demo.service;

import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.repository.BoardRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class BoardService implements BoardServiceImpl {

    BoardRepository boardRepository = new BoardRepository();

    public BoardWrapperDTO getPosts() {
        return boardRepository.getPosts();
    }
}
