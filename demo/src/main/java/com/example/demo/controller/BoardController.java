package com.example.demo.controller;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.service.BoardService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Controller
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class BoardController {

    @Autowired
    BoardService boardService;

    @GetMapping("/get")
    public ResponseEntity<BoardWrapperDTO> getPosts(
            @RequestParam Integer offset,
            @RequestParam Integer limit) {
        log.info("getPosts(): " + offset + ", " + limit);
        return new ResponseEntity<BoardWrapperDTO>(
                boardService.getPosts(offset, limit), HttpStatus.OK);
    }

    @GetMapping("/get_detail/{postNo}")
    public ResponseEntity<BoardDTO> getPost(@PathVariable int postNo) {
        log.info("getPost(): " + postNo);
        return ResponseEntity.ok()
                .body(boardService.getPost(postNo));
    }
}