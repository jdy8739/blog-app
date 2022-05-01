package com.example.demo.controller;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.DTO.BoardWrapperDTO;
import com.example.demo.JWT.JWTUtils;
import com.example.demo.service.BoardService;

import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@Controller
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class BoardController {

    @Autowired
    BoardService boardService;

    JWTUtils jwtUtils = new JWTUtils();

    @GetMapping("/get")
    public ResponseEntity<BoardWrapperDTO> getPosts(
            @RequestParam Integer offset,
            @RequestParam Integer limit) {
        log.info("getPosts(): " + offset + ", " + limit);
        return new ResponseEntity<BoardWrapperDTO>(
                boardService.getPosts(offset, limit), HttpStatus.OK);
    }

    @GetMapping("/{subject}/{keyword}/get")
    public ResponseEntity<BoardWrapperDTO> getPostsByKeyword(
            @PathVariable String subject,
            @PathVariable String keyword,
            @RequestParam Integer offset,
            @RequestParam Integer limit) {
            log.info("subject: " + subject + ", keyword: " + keyword);
            log.info("getPosts(): " + offset + ", " + limit);
        return ResponseEntity.ok()
                .body(boardService.getPostsByKeyword(
                        subject, keyword, offset, limit));
    }

    @GetMapping("/get_detail/{postNo}")
    public ResponseEntity<BoardDTO> getPost(@PathVariable int postNo) {
        log.info("getPost(): " + postNo);
        return ResponseEntity.ok()
                .body(boardService.getPost(postNo));
    }

    @PostMapping("/add_post")
    public ResponseEntity<Void> addPost(
            @Validated @RequestBody BoardDTO boardDTO,
            HttpServletRequest req) {

        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            Claims claims = jwtUtils.filterInternal(authorizationHeader);
            if(!claims.get("id").equals(boardDTO.getWriter())) {
                headers.set("isIdAndTokenMatch", "false");
            } else {
                boardService.savePost(boardDTO);
                log.info("Post has saved.");
            }
        } catch (Exception e) {
            log.info("This token is invalid!");
            headers.set("isValidToken", "false");
        } finally {
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(null);
        }
    }

    @DeleteMapping("/delete_post/{postNo}")
    public ResponseEntity<Void> deletePost(
            @PathVariable("postNo") int postNo,
            HttpServletRequest req) {
        HttpHeaders headers = new HttpHeaders();
        String authorizationHeader = req.getHeader(HttpHeaders.AUTHORIZATION);

        return new ResponseEntity<Void>(HttpStatus.OK);
    }
}