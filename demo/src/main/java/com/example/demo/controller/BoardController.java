package com.example.demo.controller;

import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.service.BoardService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Slf4j
@Controller
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class BoardController {

    @Autowired
    BoardService boardService;

    @GetMapping("/all")
    public ResponseEntity<BoardWrapperDTO> getAll() {
        log.info("getAll(): ");
        return new ResponseEntity<BoardWrapperDTO>(boardService.getPosts(), HttpStatus.OK);
    }
}