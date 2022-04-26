package com.example.demo.controller;

import com.example.demo.DTO.BoardWrapperDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class BoardController {

    @GetMapping("/")
    public ResponseEntity<BoardWrapperDTO> getAll() {

        return new ResponseEntity<BoardWrapperDTO>(HttpStatus.OK);
    }
}